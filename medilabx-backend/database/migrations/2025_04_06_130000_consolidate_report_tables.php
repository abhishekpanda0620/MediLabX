<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Report;
use App\Models\TestReport;
use App\Models\TestBooking;

return new class extends Migration
{
    public function up(): void
    {
        // First transfer any existing data from reports to test_reports
        $oldReports = DB::table('reports')->get();
        
        foreach ($oldReports as $oldReport) {
            // Create a test booking for the old report if it doesn't exist
            $testBooking = TestBooking::firstOrCreate(
                [
                    'patient_id' => $oldReport->patient_id,
                    'pathologist_id' => $oldReport->pathologist_id,
                ],
                [
                    'status' => 'completed',
                    'completion_time' => $oldReport->created_at
                ]
            );

            // Create new test report
            DB::table('test_reports')->insert([
                'test_booking_id' => $testBooking->id,
                'pathologist_id' => $oldReport->pathologist_id,
                'status' => 'validated',
                'test_results' => $oldReport->report_data ?? '[]',
                'conclusion' => 'Migrated from legacy report',
                'validated_at' => $oldReport->created_at,
                'created_at' => $oldReport->created_at,
                'updated_at' => $oldReport->updated_at
            ]);
        }

        // Drop the old reports table
        Schema::dropIfExists('reports');
    }

    public function down(): void
    {
        // Recreate the old reports table
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->onDelete('cascade');
            $table->foreignId('pathologist_id')->nullable()->constrained()->onDelete('set null');
            $table->string('test_type');
            $table->string('file_path');
            $table->json('report_data')->nullable();
            $table->timestamps();
        });
    }
};