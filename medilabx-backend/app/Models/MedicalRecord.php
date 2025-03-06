<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MedicalRecord extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'patient_id',
        'doctor_id',
        'record_details', // e.g., diagnosis, treatment info
        'record_date',
    ];
}
