<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TestParameter extends Model
{
    protected $fillable = ['parameter_name', 'unit', 'normal_range'];

    public function test()
    {
        return $this->belongsTo(Test::class);
    }
}
