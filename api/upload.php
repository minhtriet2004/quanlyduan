<?php
require_once 'config.php';

$method = getRequestMethod();

if ($method !== 'POST') {
    sendResponse(false, 'Only POST method allowed', null, 405);
}

// Check if file is uploaded
if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    sendResponse(false, 'No image file provided or upload error', null, 400);
}

$file = $_FILES['image'];

// Validate file
$allowed_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
$allowed_mimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$file_info = pathinfo($file['name']);
$file_extension = strtolower($file_info['extension']);

if (!in_array($file_extension, $allowed_extensions)) {
    sendResponse(false, 'Invalid file type. Allowed: ' . implode(', ', $allowed_extensions), null, 400);
}

// Validate MIME type
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime_type = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array($mime_type, $allowed_mimes)) {
    sendResponse(false, 'Invalid file MIME type: ' . $mime_type, null, 400);
}

// Check file size (max 5MB)
if ($file['size'] > 5 * 1024 * 1024) {
    sendResponse(false, 'File size too large. Max 5MB', null, 400);
}

// Create upload directory if not exists
$upload_dir = __DIR__ . '/../img/uploads/';
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

// Generate unique filename
$filename = uniqid('movie_') . '_' . time() . '.' . $file_extension;
$file_path = $upload_dir . $filename;

// Move uploaded file
if (move_uploaded_file($file['tmp_name'], $file_path)) {
    $relative_path = '/img/uploads/' . $filename;
    sendResponse(true, 'Image uploaded successfully', [
        'filename' => $filename,
        'path' => $relative_path,
        'url' => $relative_path
    ]);
} else {
    sendResponse(false, 'Failed to move uploaded file', null, 500);
}
?>
