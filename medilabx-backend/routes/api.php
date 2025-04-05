<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\LabTechnicianController;
use App\Http\Controllers\PathologistController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\TestBookingController;
use App\Http\Controllers\ReportController;

// Public authentication routes
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

// Protected routes using Sanctum
Route::middleware('auth:sanctum')->group(function () {
    // User info route
    Route::get('user', [AuthController::class, 'user']);

    Route::post('logout', [AuthController::class, 'logout']);
    
    // User roles
    Route::apiResource('patients', PatientController::class);
    Route::apiResource('lab-technicians', LabTechnicianController::class);
    Route::apiResource('pathologists', PathologistController::class);

    // Test Templates routes
    Route::get('/test-templates', [TestController::class, 'getAllTestTemplates']);
    Route::get('/test-template/{id}', [TestController::class, 'getTestTemplate']);
    Route::post('/test-template', [TestController::class, 'createTestTemplate']);
    Route::put('/test-template/{id}', [TestController::class, 'updateTestTemplate']);
    Route::delete('/test-template/{id}', [TestController::class, 'deleteTestTemplate']);

    // Test-related routes
    Route::apiResource('test-bookings', TestBookingController::class);
    Route::apiResource('reports', ReportController::class);
});
