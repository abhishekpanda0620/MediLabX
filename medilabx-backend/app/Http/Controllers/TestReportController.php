<?php

namespace App\Http\Controllers;

use App\Models\TestReport;
use App\Models\TestBooking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Exception;

class TestReportController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(Request $request)
    {
        $user = Auth::user();
        $query = TestReport::with(['testBooking', 'labTechnician', 'pathologist']);

        // Filter reports based on user role
        if ($user->hasRole('patient')) {
            $query->whereHas('testBooking', function ($q) use ($user) {
                $q->where('patient_id', $user->patient->id);
            });
        } elseif ($user->hasRole('doctor')) {
            $query->whereHas('testBooking', function ($q) use ($user) {
                $q->where('doctor_id', $user->doctor->id);
            });
        } elseif ($user->hasRole('lab_technician')) {
            $query->where('lab_technician_id', $user->labTechnician->id)
                  ->whereIn('status', [TestReport::STATUS_DRAFT, TestReport::STATUS_SUBMITTED, TestReport::STATUS_REJECTED]);
        } elseif ($user->hasRole('pathologist')) {
            $query->whereIn('status', [TestReport::STATUS_SUBMITTED, TestReport::STATUS_REVIEWED]);
        }

        return response()->json($query->latest()->get());
    }

    public function store(Request $request, TestBooking $testBooking)
    {
        if (!Auth::user()->hasRole('lab_technician')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($testBooking->status !== TestBooking::STATUS_PROCESSING) {
            return response()->json(['message' => 'Test must be in processing state to create report'], 422);
        }

        $report = TestReport::create([
            'test_booking_id' => $testBooking->id,
            'status' => TestReport::STATUS_DRAFT,
            'test_results' => []
        ]);

        return response()->json($report->load(['testBooking', 'labTechnician']), 201);
    }

    public function submit(Request $request, TestReport $testReport)
    {
        if (!Auth::user()->hasRole('lab_technician')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'test_results' => 'required|array',
            'notes' => 'nullable|string'
        ]);

        try {
            $testReport->submit(
                Auth::user()->labTechnician->id,
                $request->test_results,
                $request->notes
            );

            return response()->json($testReport->fresh());
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function review(Request $request, TestReport $testReport)
    {
        if (!Auth::user()->hasRole('pathologist')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'notes' => 'nullable|string',
            'conclusion' => 'required|string'
        ]);

        try {
            $testReport->review(
                Auth::user()->pathologist->id,
                $request->notes,
                $request->conclusion
            );

            return response()->json($testReport->fresh());
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function validate(Request $request, TestReport $testReport)
    {
        if (!Auth::user()->hasRole('pathologist')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        try {
            $testReport->validate(Auth::user()->pathologist->id);
            return response()->json($testReport->fresh());
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function reject(Request $request, TestReport $testReport)
    {
        if (!Auth::user()->hasRole('pathologist')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'notes' => 'required|string'
        ]);

        try {
            $testReport->reject(Auth::user()->pathologist->id, $request->notes);
            return response()->json($testReport->fresh());
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}