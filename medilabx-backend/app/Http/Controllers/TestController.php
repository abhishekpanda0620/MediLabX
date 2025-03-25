<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;


class TestController extends Controller
{
    public function getTestTemplate($testId)
    {
        $test = Test::with('parameters')->findOrFail($testId);
        
        return response()->json([
            'test_id' => $test->id,
            'test_name' => $test->name,
            'parameters' => $test->parameters->map(function ($param) {
                return [
                    'parameter_id' => $param->id,
                    'parameter_name' => $param->parameter_name,
                    'unit' => $param->unit,
                    'normal_range' => $param->normal_range,
                    'value' => null // User will input this
                ];
            })
        ]);
    }
}
