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
            $table->foreignId('test_package_id')->nullable()->after('test_id')->constrained()->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('test_bookings', function (Blueprint $table) {
            $table->dropForeign(['test_package_id']);
            $table->dropColumn('test_package_id');
        });
    }
};
