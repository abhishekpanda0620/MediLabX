<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class PatientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create some patients with associated user accounts
        $patientData = [
            [
                'name' => 'John Doe',
                'email' => 'john.doe@example.com',
                'phone' => '123-456-7890',
                'date_of_birth' => '1985-05-15',
                'gender' => 'male',
                'address' => '123 Main St, Anytown, CA',
                'medical_history' => 'No significant medical history',
                'blood_group' => 'O+',
                'emergency_contact' => '555-123-4567'
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane.smith@example.com',
                'phone' => '987-654-3210',
                'date_of_birth' => '1990-10-20',
                'gender' => 'female',
                'address' => '456 Oak Ave, Somewhere, NY',
                'medical_history' => 'Allergic to penicillin',
                'blood_group' => 'A-',
                'emergency_contact' => '555-987-6543'
            ],
            [
                'name' => 'Maria Garcia',
                'email' => 'maria.garcia@example.com',
                'phone' => '321-654-0987',
                'date_of_birth' => '1978-03-12',
                'gender' => 'female',
                'address' => '789 Pine Rd, Elsewhere, TX',
                'medical_history' => 'Type 2 diabetes',
                'blood_group' => 'B+',
                'emergency_contact' => '555-654-7890'
            ]
        ];

        foreach ($patientData as $data) {
            // Create user first
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make('password123'),
            ]);
            
            // Assign patient role
            $user->assignRole('patient');
            
            // Create patient record
            Patient::create([
                'user_id' => $user->id,
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'date_of_birth' => $data['date_of_birth'],
                'gender' => $data['gender'],
                'address' => $data['address'],
                'medical_history' => $data['medical_history'],
                'blood_group' => $data['blood_group'],
                'emergency_contact' => $data['emergency_contact'],
                'is_active' => true
            ]);
        }
    }
}
