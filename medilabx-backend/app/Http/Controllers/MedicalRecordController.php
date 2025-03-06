<?php

namespace App\Http\Controllers;

use App\Models\MedicalRecord;
use Illuminate\Http\Request;

class MedicalRecordController extends Controller
{
    // GET /medical-records
    public function index()
    {
        return MedicalRecord::all();
    }

    // GET /medical-records/{id}
    public function show($id)
    {
        return MedicalRecord::findOrFail($id);
    }

    // POST /medical-records
    public function store(Request $request)
    {
        $record = MedicalRecord::create($request->all());
        return response()->json($record, 201);
    }

    // PUT /medical-records/{id}
    public function update(Request $request, $id)
    {
        $record = MedicalRecord::findOrFail($id);
        $record->update($request->all());
        return response()->json($record, 200);
    }

    // DELETE /medical-records/{id}
    public function destroy($id)
    {
        MedicalRecord::findOrFail($id)->delete();
        return response()->json(null, 204);
    }
}
