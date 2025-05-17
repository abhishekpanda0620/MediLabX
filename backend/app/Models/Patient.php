<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Patient extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'date_of_birth',
        'gender',
        'address',
        'medical_history',
        'is_active',
        'blood_group',
        'emergency_contact',
        'profile_image'
    ];

    /**
     * Get the user associated with the patient
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get test bookings for the patient
     */
    public function testBookings()
    {
        return $this->hasMany(TestBooking::class);
    }
}
