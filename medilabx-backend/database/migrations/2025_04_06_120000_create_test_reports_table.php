<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('test_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('test_booking_id')->constrained()->onDelete('cascade');
            $table->foreignId('lab_technician_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('pathologist_id')->nullable()->constrained()->onDelete('set null');
            $table->string('status')->default('draft'); // draft, submitted, reviewed, validated, rejected
            $table->json('test_results');
            $table->text('technician_notes')->nullable();
            $table->text('pathologist_notes')->nullable();
            $table->text('conclusion')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('validated_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('test_reports');
    }
};