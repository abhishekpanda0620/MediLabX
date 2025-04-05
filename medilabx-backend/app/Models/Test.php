<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Test extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'name',
        'description',
        'category',
        'code',
        'turn_around_time',
        'specimen_requirements',
        'preparation_instructions',
        'price',
        'fasting_required',
        'fasting_duration'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'fasting_required' => 'boolean',
        'turn_around_time' => 'integer',
        'fasting_duration' => 'integer'
    ];

    protected $appends = [
        'formatted_price',
        'formatted_turn_around_time',
        'fasting_instructions'
    ];

    public function parameters()
    {
        return $this->hasMany(TestParameter::class);
    }

    public function testBookings()
    {
        return $this->hasMany(TestBooking::class);
    }

    public function getFormattedPriceAttribute()
    {
        if (!$this->price) return null;
        return '$' . number_format($this->price, 2);
    }

    public function getFormattedTurnAroundTimeAttribute()
    {
        if (!$this->turn_around_time) return null;
        
        if ($this->turn_around_time < 24) {
            return $this->turn_around_time . ' hours';
        }
        
        $days = floor($this->turn_around_time / 24);
        $hours = $this->turn_around_time % 24;
        
        $result = $days . ' day' . ($days > 1 ? 's' : '');
        if ($hours > 0) {
            $result .= ' and ' . $hours . ' hour' . ($hours > 1 ? 's' : '');
        }
        
        return $result;
    }

    public function getFastingInstructionsAttribute()
    {
        if (!$this->fasting_required) return 'No fasting required';
        
        $hours = $this->fasting_duration;
        return "Fasting required for {$hours} hour" . ($hours > 1 ? 's' : '') . " before the test";
    }

    public function getCategoryColorAttribute()
    {
        $colors = [
            'Hematology' => 'red',
            'Biochemistry' => 'blue',
            'Microbiology' => 'green',
            'Immunology' => 'yellow',
            'Endocrinology' => 'purple',
            'Serology' => 'pink',
            'Urinalysis' => 'orange',
            'Imaging' => 'indigo'
        ];

        return $colors[$this->category] ?? 'gray';
    }

    public function getFullDetailsAttribute()
    {
        $details = [];
        
        if ($this->specimen_requirements) {
            $details[] = ['label' => 'Specimen', 'value' => $this->specimen_requirements];
        }
        
        if ($this->turn_around_time) {
            $details[] = ['label' => 'Results Time', 'value' => $this->formatted_turn_around_time];
        }
        
        if ($this->fasting_required) {
            $details[] = ['label' => 'Fasting', 'value' => $this->fasting_instructions];
        }
        
        if ($this->price) {
            $details[] = ['label' => 'Price', 'value' => $this->formatted_price];
        }

        return $details;
    }
}
