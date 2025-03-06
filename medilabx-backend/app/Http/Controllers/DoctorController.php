<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    // GET /doctors
    public function index()
    {
        // Retrieve all doctors
        return Doctor::all();
    }

    // GET /doctors/{id}
    public function show($id)
    {
        // Retrieve a single doctor
        return Doctor::findOrFail($id);
    }

    // POST /doctors
    public function store(Request $request)
    {
        // Create a new doctor
        $doctor = Doctor::create($request->all());
        return response()->json($doctor, 201);
    }

    // PUT /doctors/{id}
    public function update(Request $request, $id)
    {
        // Update an existing doctor
        $doctor = Doctor::findOrFail($id);
        $doctor->update($request->all());
        return response()->json($doctor, 200);
    }

    // DELETE /doctors/{id}
    public function destroy($id)
    {
        // Delete a doctor
        Doctor::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
