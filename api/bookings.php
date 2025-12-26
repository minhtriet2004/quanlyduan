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

        if ($user_id === 0 || $showing_id === 0 || empty($seats)) {
            sendResponse(false, 'All fields are required', null, 400);
        }

        // Get showing and movie details
        $showing = $conn->query("SELECT * FROM showings WHERE id = $showing_id")->fetch_assoc();
        if (!$showing) {
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
}

else {
    sendResponse(false, 'Invalid request method', null, 405);
}
?>
