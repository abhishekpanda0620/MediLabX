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
        Schema::table('test_reports', function (Blueprint $table) {
            // Drop existing foreign keys
            $table->dropForeign(['lab_technician_id']);
            $table->dropForeign(['pathologist_id']);
            
            // Add new foreign keys referencing the users table
            $table->foreign('lab_technician_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('pathologist_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('test_reports', function (Blueprint $table) {
            // Drop new foreign keys
            $table->dropForeign(['lab_technician_id']);
            $table->dropForeign(['pathologist_id']);
            
            // Restore original foreign keys
            $table->foreign('lab_technician_id')->references('id')->on('lab_technicians')->onDelete('set null');
            $table->foreign('pathologist_id')->references('id')->on('pathologists')->onDelete('set null');
        });
    }
};
