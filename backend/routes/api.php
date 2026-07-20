<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TodoController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
});

Route::prefix('auth')->middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/todos',                [TodoController::class, 'index']);
    Route::post('/todos',               [TodoController::class, 'store']);
    Route::get('/todos/{todo}',         [TodoController::class, 'show']);
    Route::put('/todos/{todo}',         [TodoController::class, 'update']);
    Route::delete('/todos/{todo}',      [TodoController::class, 'destroy']);
    Route::patch('/todos/{todo}/status',[TodoController::class, 'toggleStatus']);
});
