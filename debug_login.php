<?php
$url = 'http://localhost:8000/api/login';
$data = ['email' => 'admin@voting.com', 'password' => 'password123'];
$options = [
    'http' => [
        'header'  => "Content-type: application/json\r\nAccept: application/json\r\n",
        'method'  => 'POST',
        'content' => json_encode($data),
        'ignore_errors' => true
    ]
];
$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);
echo $result;
?>
