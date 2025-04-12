<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('test_bookings', function (Blueprint $table) {
            // Drop existing foreign keys
            $table->dropForeign(['patient_id']);
            $table->dropForeign(['doctor_id']);
            $table->dropForeign(['lab_technician_id']);
            $table->dropForeign(['pathologist_id']);
            
            // Add new foreign keys referencing the users table
            $table->foreign('patient_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('doctor_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('lab_technician_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('pathologist_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('test_bookings', function (Blueprint $table) {
            // Drop new foreign keys
            $table->dropForeign(['patient_id']);
            $table->dropForeign(['doctor_id']);
            $table->dropForeign(['lab_technician_id']);
            $table->dropForeign(['pathologist_id']);
            
            // Restore original foreign keys
            $table->foreign('patient_id')->references('id')->on('patients')->onDelete('cascade');
            $table->foreign('doctor_id')->references('id')->on('doctors')->onDelete('set null');
            $table->foreign('lab_technician_id')->references('id')->on('lab_technicians')->onDelete('set null');
            $table->foreign('pathologist_id')->references('id')->on('pathologists')->onDelete('set null');
        });
    }
};
