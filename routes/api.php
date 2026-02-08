<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/messages', [\App\Http\Controllers\Api\MessageController::class, 'store']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Admin routes
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
    Route::get('/admin/elections', [AdminController::class, 'elections']);
    Route::post('/admin/elections', [AdminController::class, 'createElection']);
    Route::put('/admin/elections/{election}', [AdminController::class, 'updateElection']);
    Route::delete('/admin/elections/{election}', [AdminController::class, 'deleteElection']);
    Route::get('/admin/users', [AdminController::class, 'users']);
    Route::put('/admin/users/{user}/verify', [AdminController::class, 'verifyUser']);
    Route::delete('/admin/users/{user}', [AdminController::class, 'deleteUser']);
    
    // Election management
    Route::post('/admin/elections/{election}/toggle', [AdminController::class, 'toggleStatus']);
    Route::post('/admin/elections/{election}/candidates', [AdminController::class, 'addCandidate']);
    Route::delete('/admin/candidates/{candidate}', [AdminController::class, 'deleteCandidate']);
    Route::post('/admin/elections/{election}/finalize', [\App\Http\Controllers\Api\VoteController::class, 'finalizeResults']);
    
    // Messages management
    Route::get('/admin/messages', [\App\Http\Controllers\Api\MessageController::class, 'index']);
    Route::put('/admin/messages/{id}/read', [\App\Http\Controllers\Api\MessageController::class, 'markAsRead']);
    Route::delete('/admin/messages/{id}', [\App\Http\Controllers\Api\MessageController::class, 'destroy']);
    
    // Voter route
    Route::post('/vote', [\App\Http\Controllers\Api\VoterController::class, 'castVote']);
});

// Public election access (for home page)
Route::get('/elections', [AdminController::class, 'elections']); 
Route::get('/elections/{election}/candidates', [AdminController::class, 'getCandidates']);
Route::get('/elections/{election}/results', [AdminController::class, 'getResults']);
