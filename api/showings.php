<?php
require_once 'config.php';

$method = getRequestMethod();
$input = getJsonInput();

// Get showings
if ($method === 'GET') {
    $id = $_GET['id'] ?? null;
    $movie_id = $_GET['movie_id'] ?? null;
    $showing_date = $_GET['showing_date'] ?? null;

    // Get single showing by ID
    if ($id) {
        $id = intval($id);
        $stmt = $conn->prepare("SELECT s.*, m.title, m.poster_image FROM showings s JOIN movies m ON s.movie_id = m.id WHERE s.id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();

        if ($result->num_rows === 0) {
            sendResponse(false, 'Showing not found', null, 404);
        }

        $showing = $result->fetch_assoc();
        sendResponse(true, 'Showing retrieved successfully', ['showing' => $showing]);
    }

    // Get multiple showings with filters
    $query = "SELECT s.*, m.title, m.poster_image FROM showings s JOIN movies m ON s.movie_id = m.id WHERE 1=1";
    $params = [];
    $types = "";

    if ($movie_id) {
        $movie_id = intval($movie_id);
        $query .= " AND s.movie_id = ?";
        $params[] = $movie_id;
        $types .= "i";
    }

    if ($showing_date) {
        $showing_date = sanitize($showing_date);
        $query .= " AND s.showing_date = ?";
        $params[] = $showing_date;
        $types .= "s";
    }

    $query .= " ORDER BY s.showing_date, s.showing_time";
    
    $stmt = $conn->prepare($query);
    if ($params) {
        $stmt->bind_param($types, ...$params);
    }
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();

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
        $total_seats = intval($input['total_seats'] ?? 48);
        $price = floatval($input['price'] ?? 0);

        // Validation
        if ($movie_id === 0 || empty($showing_date) || empty($showing_time)) {
            sendResponse(false, 'All fields are required', null, 400);
        }
        
        // Validate date format and not past date
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $showing_date)) {
            sendResponse(false, 'Invalid date format (use YYYY-MM-DD)', null, 400);
        }
        
        $showing_datetime = strtotime($showing_date . ' ' . $showing_time);
        if ($showing_datetime === false || $showing_datetime < time()) {
            sendResponse(false, 'Showing date/time must be in the future', null, 400);
        }
        
        if ($price <= 0) {
            sendResponse(false, 'Price must be greater than 0', null, 400);
        }
        
        if ($total_seats < 10 || $total_seats > 200) {
            sendResponse(false, 'Total seats must be between 10 and 200', null, 400);
        }
        
        if ($room_number < 1 || $room_number > 20) {
            sendResponse(false, 'Room number must be between 1 and 20', null, 400);
        }

        $stmt = $conn->prepare("INSERT INTO showings (movie_id, showing_date, showing_time, room_number, total_seats, available_seats, price) 
                  VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("issiiid", $movie_id, $showing_date, $showing_time, $room_number, $total_seats, $total_seats, $price);

        if ($stmt->execute()) {
            $showing_id = $conn->insert_id;
            $stmt->close();

            // Generate seats
            $seatCount = 0;
            for ($i = 1; $i <= $total_seats; $i++) {
                $row = chr(65 + intval(($i - 1) / 10)); // A, B, C, etc.
                $col = (($i - 1) % 10) + 1;
                $seat_number = $row . $col;
                
                $stmt = $conn->prepare("INSERT INTO seats (showing_id, seat_number) VALUES (?, ?)");
                $stmt->bind_param("is", $showing_id, $seat_number);
                $stmt->execute();
                $stmt->close();
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
        
        // Validate date/time format
        if (!empty($showing_date) && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $showing_date)) {
            sendResponse(false, 'Invalid date format (use YYYY-MM-DD)', null, 400);
        }
        
        if (!empty($showing_time) && !preg_match('/^\d{2}:\d{2}(:\d{2})?$/', $showing_time)) {
            sendResponse(false, 'Invalid time format (use HH:MM:SS)', null, 400);
        }
        
        if ($price <= 0) {
            sendResponse(false, 'Price must be greater than 0', null, 400);
        }

        $stmt = $conn->prepare("UPDATE showings SET showing_date = ?, showing_time = ?, price = ? WHERE id = ?");
        $stmt->bind_param("ssdi", $showing_date, $showing_time, $price, $id);

        if ($stmt->execute()) {
            $stmt->close();
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

        $stmt = $conn->prepare("DELETE FROM showings WHERE id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            $stmt->close();
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

        $stmt = $conn->prepare("UPDATE showings SET price = ? WHERE movie_id = ?");
        $stmt->bind_param("di", $price, $movie_id);

        if ($stmt->execute()) {
            $stmt->close();
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
        $stmt = $conn->prepare("SELECT id FROM showings WHERE movie_id = ? LIMIT 1");
        $stmt->bind_param("i", $movie_id);
        $stmt->execute();
        $check_result = $stmt->get_result();
        $stmt->close();

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
            $stmt = $conn->prepare("SELECT price FROM movies WHERE id = ?");
            $stmt->bind_param("i", $movie_id);
            $stmt->execute();
            $movie_result = $stmt->get_result();
            $movie = $movie_result->fetch_assoc();
            $stmt->close();
            
            $movie_price = $movie ? floatval($movie['price']) : 0;

            $stmt = $conn->prepare("INSERT INTO showings (movie_id, showing_date, showing_time, room_number, total_seats, available_seats, price) 
                           VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("issiid", $movie_id, $today, $default_time, $default_room, $default_seats, $default_seats, $movie_price);

            if ($stmt->execute()) {
                $showing_id = $conn->insert_id;
                $stmt->close();

                // Generate seats: 6 rows x 8 seats (A1-A8, B1-B8, etc.)
                for ($row = 0; $row < 6; $row++) {
                    $row_letter = chr(65 + $row); // A, B, C, D, E, F
                    for ($col = 1; $col <= 8; $col++) {
                        $seat_number = $row_letter . $col;
                        $stmt = $conn->prepare("INSERT INTO seats (showing_id, seat_number, is_booked) VALUES (?, ?, 0)");
                        $stmt->bind_param("is", $showing_id, $seat_number);
                        $stmt->execute();
                        $stmt->close();
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
