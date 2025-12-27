<?php
require_once 'config.php';

$method = getRequestMethod();
$input = getJsonInput();

// Get bookings
if ($method === 'GET') {
    $user_id = $_GET['user_id'] ?? null;
    $status = $_GET['status'] ?? null;

    $query = "SELECT b.*, m.title, m.poster_image FROM bookings b JOIN movies m ON b.movie_id = m.id WHERE 1=1";

    if ($user_id) {
        $user_id = intval($user_id);
        $query .= " AND b.user_id = $user_id";
    }

    if ($status) {
        $status = sanitize($status);
        $query .= " AND b.status = '$status'";
    }

    $query .= " ORDER BY b.booking_date DESC";
    $result = $conn->query($query);

    $bookings = [];
    while ($row = $result->fetch_assoc()) {
        // Get seat numbers for this booking
        $booking_id = intval($row['id']);
        $seats_query = "SELECT seat_number FROM booking_items WHERE booking_id = $booking_id ORDER BY seat_number";
        $seats_result = $conn->query($seats_query);
        
        $seat_numbers = [];
        while ($seat_row = $seats_result->fetch_assoc()) {
            $seat_numbers[] = $seat_row['seat_number'];
        }
        
        $row['seat_numbers'] = $seat_numbers;
        $bookings[] = $row;
    }

    sendResponse(true, 'Bookings retrieved successfully', ['bookings' => $bookings]);
}

