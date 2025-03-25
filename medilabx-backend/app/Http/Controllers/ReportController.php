<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function index()
    {
        return Report::with('patient', 'pathologist')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'test_type' => 'required|string',
            'file' => 'required|mimes:pdf|max:2048'
        ]);

        $path = $request->file('file')->store('reports', 'public');

        return Report::create([
            'patient_id' => $request->patient_id,
            'pathologist_id' => auth()->id(),
            'test_type' => $request->test_type,
            'file_path' => $path
        ]);
    }
}

