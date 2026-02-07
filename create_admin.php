<?php
use App\Models\User;
use Illuminate\Support\Facades\Hash;

$email = 'admin@voting.com';
$password = 'password123';

// Delete existing to ensure clean state
User::where('email', $email)->delete();

$user = new User();
$user->name = 'System Admin';
$user->email = $email;
$user->password = Hash::make($password);
$user->role = 'admin';
$user->is_active = true;
$user->save();

echo "Admin user created successfully:\n";
echo "Email: " . $user->email . "\n";
echo "Password: " . $password . "\n";
echo "Role: " . $user->role . "\n";
echo "Status: Active\n";
