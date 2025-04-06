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
        Schema::create('tests', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Test name (e.g., Blood Test)
            $table->text('description')->nullable();
            $table->string('category'); // e.g., Blood Test, Urine Test, Imaging
            $table->string('code')->unique()->nullable(); // Test code/identifier
            $table->integer('turn_around_time')->nullable(); // Expected time in hours
            $table->text('specimen_requirements')->nullable(); // Required specimen details
            $table->text('preparation_instructions')->nullable(); // Patient preparation instructions
            $table->decimal('price', 10, 2)->nullable(); // Test price
            $table->boolean('fasting_required')->default(false);
            $table->integer('fasting_duration')->nullable(); // Fasting hours if required
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tests');
    }
};