// Create booking
else if ($method === 'POST') {
    $action = $input['action'] ?? '';

    if ($action === 'create') {
        $user_id = intval($input['user_id'] ?? 0);
        $showing_id = intval($input['showing_id'] ?? 0);
        $movie_id = intval($input['movie_id'] ?? 0);
        $seats = $input['seats'] ?? []; // Array of seat IDs
        $payment_method = sanitize($input['payment_method'] ?? 'cash');

        // Log for debugging
        error_log("CREATE BOOKING: user_id=$user_id, showing_id=$showing_id, movie_id=$movie_id, seats_count=" . count($seats));

        // Detailed validation with specific error messages
        if ($user_id === 0) {
            sendResponse(false, 'User ID is required or invalid', null, 400);
        }
        
        // Check if user exists
        $user_check = $conn->query("SELECT id FROM users WHERE id = $user_id");
        if (!$user_check || $user_check->num_rows === 0) {
            sendResponse(false, 'Người dùng không tồn tại', null, 404);
        }
        
        if ($showing_id === 0) {
            sendResponse(false, 'Showing ID is required or invalid (received: ' . ($input['showing_id'] ?? 'null') . ')', null, 400);
        }
        
        if (empty($seats)) {
            sendResponse(false, 'At least one seat must be selected', null, 400);
        }

        // Get showing and movie details
        $showing = $conn->query("SELECT * FROM showings WHERE id = $showing_id")->fetch_assoc();
        if (!$showing) {
            error_log("Showing not found: id=$showing_id. Checking all showings...");
            $all_showings = $conn->query("SELECT id FROM showings");
            while ($row = $all_showings->fetch_assoc()) {
                error_log("  - Showing ID: " . $row['id']);
            }
            sendResponse(false, 'Showing not found', null, 404);
        }

        $total_price = count($seats) * $showing['price'];

        // Create booking
        $query = "INSERT INTO bookings (user_id, showing_id, movie_id, total_seats, total_price, status, payment_method) 
                  VALUES ($user_id, $showing_id, $movie_id, " . count($seats) . ", $total_price, 'confirmed', '$payment_method')";

        if ($conn->query($query)) {
            $booking_id = $conn->insert_id;

            // Add booking items
            foreach ($seats as $seat_id) {
                $seat_id = intval($seat_id);
                $seat = $conn->query("SELECT * FROM seats WHERE id = $seat_id")->fetch_assoc();
                
                if ($seat) {
                    $conn->query("INSERT INTO booking_items (booking_id, seat_id, seat_number, price) 
                                 VALUES ($booking_id, $seat_id, '{$seat['seat_number']}', {$showing['price']})");
                    
                    // Mark seat as booked
                    $conn->query("UPDATE seats SET is_booked = TRUE WHERE id = $seat_id");
                }
            }

            // Update available seats
            $conn->query("UPDATE showings SET available_seats = available_seats - " . count($seats) . " WHERE id = $showing_id");

            sendResponse(true, 'Booking created successfully', ['booking_id' => $booking_id]);
        } else {
            sendResponse(false, 'Failed to create booking', null, 500);
        }
    }

    // Cancel booking
    else if ($action === 'cancel') {
        $booking_id = intval($input['booking_id'] ?? 0);

        if ($booking_id === 0) {
            sendResponse(false, 'Booking ID is required', null, 400);
        }

        // Get booking details
        $booking = $conn->query("SELECT * FROM bookings WHERE id = $booking_id")->fetch_assoc();
        if (!$booking) {
            sendResponse(false, 'Booking not found', null, 404);
        }

        // Get booked seats
        $seats_result = $conn->query("SELECT seat_id FROM booking_items WHERE booking_id = $booking_id");
        
        while ($row = $seats_result->fetch_assoc()) {
            $conn->query("UPDATE seats SET is_booked = FALSE WHERE id = {$row['seat_id']}");
        }

        // Update booking status
        $conn->query("UPDATE bookings SET status = 'cancelled' WHERE id = $booking_id");

        // Update available seats
        $conn->query("UPDATE showings SET available_seats = available_seats + {$booking['total_seats']} WHERE id = {$booking['showing_id']}");

        sendResponse(true, 'Booking cancelled successfully');
    }

    // Update booking status (Admin)
    else if ($action === 'update') {
        $booking_id = intval($input['id'] ?? 0);
        $status = sanitize($input['status'] ?? '');
        
        if ($booking_id === 0) {
            sendResponse(false, 'Booking ID is required', null, 400);
        }

        if (empty($status)) {
            sendResponse(false, 'Status is required', null, 400);
        }

        // Valid statuses
        $valid_statuses = ['pending', 'confirmed', 'completed', 'cancelled'];
        if (!in_array($status, $valid_statuses)) {
            sendResponse(false, 'Invalid status', null, 400);
        }

        // Get current booking to check if we need to free seats
        $booking = $conn->query("SELECT * FROM bookings WHERE id = $booking_id")->fetch_assoc();
        if (!$booking) {
            sendResponse(false, 'Booking not found', null, 404);
        }

        // If changing to cancelled, free up seats
        if ($status === 'cancelled' && $booking['status'] !== 'cancelled') {
            $seats_result = $conn->query("SELECT seat_id FROM booking_items WHERE booking_id = $booking_id");
            while ($row = $seats_result->fetch_assoc()) {
                $conn->query("UPDATE seats SET is_booked = FALSE WHERE id = {$row['seat_id']}");
            }
            $conn->query("UPDATE showings SET available_seats = available_seats + {$booking['total_seats']} WHERE id = {$booking['showing_id']}");
        }

        // Update booking status
        $query = "UPDATE bookings SET status = '$status' WHERE id = $booking_id";
        if ($conn->query($query)) {
            sendResponse(true, 'Booking updated successfully');
        } else {
            sendResponse(false, 'Failed to update booking: ' . $conn->error, null, 500);
        }
    }

    // Delete booking (Admin)
    else if ($action === 'delete') {
        $booking_id = intval($input['id'] ?? 0);
        
        if ($booking_id === 0) {
            sendResponse(false, 'Booking ID is required', null, 400);
        }

        // Get booking to free seats
        $booking = $conn->query("SELECT * FROM bookings WHERE id = $booking_id")->fetch_assoc();
        if (!$booking) {
            sendResponse(false, 'Booking not found', null, 404);
        }

        // Free up seats
        $seats_result = $conn->query("SELECT seat_id FROM booking_items WHERE booking_id = $booking_id");
        while ($row = $seats_result->fetch_assoc()) {
            $conn->query("UPDATE seats SET is_booked = FALSE WHERE id = {$row['seat_id']}");
        }

        // Update available seats in showing
        $conn->query("UPDATE showings SET available_seats = available_seats + {$booking['total_seats']} WHERE id = {$booking['showing_id']}");

        // Delete booking items
        $conn->query("DELETE FROM booking_items WHERE booking_id = $booking_id");

        // Delete booking
        $query = "DELETE FROM bookings WHERE id = $booking_id";
        if ($conn->query($query)) {
            sendResponse(true, 'Booking deleted successfully');
        } else {
            sendResponse(false, 'Failed to delete booking: ' . $conn->error, null, 500);
        }
    }
}

else {
    sendResponse(false, 'Invalid request method', null, 405);
}
?>
