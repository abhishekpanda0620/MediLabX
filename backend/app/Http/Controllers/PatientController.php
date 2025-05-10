<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\User;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    // GET /patients
    public function index()
    {
        // Check if there are any patients in the database
        $patients = User::role('patient')->get();
        
        // If no patients found, create some dummy data
        if ($patients->isEmpty()) {
            return response()->json(['message' => 'No patients found'], 404);


        }
        
        return response()->json($patients);
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
        User::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
