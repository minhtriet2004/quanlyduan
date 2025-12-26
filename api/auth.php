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
            $check = $conn->query("SELECT id FROM users WHERE username = '$username'");
            if ($check->num_rows > 0) {
                sendResponse(false, 'Username already exists', null, 400);
            }

            // Check if email exists
            $check = $conn->query("SELECT id FROM users WHERE email = '$email'");
            if ($check->num_rows > 0) {
                sendResponse(false, 'Email already exists', null, 400);
            }

            $hashed_password = password_hash($password, PASSWORD_BCRYPT);
            $query = "INSERT INTO users (username, password, email, full_name, phone, role) 
                      VALUES ('$username', '$hashed_password', '$email', '$full_name', '$phone', 'user')";

            if ($conn->query($query)) {
                $user_id = $conn->insert_id;
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

            $query = "SELECT * FROM users WHERE username = '$username'";
            $result = $conn->query($query);

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

            $query = "SELECT * FROM users WHERE username = '$username' AND role = 'admin'";
            $result = $conn->query($query);

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
