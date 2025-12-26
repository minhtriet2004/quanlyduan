<?php
require_once 'api/config.php';

echo "=== DATABASE DIAGNOSTICS ===\n\n";

// Check showings
$showings_result = $conn->query("SELECT COUNT(*) as total FROM showings");
$showings_count = $showings_result->fetch_assoc()['total'];
echo "Showings in DB: $showings_count\n";

if ($showings_count == 0) {
    echo "❌ NO SHOWINGS FOUND - Creating test showing...\n\n";
    
    // Get a movie
    $movie_result = $conn->query("SELECT id FROM movies LIMIT 1");
    $movie = $movie_result->fetch_assoc();
    
    if ($movie) {
        $movie_id = $movie['id'];
        $showing_time = date('Y-m-d H:i:s', strtotime('+1 day'));
        
        $insert_query = "INSERT INTO showings (movie_id, showing_date, showing_time, room_number, total_seats, available_seats, price) 
                        VALUES ($movie_id, CURDATE(), '$showing_time', 1, 100, 100, 12000)";
        
        if ($conn->query($insert_query)) {
            $showing_id = $conn->insert_id;
            echo "✓ Created showing ID: $showing_id\n";
            
            // Create seats
            $seatCount = 0;
            for ($i = 1; $i <= 100; $i++) {
                $row = chr(65 + intval(($i - 1) / 8)); // A, B, C, etc.
                $col = (($i - 1) % 8) + 1;
                $seat_number = $row . $col;
                
                $conn->query("INSERT INTO seats (showing_id, seat_number) VALUES ($showing_id, '$seat_number')");
                $seatCount++;
            }
            echo "✓ Created $seatCount seats\n\n";
        }
    }
}

// Check showings again
$showings_result = $conn->query("SELECT * FROM showings LIMIT 1");
$showing = $showings_result->fetch_assoc();

if ($showing) {
    echo "First showing:\n";
    echo "  ID: {$showing['id']}\n";
    echo "  Movie ID: {$showing['movie_id']}\n";
    echo "  Date: {$showing['showing_date']}\n";
    echo "  Time: {$showing['showing_time']}\n\n";
    
    $seats_result = $conn->query("SELECT COUNT(*) as total, SUM(is_booked) as booked FROM seats WHERE showing_id = {$showing['id']}");
    $seats_count = $seats_result->fetch_assoc();
    
    echo "Seats for showing {$showing['id']}:\n";
    echo "  Total: {$seats_count['total']}\n";
    echo "  Booked: {$seats_count['booked']}\n";
}

echo "\n✓ Diagnostics complete\n";
?>
