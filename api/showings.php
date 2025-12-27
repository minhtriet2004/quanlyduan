<?php
require_once 'config.php';

$method = getRequestMethod();
$input = getJsonInput();

// Get showings
if ($method === 'GET') {
    $movie_id = $_GET['movie_id'] ?? null;
    $showing_date = $_GET['showing_date'] ?? null;

    $query = "SELECT s.*, m.title, m.poster_image FROM showings s JOIN movies m ON s.movie_id = m.id WHERE 1=1";

    if ($movie_id) {
        $movie_id = intval($movie_id);
        $query .= " AND s.movie_id = $movie_id";
    }

    if ($showing_date) {
        $showing_date = sanitize($showing_date);
        $query .= " AND s.showing_date = '$showing_date'";
    }

    $query .= " ORDER BY s.showing_date, s.showing_time";
    $result = $conn->query($query);

    $showings = [];
    while ($row = $result->fetch_assoc()) {
        $showings[] = $row;
    }

    sendResponse(true, 'Showings retrieved successfully', ['showings' => $showings]);
}

// Add showing (Admin)
else if ($method === 'POST') {
    $action = $input['action'] ?? '';

    if ($action === 'add') {
        $movie_id = intval($input['movie_id'] ?? 0);
        $showing_date = sanitize($input['showing_date'] ?? '');
        $showing_time = sanitize($input['showing_time'] ?? '');
        $room_number = intval($input['room_number'] ?? 1);
        $total_seats = intval($input['total_seats'] ?? 100);
        $price = floatval($input['price'] ?? 0);

        if ($movie_id === 0 || empty($showing_date) || empty($showing_time)) {
            sendResponse(false, 'All fields are required', null, 400);
        }

        $query = "INSERT INTO showings (movie_id, showing_date, showing_time, room_number, total_seats, available_seats, price) 
                  VALUES ($movie_id, '$showing_date', '$showing_time', $room_number, $total_seats, $total_seats, $price)";

        if ($conn->query($query)) {
            $showing_id = $conn->insert_id;

            // Generate seats
            $seatCount = 0;
            for ($i = 1; $i <= $total_seats; $i++) {
                $row = chr(65 + intval(($i - 1) / 10)); // A, B, C, etc.
                $col = (($i - 1) % 10) + 1;
                $seat_number = $row . $col;
                
                $conn->query("INSERT INTO seats (showing_id, seat_number) VALUES ($showing_id, '$seat_number')");
            }

            sendResponse(true, 'Showing added successfully', ['showing_id' => $showing_id]);
        } else {
            sendResponse(false, 'Failed to add showing', null, 500);
        }
    }

    // Update showing
    else if ($action === 'update') {
        $id = intval($input['id'] ?? 0);
        $showing_date = sanitize($input['showing_date'] ?? '');
        $showing_time = sanitize($input['showing_time'] ?? '');
        $price = floatval($input['price'] ?? 0);

        if ($id === 0) {
            sendResponse(false, 'Showing ID is required', null, 400);
        }

        $query = "UPDATE showings SET showing_date = '$showing_date', showing_time = '$showing_time', price = $price WHERE id = $id";

        if ($conn->query($query)) {
            sendResponse(true, 'Showing updated successfully');
        } else {
            sendResponse(false, 'Failed to update showing', null, 500);
        }
    }

    // Delete showing
    else if ($action === 'delete') {
        $id = intval($input['id'] ?? 0);

        if ($id === 0) {
            sendResponse(false, 'Showing ID is required', null, 400);
        }

        $query = "DELETE FROM showings WHERE id = $id";

        if ($conn->query($query)) {
            sendResponse(true, 'Showing deleted successfully');
        } else {
            sendResponse(false, 'Failed to delete showing', null, 500);
        }
    }

    // Update all showings price for a movie
    else if ($action === 'update_movie_prices') {
        $movie_id = intval($input['movie_id'] ?? 0);
        $price = floatval($input['price'] ?? 0);

        if ($movie_id === 0) {
            sendResponse(false, 'Movie ID is required', null, 400);
        }

        $query = "UPDATE showings SET price = $price WHERE movie_id = $movie_id";

        if ($conn->query($query)) {
            sendResponse(true, 'All showings prices updated successfully');
        } else {
            sendResponse(false, 'Failed to update showings prices: ' . $conn->error, null, 500);
        }
    }

    // Get or create showing for a movie (for customer booking)
    else if ($action === 'get_or_create') {
        $movie_id = intval($input['movie_id'] ?? 0);

        if ($movie_id === 0) {
            sendResponse(false, 'Movie ID is required', null, 400);
        }

        // Check if showing exists for this movie
        $check_query = "SELECT id FROM showings WHERE movie_id = $movie_id LIMIT 1";
        $check_result = $conn->query($check_query);

        if ($check_result && $check_result->num_rows > 0) {
            // Use existing showing
            $row = $check_result->fetch_assoc();
            $showing_id = $row['id'];
            sendResponse(true, 'Using existing showing', ['showing_id' => $showing_id]);
        } else {
            // Create new showing for this movie with today's date and default time
            $today = date('Y-m-d');
            $default_time = '14:00:00'; // 2:00 PM
            $default_room = 1;
            $default_seats = 48; // 6 rows x 8 seats
            
            // Get movie price
            $movie = $conn->query("SELECT price FROM movies WHERE id = $movie_id")->fetch_assoc();
            $movie_price = $movie ? floatval($movie['price']) : 0;

            $insert_query = "INSERT INTO showings (movie_id, showing_date, showing_time, room_number, total_seats, available_seats, price) 
                           VALUES ($movie_id, '$today', '$default_time', $default_room, $default_seats, $default_seats, $movie_price)";

            if ($conn->query($insert_query)) {
                $showing_id = $conn->insert_id;

                // Generate seats: 6 rows x 8 seats (A1-A8, B1-B8, etc.)
                for ($row = 0; $row < 6; $row++) {
                    $row_letter = chr(65 + $row); // A, B, C, D, E, F
                    for ($col = 1; $col <= 8; $col++) {
                        $seat_number = $row_letter . $col;
                        $seat_insert = "INSERT INTO seats (showing_id, seat_number, is_booked) VALUES ($showing_id, '$seat_number', 0)";
                        $conn->query($seat_insert);
                    }
                }

                sendResponse(true, 'Created new showing', ['showing_id' => $showing_id]);
            } else {
                sendResponse(false, 'Failed to create showing: ' . $conn->error, null, 500);
            }
        }
    }
}

else {
    sendResponse(false, 'Invalid request method', null, 405);
}
?>
