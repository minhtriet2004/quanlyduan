<?php
require_once 'config.php';

try {
    $method = getRequestMethod();
    $input = getJsonInput();

    if (!$input) {
        sendResponse(false, 'Invalid JSON input', null, 400);
    }

    if ($method === 'POST') {
        $action = $input['action'] ?? '';

        // Register
        if ($action === 'register') {
            $username = sanitize($input['username'] ?? '');
            $password = $input['password'] ?? '';
            $email = sanitize($input['email'] ?? '');
            $full_name = sanitize($input['full_name'] ?? '');
            $phone = sanitize($input['phone'] ?? '');

            if (empty($username) || empty($password) || empty($email)) {
                sendResponse(false, 'Username, password, and email are required', null, 400);
            }

            // Check if username exists
            $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
            $stmt->bind_param("s", $username);
            $stmt->execute();
            $check = $stmt->get_result();
            if ($check->num_rows > 0) {
                sendResponse(false, 'Username already exists', null, 400);
            }
            $stmt->close();

            // Check if email exists
            $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $check = $stmt->get_result();
            if ($check->num_rows > 0) {
                sendResponse(false, 'Email already exists', null, 400);
            }
            $stmt->close();

            $hashed_password = password_hash($password, PASSWORD_BCRYPT);
            $stmt = $conn->prepare("INSERT INTO users (username, password, email, full_name, phone, role) 
                      VALUES (?, ?, ?, ?, ?, 'user')");
            $stmt->bind_param("sssss", $username, $hashed_password, $email, $full_name, $phone);

            if ($stmt->execute()) {
                $user_id = $conn->insert_id;
                $stmt->close();
                $token = generateToken($user_id);
                sendResponse(true, 'Registration successful', [
                    'user_id' => $user_id,
                    'username' => $username,
                    'email' => $email,
                    'token' => $token
                ]);
            } else {
                sendResponse(false, 'Registration failed: ' . $conn->error, null, 500);
            }
        }
        // Login
        else if ($action === 'login') {
            $username = sanitize($input['username'] ?? '');
            $password = $input['password'] ?? '';

            if (empty($username) || empty($password)) {
                sendResponse(false, 'Username and password are required', null, 400);
            }

            $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
            $stmt->bind_param("s", $username);
            $stmt->execute();
            $result = $stmt->get_result();
            $stmt->close();

            if ($result->num_rows === 0) {
                sendResponse(false, 'Username or password incorrect', null, 401);
            }

            $user = $result->fetch_assoc();

            if (!password_verify($password, $user['password'])) {
                sendResponse(false, 'Username or password incorrect', null, 401);
            }

            $token = generateToken($user['id']);
            
            // Unset password from response
            unset($user['password']);

            sendResponse(true, 'Login successful', [
                'user' => $user,
                'token' => $token
            ]);
        }
        // Admin Login
        else if ($action === 'admin_login') {
            $username = sanitize($input['username'] ?? '');
            $password = $input['password'] ?? '';

            if (empty($username) || empty($password)) {
                sendResponse(false, 'Username and password are required', null, 400);
            }

            $stmt = $conn->prepare("SELECT * FROM users WHERE username = ? AND role = 'admin'");
            $stmt->bind_param("s", $username);
            $stmt->execute();
            $result = $stmt->get_result();
            $stmt->close();

            if ($result->num_rows === 0) {
                sendResponse(false, 'Admin username or password incorrect', null, 401);
            }

            $user = $result->fetch_assoc();

            if (!password_verify($password, $user['password'])) {
                sendResponse(false, 'Admin username or password incorrect', null, 401);
            }

            $token = generateToken($user['id']);
            
            // Unset password from response
            unset($user['password']);

            sendResponse(true, 'Admin login successful', [
                'user' => $user,
                'token' => $token
            ]);
        }
        else {
            sendResponse(false, 'Invalid action', null, 400);
        }
    } else {
        sendResponse(false, 'Invalid request method', null, 405);
    }
} catch (Exception $e) {
    sendResponse(false, 'Server error: ' . $e->getMessage(), null, 500);
}
?>
