<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class DoctorController extends Controller
{
    // GET /doctors
    public function index()
    {
        // Get all doctors
        $doctors = Doctor::with('user')->orderBy('created_at', 'desc')->get();
        
        if ($doctors->isEmpty()) {
            return response()->json(['message' => 'No doctors found'], 404);
        }
        
        return response()->json($doctors);
    }

    // GET /doctors/{id}
    public function show($id)
    {
        $doctor = Doctor::with('user')->findOrFail($id);
        return response()->json($doctor);
    }

    // POST /doctors
    public function store(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:doctors',
            'phone' => 'nullable|string|max:20',
            'specialization' => 'required|string|max:255',
            'qualification' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'license_number' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        try {
            // Check if we also need to create a user account
            $createUser = $request->input('create_user', false);
            $userId = null;
            
            if ($createUser) {
                // Create user with doctor role
                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make($request->password ?? 'password123'), // Default password if not provided
                ]);
                $user->assignRole('doctor');
                $userId = $user->id;
            }
            
            // Create doctor record
            $doctor = Doctor::create([
                'user_id' => $userId,
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'specialization' => $request->specialization,
                'qualification' => $request->qualification,
                'bio' => $request->bio,
                'license_number' => $request->license_number,
                'is_active' => true,
            ]);
            
            DB::commit();
            return response()->json($doctor, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create doctor', 'error' => $e->getMessage()], 500);
        }
    }
    public function update(Request $request, $id)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:doctors,email,'.$id,
            'phone' => 'nullable|string|max:20',
            'specialization' => 'sometimes|required|string|max:255',
            'qualification' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'license_number' => 'nullable|string|max:50',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        try {
            // Update doctor record
            $doctor = Doctor::findOrFail($id);
            $doctor->update($request->all());
            
            // If doctor has a user, update that too
            if ($doctor->user_id && $doctor->user) {
                $doctor->user->update([
                    'name' => $request->name,
                    'email' => $request->email,
                ]);
                
                // Update password if provided
                if ($request->has('password') && !empty($request->password)) {
                    $doctor->user->update([
                        'password' => Hash::make($request->password),
                    ]);
                }
            }
            
            DB::commit();
            return response()->json($doctor, 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to update doctor', 'error' => $e->getMessage()], 500);
        }
    }
    
    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $doctor = Doctor::findOrFail($id);
            
            // If doctor has a user and you want to delete the user too
            if ($doctor->user_id && $doctor->user) {
                $doctor->user->delete();
            }
            
            $doctor->delete();
            DB::commit();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to delete doctor', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get the doctor record for the currently authenticated user
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function current()
    {
        $user = auth()->user();
        
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
        
        $doctor = Doctor::where('user_id', $user->id)->first();
        
        if (!$doctor) {
            return response()->json(['message' => 'No doctor record found for this user'], 404);
        }
        
        return response()->json($doctor);
    }
}
