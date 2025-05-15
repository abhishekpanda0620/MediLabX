<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Role;

class StaffController extends Controller
{
    /**
     * Display a listing of all staff members.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Get all users with staff roles (not patients)
        $staff = User::with('roles')
            ->whereHas('roles', function($q) {
                $q->whereIn('name', ['admin', 'doctor', 'lab_technician', 'pathologist']);
            })
            ->get()
            ->map(function($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->getRoleNames()->first(),
                    'status' => 'Active' // You might want to add a status field to your users table
                ];
            });
        
        return response()->json($staff);
    }

    /**
     * Store a newly created staff member.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Validate request data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:admin,doctor,lab_technician,pathologist'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Create user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);

        // Assign role
        $user->assignRole($request->role);

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $request->role,
                'status' => 'Active'
            ],
            'message' => 'Staff member created successfully'
        ], 201);
    }

    /**
     * Display the specified staff member.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user = User::findOrFail($id);
        
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->getRoleNames()->first(),
            'status' => 'Active' // You might want to add a status field to your users table
        ]);
    }

    /**
     * Update the specified staff member.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        // Find user
        $user = User::findOrFail($id);

        // Validate request data
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,'.$id,
            'password' => 'sometimes|required|string|min:8',
            'role' => 'sometimes|required|string|in:admin,doctor,lab_technician,pathologist'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Update basic user information
        if ($request->has('name')) {
            $user->name = $request->name;
        }

        if ($request->has('email')) {
            $user->email = $request->email;
        }

        if ($request->has('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        // Update role if provided
        if ($request->has('role')) {
            // Remove existing roles
            $user->roles()->detach();
            // Assign new role
            $user->assignRole($request->role);
        }

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->getRoleNames()->first(),
                'status' => 'Active'
            ],
            'message' => 'Staff member updated successfully'
        ]);
    }

    /**
     * Remove the specified staff member.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        // Check if user is the only admin
        $isAdmin = $user->hasRole('admin');
        if ($isAdmin) {
            $adminCount = User::role('admin')->count();
            if ($adminCount <= 1) {
                return response()->json(['message' => 'Cannot delete the only admin user'], 403);
            }
        }
        
        $user->delete();
        
        return response()->json(['message' => 'Staff member deleted successfully']);
    }
    
    /**
     * Search for staff members based on criteria.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function search(Request $request)
    {
        $query = User::query()->with('roles')
            ->whereHas('roles', function($q) {
                $q->whereIn('name', ['admin', 'doctor', 'lab_technician', 'pathologist']);
            });
            
        // Filter by name
        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }
        
        // Filter by email
        if ($request->has('email')) {
            $query->where('email', 'like', '%' . $request->email . '%');
        }
        
        // Filter by role
        if ($request->has('role')) {
            $query->whereHas('roles', function($q) use ($request) {
                $q->where('name', $request->role);
            });
        }
        
        $staff = $query->get()->map(function($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->getRoleNames()->first(),
                'status' => 'Active'
            ];
        });
        
        return response()->json($staff);
    }
    
    /**
     * Get available roles for staff members.
     * 
     * @return \Illuminate\Http\Response
     */
    public function getRoles()
    {
        $roles = Role::whereIn('name', ['admin', 'doctor', 'lab_technician', 'pathologist'])
            ->get()
            ->pluck('name');
            
        return response()->json([
            'roles' => $roles
        ]);
    }
}
