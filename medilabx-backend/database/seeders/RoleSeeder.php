<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run()
    {
        // Create roles
        $adminRole = Role::create(['name' => 'admin']);
        $patientRole = Role::create(['name' => 'patient']);
        $labTechRole = Role::create(['name' => 'lab_technician']);
        $pathologistRole = Role::create(['name' => 'pathologist']);
        $doctorRole = Role::create(['name' => 'doctor']);

        // Define permissions
        $permissions = [
            // Admin permissions
            'manage users', 'manage roles', 'view all reports', 'delete any record',

            // Patient permissions
            'book test', 'view own reports',

            // Lab Technician permissions
            'collect sample', 'update test status',

            // Pathologist permissions
            'review test', 'upload report',

            // Doctor permissions
            'view patient reports', 'add medical advice'
        ];

        // Assign permissions
        foreach ($permissions as $perm) {
            $permission = Permission::create(['name' => $perm]);

            if (in_array($perm, ['manage users', 'manage roles', 'view all reports', 'delete any record'])) {
                $adminRole->givePermissionTo($permission);
            }

            if (in_array($perm, ['book test', 'view own reports'])) {
                $patientRole->givePermissionTo($permission);
            }

            if (in_array($perm, ['collect sample', 'update test status'])) {
                $labTechRole->givePermissionTo($permission);
            }

            if (in_array($perm, ['review test', 'upload report'])) {
                $pathologistRole->givePermissionTo($permission);
            }

            if (in_array($perm, ['view patient reports', 'add medical advice'])) {
                $doctorRole->givePermissionTo($permission);
            }
        }
    }
}
