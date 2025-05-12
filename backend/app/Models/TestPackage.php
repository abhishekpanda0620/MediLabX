<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class TestPackage extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 
        'description', 
        'price',
        'discount_percentage',
        'gender', // Added gender field
        'is_active'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'discount_percentage' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * The tests that belong to the package
     */
    public function tests(): BelongsToMany
    {
        return $this->belongsToMany(Test::class, 'test_package_test')
            ->withTimestamps();
    }

    /**
     * Calculate total regular price of all tests in this package
     */
    public function getTotalRegularPriceAttribute()
    {
        return $this->tests->sum('price');
    }

    /**
     * Calculate savings compared to buying tests individually
     */
    public function getSavingsAttribute()
    {
        $regularPrice = $this->total_regular_price;
        return $regularPrice - $this->price;
    }

    /**
     * Calculate savings percentage
     */
    public function getSavingsPercentageAttribute()
    {
        $regularPrice = $this->total_regular_price;
        if ($regularPrice <= 0) {
            return 0;
        }
        
        return round(($this->savings / $regularPrice) * 100, 2);
    }
}
