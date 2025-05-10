<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TestParameter extends Model
{
    use HasFactory;

    protected $fillable = [
        'test_id',
        'parameter_name',
        'unit',
        'normal_range',
        'description',
        'reference_ranges',
        'critical_low',
        'critical_high',
        'interpretation_guide',
        'method',
        'instrument'
    ];

    protected $casts = [
        'reference_ranges' => 'array'
    ];

    protected $appends = [
        'formatted_range',
        'has_critical_values'
    ];

    public function test()
    {
        return $this->belongsTo(Test::class);
    }

    public function getFormattedRangeAttribute()
    {
        return "{$this->normal_range} {$this->unit}";
    }

    public function getHasCriticalValuesAttribute()
    {
        return !is_null($this->critical_low) || !is_null($this->critical_high);
    }

    public function getReferenceRangeByAge($age, $gender = null)
    {
        if (!$this->reference_ranges) {
            return $this->normal_range;
        }

        foreach ($this->reference_ranges as $range) {
            $matches = true;
            
            if (isset($range['min_age']) && $age < $range['min_age']) {
                $matches = false;
            }
            
            if (isset($range['max_age']) && $age > $range['max_age']) {
                $matches = false;
            }
            
            if ($gender && isset($range['gender']) && strtolower($gender) !== strtolower($range['gender'])) {
                $matches = false;
            }
            
            if ($matches) {
                return $range['range'];
            }
        }

        return $this->normal_range;
    }

    public function checkValue($value)
    {
        if (!is_numeric($value)) {
            return [
                'status' => 'invalid',
                'message' => 'Value must be numeric'
            ];
        }

        $value = floatval($value);
        
        // Check critical values first
        if ($this->critical_low && $value < floatval($this->critical_low)) {
            return [
                'status' => 'critical-low',
                'message' => 'Value is critically low'
            ];
        }
        
        if ($this->critical_high && $value > floatval($this->critical_high)) {
            return [
                'status' => 'critical-high',
                'message' => 'Value is critically high'
            ];
        }

        // Parse normal range
        $range = $this->normal_range;
        if (strpos($range, '-') !== false) {
            list($min, $max) = array_map('trim', explode('-', $range));
            if ($value < floatval($min)) {
                return [
                    'status' => 'low',
                    'message' => 'Value is below normal range'
                ];
            }
            if ($value > floatval($max)) {
                return [
                    'status' => 'high',
                    'message' => 'Value is above normal range'
                ];
            }
        } elseif (strpos($range, '<') !== false) {
            $max = floatval(trim(str_replace('<', '', $range)));
            if ($value > $max) {
                return [
                    'status' => 'high',
                    'message' => 'Value is above normal range'
                ];
            }
        } elseif (strpos($range, '>') !== false) {
            $min = floatval(trim(str_replace('>', '', $range)));
            if ($value < $min) {
                return [
                    'status' => 'low',
                    'message' => 'Value is below normal range'
                ];
            }
        }

        return [
            'status' => 'normal',
            'message' => 'Value is within normal range'
        ];
    }

    public function getValueColor($value)
    {
        $result = $this->checkValue($value);
        
        $colors = [
            'normal' => 'green',
            'low' => 'yellow',
            'high' => 'yellow',
            'critical-low' => 'red',
            'critical-high' => 'red',
            'invalid' => 'gray'
        ];

        return $colors[$result['status']] ?? 'gray';
    }
}
