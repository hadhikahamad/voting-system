<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'voter_id' => 'required|string|max:50|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'photo' => 'nullable|file|mimes:jpeg,png,jpg,gif,avif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user_data = [
            'name' => $request->name,
            'email' => $request->email,
            'voter_id' => $request->voter_id,
            'password' => Hash::make($request->password),
            'role' => 'voter',
            'is_verified' => false,
            'is_active' => true,
        ];

        if ($request->hasFile('photo')) {
            $user_data['photo'] = $request->file('photo')->store('users', 'public');
        }

        $user = User::create($user_data);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful',
            'user' => $user,
            'token' => $token
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();

        if (!$user->is_active) {
            return response()->json(['message' => 'Account is deactivated'], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
            'role' => $user->role
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}








