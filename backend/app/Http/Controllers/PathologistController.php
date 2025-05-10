<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PathologistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        
        // Check if there are any pathologists in the database
        $pathologists = User::Hasrole('pathologist')->get();
        
        // If no pathologists found, create some dummy data
        if ($pathologists->isEmpty()) {
            return response()->json(['message' => 'No pathologists found'], 404);
        }
        
        return response()->json($pathologists);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        
        // Validate the request
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'required|string|max:15',
            'address' => 'nullable|string|max:255'
        ]);

        // Create a new pathologist
        $pathologist = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'phone' => $request->phone,
            'address' => $request->address
        ]);

        // Assign the pathologist role
        $pathologist->assignRole('pathologist');

        return response()->json($pathologist, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        
        // Retrieve a single pathologist
        return User::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        
        // Validate the request
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $id,
            'password' => 'sometimes|required|string|min:8|confirmed',
            'phone' => 'sometimes|required|string|max:15',
            'address' => 'sometimes|nullable|string|max:255'
        ]);

        // Update the pathologist
        $pathologist = User::findOrFail($id);
        $pathologist->update($request->all());

        return response()->json($pathologist, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        
        // Delete a pathologist
        User::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
