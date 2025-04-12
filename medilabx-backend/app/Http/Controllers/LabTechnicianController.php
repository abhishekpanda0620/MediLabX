<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\LabTechnician;
use Illuminate\Http\Request;

class LabTechnicianController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Check if there are any lab technicians in the database
        $labTechs = User::hasRole('lab_technician')->get();
        
        // If no lab technicians found, create a default one
        if ($labTechs->isEmpty()) {
         return response()->json(['message' => 'No lab technicians found'], 404);
        }
        
        return response()->json($labTechs);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        
        // Create a new lab technician
        $labTech = User::create($request->all());
        // Assign the 'lab_technician' role
        $labTech->assignRole('lab_technician');
        return response()->json($labTech, 201);

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Retrieve a single lab technician
        return User::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {   
        // Update an existing lab technician
        $labTech = User::findOrFail($id);
        $labTech->update($request->all());
        return response()->json($labTech, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        
        // Delete a lab technician
        User::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
