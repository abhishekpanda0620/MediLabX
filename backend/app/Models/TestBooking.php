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
        'completion_time'
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

    public function patient() {
        return $this->belongsTo(User::class, 'patient_id');
    }

    public function labTechnician() {
        return $this->belongsTo(User::class, 'lab_technician_id');
    }

    public function pathologist() {
        return $this->belongsTo(User::class, 'pathologist_id');
    }

    public function doctor() {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function test() {
        return $this->belongsTo(Test::class);
    }
    
    public function testPackage() {
        return $this->belongsTo(TestPackage::class);
    }

    public function markSampleCollected($labTechnicianId) {
        if ($this->status !== self::STATUS_BOOKED) {
            throw new \Exception('Test booking must be in booked state to collect sample');
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

    public function markReviewed($pathologistId) {
        if ($this->status !== self::STATUS_PROCESSING) {
            throw new \Exception('Test must be processed before review');
        }
        $this->update([
            'status' => self::STATUS_REVIEWED,
            'pathologist_id' => $pathologistId,
            'review_time' => now()
        ]);
    }

    public function markCompleted($pathologistId) {
        if ($this->status !== self::STATUS_REVIEWED) {
            throw new \Exception('Test must be reviewed before completion');
        }
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
