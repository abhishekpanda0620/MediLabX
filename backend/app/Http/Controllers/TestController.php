<?php

namespace App\Http\Controllers;

use App\Models\Test;
use App\Models\TestParameter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Exception;

class TestController extends Controller
{
    public function getCategories()
    {
        try {
            return response()->json(['categories' => Test::getCategories()]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch test categories',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getAllTestTemplates()
    {
        try {
            $tests = Test::with('parameters')->get();
            return response()->json($tests);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch test templates',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getTestTemplate($testId)
    {
        try {
            $test = Test::with('parameters')->findOrFail($testId);
            return response()->json($test);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Test template not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function createTestTemplate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:tests',
            'description' => 'nullable|string',
            'category' => 'required|string|max:50',
            'code' => 'nullable|string|max:20|unique:tests',
            'turn_around_time' => 'nullable|integer|min:1',
            'specimen_requirements' => 'nullable|string',
            'preparation_instructions' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'fasting_required' => 'boolean',
            'fasting_duration' => 'nullable|integer|min:1',
            'parameters' => 'required|array|min:1',
            'parameters.*.parameter_name' => 'required|string|max:255',
            'parameters.*.unit' => 'required|string|max:50',
            'parameters.*.normal_range' => 'required|string|max:100',
            'parameters.*.description' => 'nullable|string',
            'parameters.*.reference_ranges' => 'nullable|json',
            'parameters.*.critical_low' => 'nullable|string',
            'parameters.*.critical_high' => 'nullable|string',
            'parameters.*.interpretation_guide' => 'nullable|string',
            'parameters.*.method' => 'nullable|string|max:100',
            'parameters.*.instrument' => 'nullable|string|max:100'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();
            
            $test = Test::create([
                'name' => $request->name,
                'description' => $request->description,
                'category' => $request->category,
                'code' => $request->code,
                'turn_around_time' => $request->turn_around_time,
                'specimen_requirements' => $request->specimen_requirements,
                'preparation_instructions' => $request->preparation_instructions,
                'price' => $request->price,
                'fasting_required' => $request->fasting_required,
                'fasting_duration' => $request->fasting_duration
            ]);

            foreach ($request->parameters as $param) {
                TestParameter::create([
                    'test_id' => $test->id,
                    'parameter_name' => $param['parameter_name'],
                    'unit' => $param['unit'],
                    'normal_range' => $param['normal_range'],
                    'description' => $param['description'] ?? null,
                    'reference_ranges' => $param['reference_ranges'] ?? null,
                    'critical_low' => $param['critical_low'] ?? null,
                    'critical_high' => $param['critical_high'] ?? null,
                    'interpretation_guide' => $param['interpretation_guide'] ?? null,
                    'method' => $param['method'] ?? null,
                    'instrument' => $param['instrument'] ?? null
                ]);
            }

            DB::commit();

            return response()->json(
                Test::with('parameters')->findOrFail($test->id),
                201
            );
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create test template',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateTestTemplate(Request $request, $testId)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:tests,name,' . $testId,
            'description' => 'nullable|string',
            'category' => 'required|string|max:50',
            'code' => 'nullable|string|max:20|unique:tests,code,' . $testId,
            'turn_around_time' => 'nullable|integer|min:1',
            'specimen_requirements' => 'nullable|string',
            'preparation_instructions' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'fasting_required' => 'boolean',
            'fasting_duration' => 'nullable|integer|min:1',
            'parameters' => 'required|array|min:1',
            'parameters.*.parameter_name' => 'required|string|max:255',
            'parameters.*.unit' => 'required|string|max:50',
            'parameters.*.normal_range' => 'required|string|max:100',
            'parameters.*.description' => 'nullable|string',
            'parameters.*.reference_ranges' => 'nullable|json',
            'parameters.*.critical_low' => 'nullable|string',
            'parameters.*.critical_high' => 'nullable|string',
            'parameters.*.interpretation_guide' => 'nullable|string',
            'parameters.*.method' => 'nullable|string|max:100',
            'parameters.*.instrument' => 'nullable|string|max:100'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $test = Test::findOrFail($testId);
            $test->update([
                'name' => $request->name,
                'description' => $request->description,
                'category' => $request->category,
                'code' => $request->code,
                'turn_around_time' => $request->turn_around_time,
                'specimen_requirements' => $request->specimen_requirements,
                'preparation_instructions' => $request->preparation_instructions,
                'price' => $request->price,
                'fasting_required' => $request->fasting_required,
                'fasting_duration' => $request->fasting_duration
            ]);

            // Delete existing parameters
            TestParameter::where('test_id', $testId)->delete();

            // Create new parameters
            foreach ($request->parameters as $param) {
                TestParameter::create([
                    'test_id' => $test->id,
                    'parameter_name' => $param['parameter_name'],
                    'unit' => $param['unit'],
                    'normal_range' => $param['normal_range'],
                    'description' => $param['description'] ?? null,
                    'reference_ranges' => $param['reference_ranges'] ?? null,
                    'critical_low' => $param['critical_low'] ?? null,
                    'critical_high' => $param['critical_high'] ?? null,
                    'interpretation_guide' => $param['interpretation_guide'] ?? null,
                    'method' => $param['method'] ?? null,
                    'instrument' => $param['instrument'] ?? null
                ]);
            }

            DB::commit();

            return response()->json(
                Test::with('parameters')->findOrFail($testId)
            );
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update test template',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function deleteTestTemplate($testId)
    {
        try {
            DB::beginTransaction();
            
            $test = Test::findOrFail($testId);
            
            // Check if the test is already in use
            if ($test->testBookings()->exists()) {
                return response()->json([
                    'message' => 'Cannot delete test template that is in use'
                ], 422);
            }

            // Delete parameters first due to foreign key constraint
            TestParameter::where('test_id', $testId)->delete();
            $test->delete();

            DB::commit();
            
            return response()->json(null, 204);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to delete test template',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $test = Test::with('parameters')->findOrFail($id);
            return response()->json($test);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Test not found'], 404);
        }
    }
}
