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
        // Debug info to help troubleshoot
        \Log::info('TestBooking index called', [
            'user_id' => $user->id,
            'user_roles' => $user->getRoleNames(),
            'request_params' => $request->all()
        ]);
        
        $query = TestBooking::with(['patient', 'labTechnician', 'pathologist', 'doctor', 'test']);

        // Filter by user role if no specific status is requested
        if (!$request->has('status')) {
            if ($user->hasRole('patient')) {
                // If user is a patient, find their patient record and filter by that
                $patient = \App\Models\Patient::where('user_id', $user->id)->first();
                if ($patient) {
                    $query->where('patient_id', $patient->id);
                }
            } elseif ($user->hasRole('doctor')) {
                // If user is a doctor, find their doctor record and filter by that
                $doctor = \App\Models\Doctor::where('user_id', $user->id)->first();
                if ($doctor) {
                    $query->where('doctor_id', $doctor->id);
                }
            } elseif ($user->hasRole('lab_technician')) {
                // For lab technicians, show all relevant statuses for sample management
                $query->whereIn('status', [
                    TestBooking::STATUS_BOOKED, 
                    TestBooking::STATUS_SAMPLE_COLLECTED, 
                    TestBooking::STATUS_PROCESSING
                ]);
            } elseif ($user->hasRole('pathologist')) {
                $query->whereIn('status', [TestBooking::STATUS_PROCESSING, TestBooking::STATUS_REVIEWED]);
            }
        } else {
            // If status parameter is provided, filter by that status
            $status = $request->status;
            $query->where('status', $status);
            
            // Still apply user role restrictions for security
            if ($user->hasRole('patient')) {
                $patient = \App\Models\Patient::where('user_id', $user->id)->first();
                if ($patient) {
                    $query->where('patient_id', $patient->id);
                }
            } elseif ($user->hasRole('doctor')) {
                $doctor = \App\Models\Doctor::where('user_id', $user->id)->first();
                if ($doctor) {
                    $query->where('doctor_id', $doctor->id);
                }
            }
        }

        // Get the results and add hasReport attribute to each test booking
        $testBookings = $query->latest()->get();
        
        $testBookings->each(function ($testBooking) {
            // Explicitly make sure it's a boolean value
            $hasReport = $testBooking->hasReport() ? true : false;
            $testBooking->setAttribute('hasReport', $hasReport);
            
            // Also log for debugging
            \Log::info('Test Booking '.$testBooking->id.' hasReport: '.($hasReport ? 'true' : 'false'));
        });

        return response()->json($testBookings);
    }

    public function store(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'doctor_id' => 'required|exists:doctors,id',
            'test_id' => 'required_without:test_package_id|exists:tests,id',
            'test_package_id' => 'required_without:test_id|exists:test_packages,id',
            'notes' => 'nullable|string'
        ]);

        // Check if the provided patient ID exists
        $patient = \App\Models\Patient::find($request->patient_id);
        $doctor = \App\Models\Doctor::find($request->doctor_id);

        if (!$patient) {
            return response()->json(['message' => 'Invalid patient ID. Patient not found.'], 422);
        }

        if (!$doctor) {
            return response()->json(['message' => 'Invalid doctor ID. Doctor not found.'], 422);
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
            // Get the current user if they are a lab technician
            $user = Auth::user();
            if (!$user->hasRole('lab_technician')) {
                return response()->json(['message' => 'Unauthorized. Only lab technicians can perform this action.'], 403);
            }
            
            $testBooking->markSampleCollected($user->id);
            return response()->json($testBooking->fresh());
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function markProcessing(Request $request, TestBooking $testBooking)
    {
        try {
            // Get the current user if they are a lab technician
            $user = Auth::user();
            if (!$user->hasRole('lab_technician')) {
                return response()->json(['message' => 'Unauthorized. Only lab technicians can perform this action.'], 403);
            }
            
            $testBooking->markProcessing($user->id);
            return response()->json($testBooking->fresh());
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function markReviewed(Request $request, TestBooking $testBooking)
    {
        try {
            // Get the current user if they are a pathologist or lab technician
            $user = Auth::user();
            if (!$user->hasRole('pathologist') && !$user->hasRole('lab_technician')) {
                return response()->json(['message' => 'Unauthorized. Only pathologists or lab technicians can perform this action.'], 403);
            }
            
            $testBooking->markReviewed($user->id);
            return response()->json($testBooking->fresh());
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function markCompleted(Request $request, TestBooking $testBooking)
    {
        try {
            // Get the current user if they are a pathologist or lab technician
            $user = Auth::user();
            if (!$user->hasRole('pathologist') && !$user->hasRole('lab_technician')) {
                return response()->json(['message' => 'Unauthorized. Only pathologists or lab technicians can perform this action.'], 403);
            }
            
            $testBooking->markCompleted($user->id);
            return response()->json($testBooking->fresh());
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function cancel(Request $request, TestBooking $testBooking)
    {
        $user = Auth::user();
        // Only doctors who created the booking or admin can cancel
        if (!$user->hasRole('admin')) {
            // If user is a doctor, check if they are associated with this booking
            if ($user->hasRole('doctor')) {
                $doctor = \App\Models\Doctor::where('user_id', $user->id)->first();
                if (!$doctor || $testBooking->doctor_id !== $doctor->id) {
                    return response()->json(['message' => 'Unauthorized'], 403);
                }
            } else {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
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

