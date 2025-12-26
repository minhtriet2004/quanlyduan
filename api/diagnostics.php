<?php
require_once 'config.php';

// Get all showings
$showings = $conn->query("SELECT * FROM showings")->fetch_all(MYSQLI_ASSOC);
echo "<h2>Showings in Database:</h2>";
if (empty($showings)) {
    echo "<p style='color: red;'>❌ NO SHOWINGS FOUND!</p>";
} else {
    echo "<pre>";
    print_r($showings);
    echo "</pre>";
    
    // For each showing, check seats
    foreach ($showings as $showing) {
        echo "<h3>Seats for Showing ID {$showing['id']}:</h3>";
        $seats = $conn->query("SELECT COUNT(*) as total, SUM(is_booked) as booked FROM seats WHERE showing_id = {$showing['id']}")->fetch_assoc();
        echo "Total: {$seats['total']}, Booked: {$seats['booked']}<br>";
        
        if ($seats['total'] == 0) {
            echo "<span style='color: red;'>❌ No seats created for this showing!</span><br>";
        }
    }
}

// Get count of all seats
$total_seats = $conn->query("SELECT COUNT(*) as total FROM seats")->fetch_assoc();
echo "<p>Total seats in database: {$total_seats['total']}</p>";
?>
