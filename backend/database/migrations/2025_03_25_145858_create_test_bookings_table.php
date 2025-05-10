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
        Schema::create('test_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->onDelete('cascade');
            $table->foreignId('lab_technician_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('pathologist_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('doctor_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('test_id')->nullable()->constrained('tests')->onDelete('cascade');
            $table->string('status')->default('booked'); // booked, sample_collected, processing, reviewed, completed, cancelled
            $table->text('notes')->nullable();
            $table->timestamp('sample_collection_time')->nullable();
            $table->timestamp('processing_time')->nullable();
            $table->timestamp('review_time')->nullable();
            $table->timestamp('completion_time')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('test_bookings');
    }
};
