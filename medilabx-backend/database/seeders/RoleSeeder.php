<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run()
    {
        // Create permissions
        $permissions = [
            // Test management permissions
            'manage_test_catalog',
            'view_test_catalog',
            
            // Test booking permissions
            'create_test_booking',
            'view_test_bookings',
            'cancel_test_booking',
            
            // Sample collection permissions
            'collect_samples',
            'process_samples',
            
            // Report permissions
            'create_test_report',
            'review_test_report',
            'validate_test_report',
            'view_test_reports',
            
            // User management
            'manage_users',
            'manage_roles'
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Define roles and their permissions
        $roles = [
            'admin' => [
                'manage_test_catalog',
                'view_test_catalog',
                'view_test_bookings',
                'manage_users',
                'manage_roles'
            ],
            'doctor' => [
                'view_test_catalog',
                'create_test_booking',
                'view_test_bookings',
                'cancel_test_booking',
                'view_test_reports'
            ],
            'lab_technician' => [
                'view_test_catalog',
                'view_test_bookings',
                'collect_samples',
                'process_samples',
                'create_test_report'
            ],
            'pathologist' => [
                'view_test_catalog',
                'view_test_bookings',
                'review_test_report',
                'validate_test_report',
                'view_test_reports'
            ],
            'patient' => [
                'view_test_catalog',
                'view_test_bookings',
                'view_test_reports'
            ]
        ];

        foreach ($roles as $roleName => $rolePermissions) {
            $role = Role::create(['name' => $roleName]);
            $role->givePermissionTo($rolePermissions);
        }
    }
}
