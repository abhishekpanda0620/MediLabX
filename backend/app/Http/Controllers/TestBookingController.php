<?php

namespace App\Http\Controllers;

use App\Models\TestBooking;
use App\Models\Test;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TestBookingController extends Controller
{
    public function __construct()
    {
        // Removed middleware('auth') as it is now applied in routes/api.php
    }

    public function index(Request $request)
    {
        $user = Auth::user();
        $query = TestBooking::with(['patient', 'labTechnician', 'pathologist', 'doctor', 'test']);

        // Filter by user role if no specific status is requested
        if (!$request->has('status')) {
            if ($user->hasRole('patient')) {
                $query->where('patient_id', $user->id);
            } elseif ($user->hasRole('doctor')) {
                $query->where('doctor_id', $user->id);
            } elseif ($user->hasRole('lab_technician')) {
                $query->whereIn('status', [TestBooking::STATUS_BOOKED, TestBooking::STATUS_SAMPLE_COLLECTED, TestBooking::STATUS_PROCESSING]);
            } elseif ($user->hasRole('pathologist')) {
                $query->whereIn('status', [TestBooking::STATUS_PROCESSING, TestBooking::STATUS_REVIEWED]);
            }
        } else {
            // If status parameter is provided, filter by that status
            $status = $request->status;
            $query->where('status', $status);
            
            // Still apply user role restrictions for security
            if ($user->hasRole('patient')) {
                $query->where('patient_id', $user->id);
            } elseif ($user->hasRole('doctor')) {
                $query->where('doctor_id', $user->id);
            }
        }

        return response()->json($query->latest()->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|exists:users,id',
            'doctor_id' => 'required|exists:users,id',
            'test_id' => 'required_without:test_package_id|exists:tests,id',
            'test_package_id' => 'required_without:test_id|exists:test_packages,id',
            'notes' => 'nullable|string'
        ]);

        // Check if the provided IDs correspond to users with proper roles
        $patient = \App\Models\User::find($request->patient_id);
        $doctor = \App\Models\User::find($request->doctor_id);

        if (!$patient || !$patient->hasRole('patient')) {
            return response()->json(['message' => 'Invalid patient ID. User must have patient role.'], 422);
        }

        if (!$doctor || !$doctor->hasRole('doctor')) {
            return response()->json(['message' => 'Invalid doctor ID. User must have doctor role.'], 422);
        }

        // Create booking data array
        $bookingData = [
            'patient_id' => $request->patient_id,
            'doctor_id' => $request->doctor_id,
            'status' => TestBooking::STATUS_BOOKED,
            'notes' => $request->notes
        ];
        
        // Add either test_id or test_package_id
        if ($request->has('test_id')) {
            $bookingData['test_id'] = $request->test_id;
        } else {
            $bookingData['test_package_id'] = $request->test_package_id;
        }
        
        $booking = TestBooking::create($bookingData);

        return response()->json($booking->load(['patient', 'test', 'doctor']), 201);
    }

    public function markSampleCollected(Request $request, TestBooking $testBooking)
    {
        try {
            // Get the lab technician user from the seeded data
            $labTech = \App\Models\User::where('email', 'lab_technician@example.com')->first();
            
            if (!$labTech) {
                return response()->json(['message' => 'Lab technician not found'], 404);
            }
            
            $testBooking->markSampleCollected($labTech->id);
            return response()->json($testBooking->fresh());
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function markProcessing(Request $request, TestBooking $testBooking)
    {
        try {
            // Get the lab technician user from the seeded data
            $labTech = \App\Models\User::where('email', 'lab_technician@example.com')->first();
            
            if (!$labTech) {
                return response()->json(['message' => 'Lab technician not found'], 404);
            }
            
            $testBooking->markProcessing($labTech->id);
            return response()->json($testBooking->fresh());
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function markReviewed(Request $request, TestBooking $testBooking)
    {
        try {
            // Get the pathologist user from the seeded data
            $pathologist = \App\Models\User::where('email', 'pathologist@example.com')->first();
            
            if (!$pathologist) {
                return response()->json(['message' => 'Pathologist not found'], 404);
            }
            
            $testBooking->markReviewed($pathologist->id);
            return response()->json($testBooking->fresh());
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function markCompleted(Request $request, TestBooking $testBooking)
    {
        try {
            // Get the pathologist user from the seeded data
            $pathologist = \App\Models\User::where('email', 'pathologist@example.com')->first();
            
            if (!$pathologist) {
                return response()->json(['message' => 'Pathologist not found'], 404);
            }
            
            $testBooking->markCompleted($pathologist->id);
            return response()->json($testBooking->fresh());
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function cancel(Request $request, TestBooking $testBooking)
    {
        $user = Auth::user();
        // Only doctors who created the booking or admin can cancel
        if (!$user->hasRole('admin') && 
            !($user->hasRole('doctor') && $testBooking->doctor_id === $user->id)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'notes' => 'nullable|string'
        ]);

        try {
            $testBooking->cancel($request->notes);
            return response()->json($testBooking->fresh());
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}

