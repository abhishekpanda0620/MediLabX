<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run()
    {
        // Define roles
        $roles = ['admin', 'doctor', 'lab_technician', 'pathologist', 'patient'];

        foreach ($roles as $roleName) {
            $role = Role::firstOrCreate(['name' => $roleName]);

            // Create a user for each role
            $user = User::create([
                'name' => ucfirst($roleName) . ' User',
                'email' => $roleName . '@example.com',
                'password' => bcrypt('password'), // Default password
            ]);

            $user->assignRole($role);
        }
    }
}
