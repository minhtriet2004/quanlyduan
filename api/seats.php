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
    $stmt = $conn->prepare("SELECT * FROM seats WHERE showing_id = ? ORDER BY seat_number");
    $stmt->bind_param("i", $showing_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();

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
