<?php
$user = App\Models\User::where('email', 'admin@voting.com')->first();
if ($user) {
    $user->password = Illuminate\Support\Facades\Hash::make('password123');
    $user->save();
    echo "Password reset successful for " . $user->email;
} else {
    echo "User not found";
}
