<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Doctor;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DoctorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create some doctors with associated user accounts
        $doctorData = [
            [
                'name' => 'Dr. Sarah Johnson',
                'email' => 'sarah.johnson@example.com',
                'phone' => '555-123-4567',
                'specialization' => 'Cardiology',
                'qualification' => 'MD, PhD',
                'bio' => 'Dr. Johnson is a board-certified cardiologist with over 15 years of experience.',
                'license_number' => 'MD12345678'
            ],
            [
                'name' => 'Dr. Michael Brown',
                'email' => 'michael.brown@example.com',
                'phone' => '555-987-6543',
                'specialization' => 'Neurology',
                'qualification' => 'MD',
                'bio' => 'Dr. Brown specializes in neurological disorders and headache treatments.',
                'license_number' => 'MD98765432'
            ],
            [
                'name' => 'Dr. Emily Chen',
                'email' => 'emily.chen@example.com',
                'phone' => '555-234-5678',
                'specialization' => 'Pediatrics',
                'qualification' => 'MD, FAAP',
                'bio' => 'Dr. Chen has dedicated her career to pediatric medicine with a focus on childhood development.',
                'license_number' => 'MD45678901'
            ]
        ];

        foreach ($doctorData as $data) {
            // Create user first
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make('password123'),
            ]);
            
            // Assign doctor role
            $user->assignRole('doctor');
            
            // Create doctor record
            Doctor::create([
                'user_id' => $user->id,
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'specialization' => $data['specialization'],
                'qualification' => $data['qualification'],
                'bio' => $data['bio'],
                'license_number' => $data['license_number'],
                'is_active' => true
            ]);
        }
    }
}
