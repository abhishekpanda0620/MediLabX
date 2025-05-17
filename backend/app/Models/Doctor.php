<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Doctor extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'specialization',
        'qualification',
        'bio',
        'license_number',
        'is_active',
        'profile_image'
    ];

    /**
     * Get the user associated with the doctor
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get test bookings referred by this doctor
     */
    public function referredTests()
    {
        return $this->hasMany(TestBooking::class, 'referring_doctor_id');
    }
}
