<?php

namespace App\Http\Controllers;

use App\Models\TestPackage;
use App\Models\Test;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TestPackageController extends Controller
{
    /**
     * Display a listing of the test packages.
     */
    public function index()
    {
        $packages = TestPackage::with('tests')->get();
        return response()->json($packages);
    }

    /**
     * Store a newly created test package.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
            'gender' => 'required|string|in:male,female,both', // Add gender validation
            'test_ids' => 'required|array|min:1',
            'test_ids.*' => 'exists:tests,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Create the test package
        $package = TestPackage::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'discount_percentage' => $request->discount_percentage ?? 0,
            'gender' => $request->gender, // Add gender field
            'is_active' => $request->has('is_active') ? $request->is_active : true,
        ]);

        // Attach the tests
        $package->tests()->attach($request->test_ids);
        
        // Load relationships for response
        $package->load('tests');
        
        return response()->json($package, 201);
    }

    /**
     * Display the specified test package.
     */
    public function show(TestPackage $testPackage)
    {
        $testPackage->load('tests');
        return response()->json($testPackage);
    }

    /**
     * Update the specified test package.
     */
    public function update(Request $request, TestPackage $testPackage)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
            'gender' => 'sometimes|required|string|in:male,female,both', // Add gender validation
            'is_active' => 'sometimes|required|boolean',
            'test_ids' => 'sometimes|required|array|min:1',
            'test_ids.*' => 'exists:tests,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Update the package attributes
        $testPackage->update($request->only(['name', 'description', 'price', 'discount_percentage', 'gender', 'is_active']));
        
        // Sync tests if provided
        if ($request->has('test_ids')) {
            $testPackage->tests()->sync($request->test_ids);
        }
        
        // Load relationships for response
        $testPackage->load('tests');
        
        return response()->json($testPackage);
    }

    /**
     * Remove the specified test package.
     */
    public function destroy(TestPackage $testPackage)
    {
        $testPackage->tests()->detach();
        $testPackage->delete();
        
        return response()->json(null, 204);
    }
    
    /**
     * Get all available tests for creating packages.
     */
    public function getAvailableTests()
    {
        $tests = Test::select('id', 'name', 'price', 'category', 'code')->get();
        return response()->json($tests);
    }
}
