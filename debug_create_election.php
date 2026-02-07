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

// Create Election Payload
$data = [
    'title' => 'Debug Election ' . time(),
    'description' => 'Created via debug script',
    'start_date' => date('Y-m-d H:i:s', strtotime('+1 day')),
    'end_date' => date('Y-m-d H:i:s', strtotime('+2 days')),
    'is_public' => true
];

// Send POST request
$url = 'http://localhost:8000/api/admin/elections';
$options = [
    'http' => [
        'header'  => "Authorization: Bearer $token\r\nContent-type: application/json\r\nAccept: application/json\r\n",
        'method'  => 'POST',
        'content' => json_encode($data),
        'ignore_errors' => true
    ]
];
$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);

echo "Create Response Code: " . $http_response_header[0] . "\n";
echo "Create Response Body:\n" . $result;
?>
