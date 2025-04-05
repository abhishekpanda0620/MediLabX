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
        Schema::create('test_parameters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('test_id')->constrained()->onDelete('cascade'); 
            $table->string('parameter_name'); // Example: Hemoglobin, WBC Count
            $table->string('unit'); // g/dL, mg/dL
            $table->string('normal_range'); // Example: "13.0 - 17.0"
            $table->text('description')->nullable(); // Description of the parameter
            $table->json('reference_ranges')->nullable(); // Age/gender specific ranges
            $table->string('critical_low')->nullable(); // Critical low value
            $table->string('critical_high')->nullable(); // Critical high value
            $table->text('interpretation_guide')->nullable(); // Guide for interpreting results
            $table->string('method')->nullable(); // Testing method used
            $table->string('instrument')->nullable(); // Equipment/instrument used
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('test_parameters');
    }
};
