<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run()
    {
        $defaultUsers = [
            'admin' => [
                'name' => 'Admin User',
                'email' => 'admin@example.com',
            ],
            'doctor' => [
                'name' => 'Doctor User',
                'email' => 'doctor@example.com',
            ],
            'lab_technician' => [
                'name' => 'Lab Technician User',
                'email' => 'lab_technician@example.com',
            ],
            'pathologist' => [
                'name' => 'Pathologist User',
                'email' => 'pathologist@example.com',
            ],
            'patient' => [
                'name' => 'Patient User',
                'email' => 'patient@example.com',
            ]
        ];

        foreach ($defaultUsers as $role => $userData) {
            $user = User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => bcrypt('password'),
            ]);

            $user->assignRole($role);
        }
    }
}
