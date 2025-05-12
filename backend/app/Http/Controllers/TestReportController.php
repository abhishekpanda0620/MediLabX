<?php

namespace App\Http\Controllers;

use App\Models\TestReport;
use App\Models\TestBooking;
use App\Services\PDF\DirectPDFGenerator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;
use Exception;

class TestReportController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $query = TestReport::with(['testBooking', 'testBooking.patient', 'testBooking.test', 'labTechnician', 'pathologist']);

        // Check if showAll parameter is specified, used for admin views and lab reports page
        if ($request->has('showAll') && $request->showAll === 'true') {
            // If showAll is true, we only apply role-based restrictions for non-staff users
            if ($user->hasRole('patient')) {
                $query->whereHas('testBooking', function ($q) use ($user) {
                    $q->where('patient_id', $user->id);
                });
            } elseif ($user->hasRole('doctor')) {
                $query->whereHas('testBooking', function ($q) use ($user) {
                    $q->where('doctor_id', $user->id);
                });
            }
            // Lab technicians and pathologists can see all reports with showAll=true
        } else {
            // Standard filtering based on user role
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

        $request->validate([
            'test_results' => 'required|array|min:1',
            'test_results.*.parameter_id' => 'required|exists:test_parameters,id',
            'test_results.*.value' => 'required',
            'notes' => 'nullable|string',
        ]);

        try {
            $testReport->update([
                'test_results' => $request->test_results,
                'technician_notes' => $request->notes,
                'status' => TestReport::STATUS_SUBMITTED,
                'submitted_at' => now(),
                'lab_technician_id' => $user->id,
            ]);

            return response()->json($testReport->fresh());
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to submit report', 'error' => $e->getMessage()], 500);
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

        // Authorization checks
        if ($user->hasRole('patient') && $testReport->testBooking->patient_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        } elseif ($user->hasRole('doctor') && $testReport->testBooking->doctor_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Temporarily allow any report to be downloaded for testing
        // if ($testReport->status !== TestReport::STATUS_VALIDATED) {
        //     return response()->json(['message' => 'Report must be validated before download'], 422);
        // }

        try {
            // Load necessary relationships
            $testReport->load(['testBooking.patient', 'testBooking.test', 'testBooking.test.parameters', 'labTechnician', 'pathologist']);

            // Check for missing data
            if (!$testReport->testBooking || !$testReport->testBooking->patient || !$testReport->testBooking->test) {
                return response()->json(['message' => 'Incomplete report data. Please contact support.'], 500);
            }

            // Generate PDF using our direct generator
            $dompdf = DirectPDFGenerator::fromView('reports.test_report', [
                'report' => $testReport,
                'reportDate' => now()->format('F j, Y'),
                'validatedDate' => $testReport->validated_at ? 
                    date('F j, Y H:i:s', strtotime($testReport->validated_at)) : 
                    'Not validated'
            ]);
            
            // Generate a meaningful filename for download
            $filename = "Report_{$testReport->id}.pdf";
            
            // Return the PDF as a downloadable file
            return response($dompdf->output())
                ->header('Content-Type', 'application/pdf')
                ->header('Content-Disposition', "attachment; filename=\"$filename\"");
        } catch (\Exception $e) {
            \Log::error("PDF Generation Error: " . $e->getMessage());
            \Log::error($e->getTraceAsString());
            return response()->json(['message' => 'Error generating PDF: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Preview the test report (for web view).
     */
    public function preview(Request $request, TestReport $testReport)
    {
        $user = Auth::user();

        // Authorization checks (same as download)
        if ($user->hasRole('patient') && $testReport->testBooking->patient_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        } elseif ($user->hasRole('doctor') && $testReport->testBooking->doctor_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Load necessary relationships
        $testReport->load(['testBooking.patient', 'testBooking.test', 'labTechnician', 'pathologist']);

        // Return the report data for preview
        return response()->json([
            'report' => $testReport,
            'parameters' => $testReport->testBooking->test->parameters ?? []
        ]);
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

        try {
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
            
            // Log the notification attempt
            \Log::info("Notification sent to patient: {$patientName} ({$patientEmail}) for test report #{$testReport->id}");
            
            return response()->json([
                'success' => true,
                'message' => "Notification sent to patient: {$patientName}",
            ]);
        } catch (\Exception $e) {
            \Log::error("Notification Error: " . $e->getMessage());
            return response()->json(['message' => 'Error sending notification: ' . $e->getMessage()], 500);
        }
    }
}