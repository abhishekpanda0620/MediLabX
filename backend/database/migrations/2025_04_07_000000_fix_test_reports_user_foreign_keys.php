<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('test_reports', function (Blueprint $table) {
            // Drop existing foreign keys using a more compatible method
            $this->dropForeignKeysIfExist($table, ['lab_technician_id', 'pathologist_id']);
            
            // Add the foreign keys with explicit reference to users table
            $table->foreign('lab_technician_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('set null');
                  
            $table->foreign('pathologist_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('test_reports', function (Blueprint $table) {
            // Drop the foreign keys we added
            $this->dropForeignKeysIfExist($table, ['lab_technician_id', 'pathologist_id']);
            
            // We won't re-add foreign keys to non-existent tables in down method
            // as those tables likely don't exist and would cause errors
        });
    }
    
    /**
     * Helper method to drop foreign keys for specific columns
     */
    private function dropForeignKeysIfExist(Blueprint $table, array $columns)
    {
        // Get all the indexes including foreign keys
        $indexes = collect(DB::select("SHOW INDEXES FROM test_reports"))
            ->pluck('Column_name', 'Key_name')
            ->toArray();
        
        // Get all the foreign keys
        $foreignKeys = collect(DB::select("
            SELECT CONSTRAINT_NAME
            FROM information_schema.TABLE_CONSTRAINTS
            WHERE CONSTRAINT_TYPE = 'FOREIGN KEY'
            AND TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = 'test_reports'
        "))->pluck('CONSTRAINT_NAME')->toArray();
        
        // For each column we want to drop
        foreach ($columns as $column) {
            // Look for a foreign key constraint that might be related to this column
            foreach ($foreignKeys as $keyName) {
                // We're using a simple heuristic here - if the key name contains the column name
                if (str_contains(strtolower($keyName), strtolower($column))) {
                    $table->dropForeign($keyName);
                    break;
                }
            }
        }
    }
};
