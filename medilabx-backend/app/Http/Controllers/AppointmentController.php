<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    // GET /appointments
    public function index()
    {
        // Retrieve all appointments
        return Appointment::all();
    }

    // GET /appointments/{id}
    public function show($id)
    {
        // Retrieve a single appointment
        return Appointment::findOrFail($id);
    }

    // POST /appointments
    public function store(Request $request)
    {
        // Create a new appointment
        $appointment = Appointment::create($request->all());
        return response()->json($appointment, 201);
    }

    // PUT /appointments/{id}
    public function update(Request $request, $id)
    {
        // Update an existing appointment
        $appointment = Appointment::findOrFail($id);
        $appointment->update($request->all());
        return response()->json($appointment, 200);
    }

    // DELETE /appointments/{id}
    public function destroy($id)
    {
        // Delete an appointment
        Appointment::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
