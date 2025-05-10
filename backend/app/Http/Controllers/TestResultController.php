<?php

namespace App\Http\Controllers;

use App\Models\TestReport;
use App\Models\TestParameter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TestResultController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function validateResults(Request $request, TestReport $testReport)
    {
        if (!Auth::user()->hasRole(['lab_technician', 'pathologist'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'results' => 'required|array',
            'results.*.parameter_id' => 'required|exists:test_parameters,id',
            'results.*.value' => 'required'
        ]);

        $validatedResults = [];
        $criticalResults = [];

        foreach ($request->results as $result) {
            $parameter = TestParameter::find($result['parameter_id']);
            $validation = $parameter->checkValue($result['value']);
            
            $validatedResults[] = [
                'parameter_id' => $result['parameter_id'],
                'parameter_name' => $parameter->parameter_name,
                'value' => $result['value'],
                'unit' => $parameter->unit,
                'normal_range' => $parameter->normal_range,
                'status' => $validation['status'],
                'interpretation' => $validation['message']
            ];

            if ($validation['status'] === 'critical') {
                $criticalResults[] = [
                    'parameter' => $parameter->parameter_name,
                    'value' => $result['value'],
                    'message' => $validation['message']
                ];
            }
        }

        return response()->json([
            'results' => $validatedResults,
            'critical_results' => $criticalResults,
            'has_critical_values' => count($criticalResults) > 0
        ]);
    }

    public function getParameterReferenceRanges(TestParameter $parameter, Request $request)
    {
        $request->validate([
            'age' => 'required|numeric',
            'gender' => 'required|in:male,female'
        ]);

        $range = $parameter->getReferenceRange($request->age, $request->gender);

        return response()->json([
            'parameter' => $parameter->parameter_name,
            'reference_range' => $range
        ]);
    }

    public function calculateStatistics(Request $request)
    {
        if (!Auth::user()->hasRole(['lab_technician', 'pathologist', 'admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'parameter_id' => 'required|exists:test_parameters,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date'
        ]);

        $results = TestReport::whereBetween('created_at', [$request->start_date, $request->end_date])
            ->whereJsonContains('test_results', ['parameter_id' => $request->parameter_id])
            ->get()
            ->pluck('test_results')
            ->flatten(1)
            ->where('parameter_id', $request->parameter_id)
            ->pluck('value');

        if ($results->isEmpty()) {
            return response()->json(['message' => 'No data available for the specified period']);
        }

        return response()->json([
            'count' => $results->count(),
            'average' => $results->average(),
            'min' => $results->min(),
            'max' => $results->max(),
            'normal_percentage' => $results->where('status', 'normal')->count() / $results->count() * 100,
            'abnormal_percentage' => $results->where('status', 'abnormal')->count() / $results->count() * 100,
            'critical_percentage' => $results->where('status', 'critical')->count() / $results->count() * 100
        ]);
    }
}