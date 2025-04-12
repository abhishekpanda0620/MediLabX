<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LabTechnician extends Model
{
    protected $fillable = [
        'name',
        'employee_id',
        'specialty',
        'user_id'
    ];
}
