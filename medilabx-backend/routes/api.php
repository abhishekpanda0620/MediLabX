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
use App\Http\Controllers\TestReportController;
use App\Http\Controllers\TestResultController;

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
    Route::get('/test-categories', [TestController::class, 'getCategories']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::apiResource('test-bookings', TestBookingController::class);
        Route::post('/test-bookings/{testBooking}/mark-sample-collected', [TestBookingController::class, 'markSampleCollected']);
        Route::post('/test-bookings/{testBooking}/mark-processing', [TestBookingController::class, 'markProcessing']);
        Route::post('/test-bookings/{testBooking}/mark-reviewed', [TestBookingController::class, 'markReviewed']);
        Route::post('/test-bookings/{testBooking}/mark-completed', [TestBookingController::class, 'markCompleted']);
        Route::post('/test-bookings/{testBooking}/cancel', [TestBookingController::class, 'cancel']);
    });

    // Test Report Routes
    Route::get('/reports', [TestReportController::class, 'index']);
    Route::post('/test-bookings/{testBooking}/reports', [TestReportController::class, 'store']);
    Route::post('/reports/{testReport}/submit', [TestReportController::class, 'submit']);
    Route::post('/reports/{testReport}/review', [TestReportController::class, 'review']);
    Route::post('/reports/{testReport}/validate', [TestReportController::class, 'validate']);
    Route::post('/reports/{testReport}/reject', [TestReportController::class, 'reject']);

    // Test Result Routes
    Route::post('/test-reports/{testReport}/validate-results', [TestResultController::class, 'validateResults']);
    Route::get('/test-parameters/{parameter}/reference-ranges', [TestResultController::class, 'getParameterReferenceRanges']);
    Route::get('/test-results/statistics', [TestResultController::class, 'calculateStatistics']);
});
