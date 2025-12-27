<?php
require_once 'config.php';

$method = getRequestMethod();
$input = getJsonInput();

// Get bookings
if ($method === 'GET') {
    $user_id = $_GET['user_id'] ?? null;
    $status = $_GET['status'] ?? null;

    $query = "SELECT b.*, m.title, m.poster_image FROM bookings b JOIN movies m ON b.movie_id = m.id WHERE 1=1";
    $params = [];
    $types = "";

    if ($user_id) {
        $user_id = intval($user_id);
        $query .= " AND b.user_id = ?";
        $params[] = $user_id;
        $types .= "i";
    }

    if ($status) {
        $status = sanitize($status);
        $query .= " AND b.status = ?";
        $params[] = $status;
        $types .= "s";
    }

    $query .= " ORDER BY b.booking_date DESC";
    
    $stmt = $conn->prepare($query);
    if ($params) {
        $stmt->bind_param($types, ...$params);
    }
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();

    $bookings = [];
    while ($row = $result->fetch_assoc()) {
        // Get seat numbers for this booking
        $booking_id = intval($row['id']);
        $stmt = $conn->prepare("SELECT seat_number FROM booking_items WHERE booking_id = ? ORDER BY seat_number");
        $stmt->bind_param("i", $booking_id);
        $stmt->execute();
        $seats_result = $stmt->get_result();
        $stmt->close();
        
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
        $stmt = $conn->prepare("SELECT id FROM users WHERE id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $user_check = $stmt->get_result();
        $stmt->close();
        
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
        $stmt = $conn->prepare("SELECT * FROM showings WHERE id = ?");
        $stmt->bind_param("i", $showing_id);
        $stmt->execute();
        $showing_result = $stmt->get_result();
        $showing = $showing_result->fetch_assoc();
        $stmt->close();
        
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
        $stmt = $conn->prepare("INSERT INTO bookings (user_id, showing_id, movie_id, total_seats, total_price, status, payment_method) 
                  VALUES (?, ?, ?, ?, ?, 'confirmed', ?)");
        $stmt->bind_param("iiidis", $user_id, $showing_id, $movie_id, count($seats), $total_price, $payment_method);

        if ($stmt->execute()) {
            $booking_id = $conn->insert_id;
            $stmt->close();

            // Add booking items
            foreach ($seats as $seat_id) {
                $seat_id = intval($seat_id);
                $stmt = $conn->prepare("SELECT * FROM seats WHERE id = ?");
                $stmt->bind_param("i", $seat_id);
                $stmt->execute();
                $seat_result = $stmt->get_result();
                $seat = $seat_result->fetch_assoc();
                $stmt->close();
                
                if ($seat) {
                    $stmt = $conn->prepare("INSERT INTO booking_items (booking_id, seat_id, seat_number, price) 
                                 VALUES (?, ?, ?, ?)");
                    $price = $showing['price'];
                    $stmt->bind_param("iisi", $booking_id, $seat_id, $seat['seat_number'], $price);
                    $stmt->execute();
                    $stmt->close();
                    
                    // Mark seat as booked
                    $stmt = $conn->prepare("UPDATE seats SET is_booked = TRUE WHERE id = ?");
                    $stmt->bind_param("i", $seat_id);
                    $stmt->execute();
                    $stmt->close();
                }
            }

            // Update available seats
            $remaining = count($seats);
            $stmt = $conn->prepare("UPDATE showings SET available_seats = available_seats - ? WHERE id = ?");
            $stmt->bind_param("ii", $remaining, $showing_id);
            $stmt->execute();
            $stmt->close();

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
        $stmt = $conn->prepare("SELECT * FROM bookings WHERE id = ?");
        $stmt->bind_param("i", $booking_id);
        $stmt->execute();
        $booking_result = $stmt->get_result();
        $booking = $booking_result->fetch_assoc();
        $stmt->close();
        
        if (!$booking) {
            sendResponse(false, 'Booking not found', null, 404);
        }

        // Get booked seats
        $stmt = $conn->prepare("SELECT seat_id FROM booking_items WHERE booking_id = ?");
        $stmt->bind_param("i", $booking_id);
        $stmt->execute();
        $seats_result = $stmt->get_result();
        $stmt->close();
        
        while ($row = $seats_result->fetch_assoc()) {
            $seat_id = $row['seat_id'];
            $stmt = $conn->prepare("UPDATE seats SET is_booked = FALSE WHERE id = ?");
            $stmt->bind_param("i", $seat_id);
            $stmt->execute();
            $stmt->close();
        }

        // Update booking status
        $stmt = $conn->prepare("UPDATE bookings SET status = 'cancelled' WHERE id = ?");
        $stmt->bind_param("i", $booking_id);
        $stmt->execute();
        $stmt->close();

        // Update available seats
        $showing_id = $booking['showing_id'];
        $total_seats = $booking['total_seats'];
        $stmt = $conn->prepare("UPDATE showings SET available_seats = available_seats + ? WHERE id = ?");
        $stmt->bind_param("ii", $total_seats, $showing_id);
        $stmt->execute();
        $stmt->close();

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
        $stmt = $conn->prepare("SELECT * FROM bookings WHERE id = ?");
        $stmt->bind_param("i", $booking_id);
        $stmt->execute();
        $booking_result = $stmt->get_result();
        $booking = $booking_result->fetch_assoc();
        $stmt->close();
        
        if (!$booking) {
            sendResponse(false, 'Booking not found', null, 404);
        }

        // If changing to cancelled, free up seats
        if ($status === 'cancelled' && $booking['status'] !== 'cancelled') {
            $stmt = $conn->prepare("SELECT seat_id FROM booking_items WHERE booking_id = ?");
            $stmt->bind_param("i", $booking_id);
            $stmt->execute();
            $seats_result = $stmt->get_result();
            $stmt->close();
            
            while ($row = $seats_result->fetch_assoc()) {
                $seat_id = $row['seat_id'];
                $stmt = $conn->prepare("UPDATE seats SET is_booked = FALSE WHERE id = ?");
                $stmt->bind_param("i", $seat_id);
                $stmt->execute();
                $stmt->close();
            }
            $showing_id = $booking['showing_id'];
            $total_seats = $booking['total_seats'];
            $stmt = $conn->prepare("UPDATE showings SET available_seats = available_seats + ? WHERE id = ?");
            $stmt->bind_param("ii", $total_seats, $showing_id);
            $stmt->execute();
            $stmt->close();
        }

        // Update booking status
        $stmt = $conn->prepare("UPDATE bookings SET status = ? WHERE id = ?");
        $stmt->bind_param("si", $status, $booking_id);
        
        if ($stmt->execute()) {
            $stmt->close();
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
        $stmt = $conn->prepare("SELECT * FROM bookings WHERE id = ?");
        $stmt->bind_param("i", $booking_id);
        $stmt->execute();
        $booking_result = $stmt->get_result();
        $booking = $booking_result->fetch_assoc();
        $stmt->close();
        
        if (!$booking) {
            sendResponse(false, 'Booking not found', null, 404);
        }

        // Free up seats
        $stmt = $conn->prepare("SELECT seat_id FROM booking_items WHERE booking_id = ?");
        $stmt->bind_param("i", $booking_id);
        $stmt->execute();
        $seats_result = $stmt->get_result();
        $stmt->close();
        
        while ($row = $seats_result->fetch_assoc()) {
            $seat_id = $row['seat_id'];
            $stmt = $conn->prepare("UPDATE seats SET is_booked = FALSE WHERE id = ?");
            $stmt->bind_param("i", $seat_id);
            $stmt->execute();
            $stmt->close();
        }

        // Update available seats in showing
        $showing_id = $booking['showing_id'];
        $total_seats = $booking['total_seats'];
        $stmt = $conn->prepare("UPDATE showings SET available_seats = available_seats + ? WHERE id = ?");
        $stmt->bind_param("ii", $total_seats, $showing_id);
        $stmt->execute();
        $stmt->close();

        // Delete booking items
        $stmt = $conn->prepare("DELETE FROM booking_items WHERE booking_id = ?");
        $stmt->bind_param("i", $booking_id);
        $stmt->execute();
        $stmt->close();

        // Delete booking
        $stmt = $conn->prepare("DELETE FROM bookings WHERE id = ?");
        $stmt->bind_param("i", $booking_id);
        
        if ($stmt->execute()) {
            $stmt->close();
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
