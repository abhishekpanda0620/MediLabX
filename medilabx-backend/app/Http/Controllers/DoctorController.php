<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\User;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    public function index()
    {
        // Check if there are any doctors in the database
        $doctors = User::role('doctor')->get();
        // If no doctors found, create some dummy data
        if ($doctors->isEmpty()) {
            return response()->json(['message' => 'No doctors found'], 404);
        }
        return response()->json($doctors);
    }
    
    public function show($id)
    {
        // Retrieve a single doctor
        return User::findOrFail($id);
    }
    public function store(Request $request)
    {
        // Create a new doctor
        $doctor = User::create($request->all());
        // Assign the 'doctor' role
        $doctor->assignRole('doctor');
        return response()->json($doctor, 201);
    }
    public function update(Request $request, $id)
    {
        // Update an existing doctor
        $doctor = User::findOrFail($id);
        $doctor->update($request->all());
        return response()->json($doctor, 200);
    }
    public function destroy($id)
    {
        // Delete a doctor
        User::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
