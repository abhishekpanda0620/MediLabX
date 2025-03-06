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
        $userRole = Role::create(['name' => 'user']);

        // Create permissions (example)
        $permissions = ['create record', 'edit record', 'delete record'];

        foreach ($permissions as $perm) {
            $permission = Permission::create(['name' => $perm]);
            $adminRole->givePermissionTo($permission);
            $permission->assignRole($adminRole);
        }
    }
}
