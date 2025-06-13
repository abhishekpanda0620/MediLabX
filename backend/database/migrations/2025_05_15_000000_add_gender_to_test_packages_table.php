<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('test_packages', function (Blueprint $table) {
            $table->string('gender')->default('both')->after('discount_percentage');
            // possible values: 'male', 'female', 'both'
        });
    }

    public function down(): void
    {
        Schema::table('test_packages', function (Blueprint $table) {
            $table->dropColumn('gender');
        });
    }
};
