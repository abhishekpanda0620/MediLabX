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
        $this->middleware('auth');
    }

    public function index()
    {
        $user = Auth::user();
        $query = TestBooking::with(['patient', 'labTechnician', 'pathologist', 'doctor', 'test']);

        if ($user->hasRole('patient')) {
            $query->where('patient_id', $user->patient->id);
        } elseif ($user->hasRole('doctor')) {
            $query->where('doctor_id', $user->doctor->id);
        } elseif ($user->hasRole('lab_technician')) {
            $query->whereIn('status', [TestBooking::STATUS_BOOKED, TestBooking::STATUS_SAMPLE_COLLECTED, TestBooking::STATUS_PROCESSING]);
        } elseif ($user->hasRole('pathologist')) {
            $query->whereIn('status', [TestBooking::STATUS_PROCESSING, TestBooking::STATUS_REVIEWED]);
        }

        return response()->json($query->latest()->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'test_id' => 'required|exists:tests,id',
            'doctor_id' => 'required|exists:doctors,id',
            'notes' => 'nullable|string'
        ]);

        $booking = TestBooking::create([
            'patient_id' => $request->patient_id,
            'test_id' => $request->test_id,
            'doctor_id' => $request->doctor_id,
            'status' => TestBooking::STATUS_BOOKED,
            'notes' => $request->notes
        ]);

        return response()->json($booking->load(['patient', 'test', 'doctor']), 201);
    }

    public function markSampleCollected(Request $request, TestBooking $testBooking)
    {
        if (!Auth::user()->hasRole('lab_technician')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $testBooking->markSampleCollected(Auth::user()->labTechnician->id);
            return response()->json($testBooking->fresh());
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function markProcessing(Request $request, TestBooking $testBooking)
    {
        if (!Auth::user()->hasRole('lab_technician')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $testBooking->markProcessing(Auth::user()->labTechnician->id);
            return response()->json($testBooking->fresh());
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function markReviewed(Request $request, TestBooking $testBooking)
    {
        if (!Auth::user()->hasRole('pathologist')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $testBooking->markReviewed(Auth::user()->pathologist->id);
            return response()->json($testBooking->fresh());
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function markCompleted(Request $request, TestBooking $testBooking)
    {
        if (!Auth::user()->hasRole('pathologist')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $testBooking->markCompleted(Auth::user()->pathologist->id);
            return response()->json($testBooking->fresh());
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function cancel(Request $request, TestBooking $testBooking)
    {
        // Only doctors who created the booking or admin can cancel
        if (!Auth::user()->hasRole('admin') && 
            !(Auth::user()->hasRole('doctor') && $testBooking->doctor_id === Auth::user()->doctor->id)) {
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

