<?php
require_once 'config.php';

$method = getRequestMethod();
$input = getJsonInput();

// Get all movies - auto-determine status based on release_date
if ($method === 'GET') {
    // Check if getting single movie with showings by ID
    if (isset($_GET['id']) && isset($_GET['include_showings'])) {
        $id = intval($_GET['id']);
        $stmt = $conn->prepare("SELECT * FROM movies WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();

        if ($result->num_rows === 0) {
            sendResponse(false, 'Movie not found', null, 404);
        }

        $movie = $result->fetch_assoc();
        
        // Get all showings for this movie
        $stmt = $conn->prepare("SELECT id, showing_date, showing_time, room_number, price, available_seats, total_seats 
                          FROM showings 
                          WHERE movie_id = ? 
                          ORDER BY showing_date, showing_time");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $showings_result = $stmt->get_result();
        $stmt->close();
        
        $showings = [];
        while ($showing_row = $showings_result->fetch_assoc()) {
            $showings[] = $showing_row;
        }
        
        $movie['showings'] = $showings;
        sendResponse(true, 'Movie retrieved successfully', ['movie' => $movie]);
    }
    
    // Check if getting single movie by ID (without showings)
    else if (isset($_GET['id'])) {
        $id = intval($_GET['id']);
        $stmt = $conn->prepare("SELECT * FROM movies WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();

        if ($result->num_rows === 0) {
            sendResponse(false, 'Movie not found', null, 404);
        }

        $movie = $result->fetch_assoc();
        sendResponse(true, 'Movie retrieved successfully', ['movie' => $movie]);
    }
    
    // Get all movies (both showing and coming_soon)
    $limit = intval($_GET['limit'] ?? 100);
    $offset = intval($_GET['offset'] ?? 0);
    $today = date('Y-m-d');
    
    $query = "SELECT m.*
              FROM movies m 
              WHERE m.status != 'archived' ORDER BY 
              CASE 
                WHEN m.release_date > ? THEN 0 
                ELSE 1 
              END, 
              m.release_date DESC LIMIT ?, ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("sii", $today, $offset, $limit);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();

    $movies = [];
    while ($row = $result->fetch_assoc()) {
        // Auto-set status based on release_date
        if (!empty($row['release_date'])) {
            $release = new DateTime($row['release_date']);
            $now = new DateTime('now');
            $row['auto_status'] = $release > $now ? 'coming_soon' : 'showing';
        } else {
            $row['auto_status'] = $row['status'];
        }
        $movies[] = $row;
    }

    sendResponse(true, 'Movies retrieved successfully', ['movies' => $movies]);
}

// Add movie (Admin)
else if ($method === 'POST') {
    $action = $input['action'] ?? '';

    if ($action === 'add') {
        $title = sanitize($input['title'] ?? '');
        $description = sanitize($input['description'] ?? '');
        $poster_image = sanitize($input['poster_image'] ?? '');
        $release_date = sanitize($input['release_date'] ?? '');
        $duration = intval($input['duration'] ?? 0);
        $genre = sanitize($input['genre'] ?? '');
        $director = sanitize($input['director'] ?? '');
        $rating = floatval($input['rating'] ?? 0);
        $price = intval($input['price'] ?? 0);

        if (empty($title)) {
            sendResponse(false, 'Title is required', null, 400);
        }

        // Auto-determine status based on release_date
        $status = 'showing';
        if (!empty($release_date)) {
            $release = new DateTime($release_date);
            $now = new DateTime('now');
            $status = $release > $now ? 'coming_soon' : 'showing';
        }

        $stmt = $conn->prepare("INSERT INTO movies (title, description, poster_image, release_date, duration, genre, director, rating, price, status) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssissdis", $title, $description, $poster_image, $release_date, $duration, $genre, $director, $rating, $price, $status);

        if ($stmt->execute()) {
            $movie_id = $conn->insert_id;
            $stmt->close();
            sendResponse(true, 'Movie added successfully', ['movie_id' => $movie_id]);
        } else {
            sendResponse(false, 'Failed to add movie: ' . $conn->error, null, 500);
        }
    }

    // Update movie
    else if ($action === 'update') {
        $id = intval($input['id'] ?? 0);
        $title = sanitize($input['title'] ?? '');
        $description = sanitize($input['description'] ?? '');
        $poster_image = sanitize($input['poster_image'] ?? '');
        $release_date = sanitize($input['release_date'] ?? '');
        $duration = intval($input['duration'] ?? 0);
        $genre = sanitize($input['genre'] ?? '');
        $director = sanitize($input['director'] ?? '');
        $rating = floatval($input['rating'] ?? 0);
        $price = intval($input['price'] ?? 0);

        if ($id === 0) {
            sendResponse(false, 'Movie ID is required', null, 400);
        }

        // Auto-determine status based on release_date
        $status = 'showing';
        if (!empty($release_date)) {
            $release = new DateTime($release_date);
            $now = new DateTime('now');
            $status = $release > $now ? 'coming_soon' : 'showing';
        }

        $stmt = $conn->prepare("UPDATE movies SET title = ?, description = ?, poster_image = ?, 
                  release_date = ?, duration = ?, genre = ?, director = ?, 
                  rating = ?, price = ?, status = ? WHERE id = ?");
        $stmt->bind_param("ssssissdisi", $title, $description, $poster_image, $release_date, $duration, $genre, $director, $rating, $price, $status, $id);

        if ($stmt->execute()) {
            $stmt->close();
            sendResponse(true, 'Movie updated successfully');
        } else {
            sendResponse(false, 'Failed to update movie: ' . $conn->error, null, 500);
        }
    }

    // Delete movie
    else if ($action === 'delete') {
        $id = intval($input['id'] ?? 0);

        if ($id === 0) {
            sendResponse(false, 'Movie ID is required', null, 400);
        }

        $stmt = $conn->prepare("DELETE FROM movies WHERE id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            $stmt->close();
            sendResponse(true, 'Movie deleted successfully');
        } else {
            sendResponse(false, 'Failed to delete movie', null, 500);
        }
    }
}

else {
    sendResponse(false, 'Invalid request method', null, 405);
}
?>
