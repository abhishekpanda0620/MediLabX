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
        $table->string('delivery_method')->nullable()->after('notes');
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('test_bookings', function (Blueprint $table) {
                    $table->dropColumn('delivery_method');

        });
    }
};
