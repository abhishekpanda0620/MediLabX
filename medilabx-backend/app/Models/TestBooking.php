<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TestBooking extends Model
{
    use HasFactory;

    protected $fillable = ['patient_id', 'lab_technician_id', 'test_type', 'status', 'test_id'];

    public function patient() {
        return $this->belongsTo(Patient::class);
    }

    public function labTechnician() {
        return $this->belongsTo(LabTechnician::class);
    }

    public function test() {
        return $this->belongsTo(Test::class);
    }
}
