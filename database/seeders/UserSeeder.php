<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Super Admin
        User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@voting.com',
            'password' => Hash::make('password123'),
            'role' => 'super_admin',
            'is_verified' => true,
            'email_verified_at' => now(),
            'phone' => '1234567890',
        ]);

        // Admin
        User::create([
            'name' => 'System Admin',
            'email' => 'admin@voting.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'is_verified' => true,
            'email_verified_at' => now(),
            'phone' => '9876543210',
        ]);

        // Election Officer
        User::create([
            'name' => 'Election Officer',
            'email' => 'officer@voting.com',
            'password' => Hash::make('password123'),
            'role' => 'election_officer',
            'is_verified' => true,
            'email_verified_at' => now(),
        ]);

        // Voters
        for ($i = 1; $i <= 10; $i++) {
            User::create([
                'name' => "Voter $i",
                'email' => "voter$i@voting.com",
                'password' => Hash::make('password123'),
                'role' => 'voter',
                'is_verified' => true,
                'email_verified_at' => now(),
                'voter_id' => 'VOTER' . str_pad($i, 6, '0', STR_PAD_LEFT),
                'phone' => '555' . str_pad($i, 7, '0', STR_PAD_LEFT),
            ]);
        }
    }
}
