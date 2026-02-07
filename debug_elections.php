<?php
// login to get token
$loginUrl = 'http://localhost:8000/api/login';
$loginData = ['email' => 'admin@voting.com', 'password' => 'password123'];
$options = [
    'http' => [
        'header'  => "Content-type: application/json\r\nAccept: application/json\r\n",
        'method'  => 'POST',
        'content' => json_encode($loginData),
        'ignore_errors' => true
    ]
];
$context  = stream_context_create($options);
$response = file_get_contents($loginUrl, false, $context);
$loginResult = json_decode($response, true);

if (!isset($loginResult['token'])) {
    die("Login failed: " . $response);
}

$token = $loginResult['token'];

// fetch elections
$url = 'http://localhost:8000/api/admin/elections';
$options = [
    'http' => [
        'header'  => "Authorization: Bearer $token\r\nAccept: application/json\r\n",
        'method'  => 'GET',
        'ignore_errors' => true
    ]
];
$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);
echo "API Response:\n" . $result;
?>
