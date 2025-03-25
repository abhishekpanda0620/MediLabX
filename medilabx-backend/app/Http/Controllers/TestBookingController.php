<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TestBookingController extends Controller
{
    public function index()
    {
        return TestBooking::with('patient', 'labTechnician')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'test_type' => 'required|string'
        ]);

        return TestBooking::create($request->all());
    }

    public function update(Request $request, TestBooking $testBooking)
    {
        $testBooking->update($request->all());
        return response()->json(['message' => 'Test booking updated']);
    }
}

