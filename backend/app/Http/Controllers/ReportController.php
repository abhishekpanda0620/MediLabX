<?php

namespace App\Http\Controllers;

use App\Models\TestReport;
use App\Models\TestBooking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $query = TestReport::with(['testBooking.patient', 'labTechnician', 'pathologist']);

        // Filter based on user role
        if ($user->hasRole('patient')) {
            $query->whereHas('testBooking', function($q) use ($user) {
                $q->where('patient_id', $user->patient->id);
            });
        } elseif ($user->hasRole('doctor')) {
            $query->whereHas('testBooking', function($q) use ($user) {
                $q->where('doctor_id', $user->doctor->id);
            });
        }

        return response()->json($query->latest()->get());
    }

    public function show($id)
    {
        $report = TestReport::with(['testBooking.patient', 'labTechnician', 'pathologist'])
            ->findOrFail($id);

        // Check access permission
        $user = Auth::user();
        if ($user->hasRole('patient') && $report->testBooking->patient_id !== $user->patient->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($report);
    }

    public function download($id)
    {
        $report = TestReport::with(['testBooking.patient', 'testBooking.test', 'labTechnician', 'pathologist'])
            ->findOrFail($id);

        // Check access permission
        $user = Auth::user();
        if ($user->hasRole('patient') && $report->testBooking->patient_id !== $user->patient->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Generate PDF logic here...
        // This is a placeholder - implement actual PDF generation
        $pdf = PDF::loadView('reports.test_report', compact('report'));
        
        return $pdf->download("test_report_{$id}.pdf");
    }
}

