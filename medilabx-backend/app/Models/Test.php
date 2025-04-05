<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Test extends Model
{
    use HasFactory;
    
    protected $fillable = ['name', 'description'];

    public function parameters()
    {
        return $this->hasMany(TestParameter::class);
    }

    public function testBookings()
    {
        return $this->hasMany(TestBooking::class);
    }
}
