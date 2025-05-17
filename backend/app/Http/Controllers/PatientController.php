<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class PatientController extends Controller
{
    // GET /patients
    public function index()
    {
        // Get all patients
        $patients = Patient::with('user')->orderBy('created_at', 'desc')->get();
        
        if ($patients->isEmpty()) {
            return response()->json(['message' => 'No patients found'], 404);
        }
        
        return response()->json($patients);
    }

    // GET /patients/{id}
    public function show($id)
    {
        $patient = Patient::with('user')->findOrFail($id);
        return response()->json($patient);
    }

    /**
     * Get the patient record for the current logged-in user
     */
    public function current()
    {
        $user = auth()->user();
        
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
        
        $patient = Patient::where('user_id', $user->id)->first();
        
        if (!$patient) {
            return response()->json(['message' => 'No patient record found for this user'], 404);
        }
        
        return response()->json($patient);
    }

    // POST /patients
    public function store(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:patients',
            'phone' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'address' => 'nullable|string',
            'medical_history' => 'nullable|string',
            'blood_group' => 'nullable|string|max:5',
            'emergency_contact' => 'nullable|string|max:20',
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
                // Create user with patient role
                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make($request->password ?? 'password123'), // Default password if not provided
                ]);
                $user->assignRole('patient');
                $userId = $user->id;
            }
            
            // Create patient record
            $patient = Patient::create([
                'user_id' => $userId,
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'date_of_birth' => $request->date_of_birth,
                'gender' => $request->gender,
                'address' => $request->address,
                'medical_history' => $request->medical_history,
                'blood_group' => $request->blood_group,
                'emergency_contact' => $request->emergency_contact,
                'is_active' => true,
            ]);
            
            DB::commit();
            return response()->json($patient, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create patient', 'error' => $e->getMessage()], 500);
        }
    }

    // PUT /patients/{id}
    public function update(Request $request, $id)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:patients,email,'.$id,
            'phone' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date',
            'gender' => 'nullable|in:male,female,other',
            'address' => 'nullable|string',
            'medical_history' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'blood_group' => 'nullable|string|max:5',
            'emergency_contact' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        try {
            // Update patient record
            $patient = Patient::findOrFail($id);
            $patient->update($request->all());
            
            // If patient has a user, update that too
            if ($patient->user_id && $patient->user) {
                $patient->user->update([
                    'name' => $request->name,
                    'email' => $request->email,
                ]);
                
                // Update password if provided
                if ($request->has('password') && !empty($request->password)) {
                    $patient->user->update([
                        'password' => Hash::make($request->password),
                    ]);
                }
            }
            
            DB::commit();
            return response()->json($patient, 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to update patient', 'error' => $e->getMessage()], 500);
        }
    }
    
    // DELETE /patients/{id}
    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $patient = Patient::findOrFail($id);
            
            // If patient has a user and you want to delete the user too
            if ($patient->user_id && $patient->user) {
                $patient->user->delete();
            }
            
            $patient->delete();
            DB::commit();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to delete patient', 'error' => $e->getMessage()], 500);
        }
    }
}
