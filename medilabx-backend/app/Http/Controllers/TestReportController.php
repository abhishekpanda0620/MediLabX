<?php

namespace App\Http\Controllers;

use App\Models\TestReport;
use App\Models\TestBooking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Exception;

class TestReportController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = TestReport::with(['testBooking', 'testBooking.patient', 'testBooking.test', 'labTechnician', 'pathologist']);

        // Filter reports based on user role
        if ($user->hasRole('patient')) {
            $query->whereHas('testBooking', function ($q) use ($user) {
                $q->where('patient_id', $user->id);
            });
        } elseif ($user->hasRole('doctor')) {
            $query->whereHas('testBooking', function ($q) use ($user) {
                $q->where('doctor_id', $user->id);
            });
        } elseif ($user->hasRole('lab_technician')) {
            $query->where('lab_technician_id', $user->id)
                  ->whereIn('status', [TestReport::STATUS_DRAFT, TestReport::STATUS_SUBMITTED, TestReport::STATUS_REJECTED]);
        } elseif ($user->hasRole('pathologist')) {
            $query->whereIn('status', [TestReport::STATUS_SUBMITTED, TestReport::STATUS_REVIEWED]);
        }

        // Add filter for status if provided in the request
        if ($request->has('status')) {
            $query->where('status', $request->status);
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
        $user = Auth::user();
        if (!$user->hasRole('lab_technician')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Use the User ID directly instead of looking for a labTechnician relationship
        $request->validate([
            'test_results' => 'array', // Changed from 'required|array' to 'array' to allow empty arrays
            'notes' => 'nullable|string'
        ]);

        try {
            $testReport->submit(
                $user->id, // Use the User ID directly
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
        $user = Auth::user();
        if (!$user->hasRole('pathologist')) {
            return response()->json(['message' => 'Unauthorized'], 403);
         }

        // Use the User ID directly instead of looking for a pathologist relationship
        $request->validate([
            'notes' => 'nullable|string',
            'conclusion' => 'required|string'
        ]);

        try {
            $testReport->review(
                $user->id, // Use the User ID directly
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
        $user = Auth::user();
        if (!$user->hasRole('pathologist')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Use the User ID directly instead of looking for a pathologist relationship
        try {
            $testReport->validate($user->id);
            return response()->json($testReport->fresh());
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function reject(Request $request, TestReport $testReport)
    {
        $user = Auth::user();
        if (!$user->hasRole('pathologist')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Use the User ID directly instead of looking for a pathologist relationship
        $request->validate([
            'notes' => 'required|string'
        ]);

        try {
            $testReport->reject($user->id, $request->notes);
            return response()->json($testReport->fresh());
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    /**
     * Download the test report as a PDF.
     */
    public function download(Request $request, TestReport $testReport)
    {
        $user = Auth::user();
        
        // Check authorization - patients can only access their own reports,
        // doctors can only access reports they ordered, lab staff can access any report
        if ($user->hasRole('patient') && $testReport->testBooking->patient_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        } elseif ($user->hasRole('doctor') && $testReport->testBooking->doctor_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        // Load necessary relationships if not already loaded
        $testReport->load(['testBooking.patient', 'testBooking.test', 'testBooking.doctor', 'labTechnician', 'pathologist']);
        
        // Format dates nicely
        $reportDate = $testReport->created_at->format('F j, Y');
        $reviewedDate = $testReport->reviewed_at ? $testReport->reviewed_at->format('F j, Y') : 'Not reviewed yet';
        $validatedDate = $testReport->validated_at ? $testReport->validated_at->format('F j, Y') : 'Not validated yet';
        
        // Generate PDF using the view
        $pdf = \PDF::loadView('reports.test_report', [
            'report' => $testReport,
            'reportDate' => $reportDate,
            'reviewedDate' => $reviewedDate,
            'validatedDate' => $validatedDate
        ]);
        
        // Set PDF options
        $pdf->setPaper('a4', 'portrait');
        $pdf->setOptions([
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled' => true
        ]);
        
        // Generate a meaningful filename
        $patientName = $testReport->testBooking->patient->name ?? 'Unknown';
        $testName = $testReport->testBooking->test->name ?? 'Test';
        $date = now()->format('Y-m-d');
        $filename = "Report_{$testName}_{$patientName}_{$date}.pdf";
        
        // Return the PDF for download
        return $pdf->download($filename);
    }

    /**
     * Send notification to patient about their report.
     */
    public function notify(Request $request, TestReport $testReport)
    {
        // Check if report is validated
        if ($testReport->status !== TestReport::STATUS_VALIDATED) {
            return response()->json(['message' => 'Only validated reports can be shared with patients'], 422);
        }

        // Load the necessary relationships
        $testReport->load(['testBooking.patient', 'testBooking.test']);
        
        $patient = $testReport->testBooking->patient;
        
        if (!$patient) {
            return response()->json(['message' => 'Patient not found'], 404);
        }
        
        // Get patient email
        $patientEmail = $patient->email;
        $patientName = $patient->name;
        $testName = $testReport->testBooking->test->name ?? 'Test';
        
        // In a real application, you would queue an email job here
        // For now, we'll just simulate a successful email send
        
        // Example of how you would send an email in a real application:
        // Mail::to($patientEmail)->send(new TestReportAvailable($testReport));
        
        // Or send an SMS using a service like Twilio:
        // $this->sendSms($patient->phone_number, "Hello $patientName, your $testName report is now available. Please login to view it.");
        
        // Log the notification attempt
        \Log::info("Notification sent to patient: {$patientName} ({$patientEmail}) for test report #{$testReport->id}");
        
        return response()->json([
            'success' => true,
            'message' => "Notification sent to patient: {$patientName}",
        ]);
    }
}