<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TestBooking extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'lab_technician_id',
        'pathologist_id',
        'doctor_id',
        'test_id',
        'test_package_id',
        'status',
        'notes',
        'sample_collection_time',
        'processing_time',
        'review_time',
        'completion_time',
        'delivery_method'

    ];

    protected $dates = [
        'sample_collection_time',
        'processing_time',
        'review_time',
        'completion_time'
    ];

    const STATUS_BOOKED = 'booked';
    const STATUS_SAMPLE_COLLECTED = 'sample_collected';
    const STATUS_PROCESSING = 'processing';
    const STATUS_REVIEWED = 'reviewed';
    const STATUS_COMPLETED = 'completed';
    const STATUS_CANCELLED = 'cancelled';
    
    const DELIVERY_EMAIL = 'email';
    const DELIVERY_SMS = 'sms';
    const DELIVERY_IN_PERSON = 'in_person';
    
    public function patient() {
        return $this->belongsTo(Patient::class, 'patient_id');
    }

    public function labTechnician() {
        return $this->belongsTo(User::class, 'lab_technician_id');
    }

    public function pathologist() {
        return $this->belongsTo(User::class, 'pathologist_id');
    }

    public function doctor() {
        return $this->belongsTo(Doctor::class, 'doctor_id');
    }

    public function test() {
        return $this->belongsTo(Test::class);
    }
    
    public function testPackage() {
        return $this->belongsTo(TestPackage::class);
    }
    
    /**
     * Get the test reports associated with this booking
     */
    public function reports()
    {
        return $this->hasMany(TestReport::class, 'test_booking_id');
    }
    
    /**
     * Check if this booking has any reports
     * @return bool
     */
    public function hasReport()
    {
        // Count the number of reports, and return true if it's > 0
        $count = $this->reports()->count();
        \Log::info("TestBooking {$this->id} has {$count} reports");
        return $count > 0;
    }

    public function markSampleCollected($labTechnicianId) {
        if ($this->status !== self::STATUS_BOOKED) {
            throw new \Exception('Test booking must be in booked state to collect sample');
        }
        
        // Make sure lab technician exists
        $labTechnician = \App\Models\User::find($labTechnicianId);
        if (!$labTechnician) {
            throw new \Exception('Lab technician not found');
        }
        
        $this->update([
            'status' => self::STATUS_SAMPLE_COLLECTED,
            'lab_technician_id' => $labTechnicianId,
            'sample_collection_time' => now()
        ]);
    }

    public function markProcessing($labTechnicianId) {
        if ($this->status !== self::STATUS_SAMPLE_COLLECTED) {
            throw new \Exception('Sample must be collected before processing');
        }
        $this->update([
            'status' => self::STATUS_PROCESSING,
            'processing_time' => now()
        ]);
    }

    public function markReviewed($userId) {
        if ($this->status !== self::STATUS_PROCESSING) {
            throw new \Exception('Test must be processed before review');
        }
        
        // Get the user
        $user = \App\Models\User::find($userId);
        if (!$user) {
            throw new \Exception('User not found');
        }
        
        // If it's a pathologist, save their ID
        if ($user->hasRole('pathologist')) {
            $this->update([
                'status' => self::STATUS_REVIEWED,
                'pathologist_id' => $userId,
                'review_time' => now()
            ]);
        } else {
            // For lab technicians, just update the status
            $this->update([
                'status' => self::STATUS_REVIEWED,
                'review_time' => now()
            ]);
        }
    }

    public function markCompleted($userId) {
        if ($this->status !== self::STATUS_REVIEWED) {
            throw new \Exception('Test must be reviewed before completion');
        }
        
        // No need to track which user completed it, just update the status
        $this->update([
            'status' => self::STATUS_COMPLETED,
            'completion_time' => now()
        ]);
    }

    public function cancel($notes = null) {
        if (in_array($this->status, [self::STATUS_COMPLETED, self::STATUS_CANCELLED])) {
            throw new \Exception('Cannot cancel completed or already cancelled test');
        }
        $this->update([
            'status' => self::STATUS_CANCELLED,
            'notes' => $notes
        ]);
    }
}
