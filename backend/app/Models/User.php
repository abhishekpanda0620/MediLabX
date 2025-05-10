<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;   // ✅ Correct import
use Laravel\Sanctum\HasApiTokens;        // ✅ Add this line

class User extends Authenticatable
{
    use HasApiTokens,   // ✅ Use Sanctum API tokens
        HasRoles,        // ✅ Use Spatie roles & permissions
        HasFactory, 
        Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
