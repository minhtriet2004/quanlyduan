<?php
require_once 'config.php';

$method = getRequestMethod();

// Get seats for a showing
if ($method === 'GET') {
    $showing_id = $_GET['showing_id'] ?? null;

    if (!$showing_id) {
        sendResponse(false, 'Showing ID is required', null, 400);
    }

    $showing_id = intval($showing_id);
    $query = "SELECT * FROM seats WHERE showing_id = $showing_id ORDER BY seat_number";
    $result = $conn->query($query);

    $seats = [];
    while ($row = $result->fetch_assoc()) {
        $seats[] = $row;
    }

    sendResponse(true, 'Seats retrieved successfully', ['seats' => $seats]);
}

else {
    sendResponse(false, 'Invalid request method', null, 405);
}
?>
