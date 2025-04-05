<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    // GET /patients
    public function index()
    {
        // Retrieve all patients
        return User::hasRole('patient')->get();
        
    }

    // GET /patients/{id}
    public function show($id)
    {
        // Retrieve a single patient
        return User::findOrFail($id);
    }

    // POST /patients
    public function store(Request $request)
    {
        // Create a new patient
        $patient = User::create($request->all());
        // Assign the 'patient' role
        $patient->assignRole('patient');
        return response()->json($patient, 201);
    }

    // PUT /patients/{id}
    public function update(Request $request, $id)
    {
        // Update an existing patient
        $patient = User::findOrFail($id);
        $patient->update($request->all());
        return response()->json($patient, 200);
    }

    // DELETE /patients/{id}
    public function destroy($id)
    {
        // Delete a patient
        Patient::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
