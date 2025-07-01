<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\ComplaintController;
use App\Http\Controllers\Api\NotificationController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/verify-email', [AuthController::class, 'verifyEmail']);
Route::post('/resend-verification', [AuthController::class, 'resendVerification']);

// Public service routes
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{service}', [ServiceController::class, 'show']);
Route::get('/services-categories', [ServiceController::class, 'categories']);

// Public complaint tracking
Route::post('/complaints/track', [ComplaintController::class, 'track']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);
    Route::put('/user/password', [AuthController::class, 'updatePassword']);

    // Service routes (admin only for create, update, delete)
    Route::apiResource('services', ServiceController::class)->except(['index', 'show']);

    // Complaint routes
    Route::apiResource('complaints', ComplaintController::class)->except(['update', 'destroy']);
    Route::put('/complaints/{complaint}/status', [ComplaintController::class, 'updateStatus']);
    Route::get('/complaints-statistics', [ComplaintController::class, 'statistics']);
    Route::get('/complaints/{complaint}/documents/{documentId}/download', [ComplaintController::class, 'downloadDocument']);
    Route::get('/complaints/{complaint}/result/download', [ComplaintController::class, 'downloadResult']);

    // Notification routes
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::put('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
});
