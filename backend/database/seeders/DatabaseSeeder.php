<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,       // Seeds roles & permissions
            UserSeeder::class,       // Seeds users with roles
            PatientSeeder::class,    // Seeds patient data
            DoctorSeeder::class,     // Seeds doctor data
            TestSeeder::class,       // Seeds common pathology tests
            TestPackageSeeder::class, // Seeds health test packages
        ]);
    }
}
