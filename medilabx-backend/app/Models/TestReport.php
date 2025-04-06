<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TestReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'test_booking_id',
        'lab_technician_id',
        'pathologist_id',
        'status',
        'test_results',
        'technician_notes',
        'pathologist_notes',
        'conclusion',
        'submitted_at',
        'reviewed_at',
        'validated_at'
    ];

    protected $casts = [
        'test_results' => 'array',
        'submitted_at' => 'datetime',
        'reviewed_at' => 'datetime',
        'validated_at' => 'datetime'
    ];

    const STATUS_DRAFT = 'draft';
    const STATUS_SUBMITTED = 'submitted';
    const STATUS_REVIEWED = 'reviewed';
    const STATUS_VALIDATED = 'validated';
    const STATUS_REJECTED = 'rejected';

    public function testBooking()
    {
        return $this->belongsTo(TestBooking::class);
    }

    public function labTechnician()
    {
        return $this->belongsTo(LabTechnician::class);
    }

    public function pathologist()
    {
        return $this->belongsTo(Pathologist::class);
    }

    public function submit($labTechnicianId, $testResults, $notes = null)
    {
        if ($this->status !== self::STATUS_DRAFT) {
            throw new \Exception('Report can only be submitted from draft status');
        }

        $this->update([
            'status' => self::STATUS_SUBMITTED,
            'lab_technician_id' => $labTechnicianId,
            'test_results' => $testResults,
            'technician_notes' => $notes,
            'submitted_at' => now()
        ]);
    }

    public function review($pathologistId, $notes = null, $conclusion = null)
    {
        if ($this->status !== self::STATUS_SUBMITTED) {
            throw new \Exception('Report can only be reviewed when submitted');
        }

        $this->update([
            'status' => self::STATUS_REVIEWED,
            'pathologist_id' => $pathologistId,
            'pathologist_notes' => $notes,
            'conclusion' => $conclusion,
            'reviewed_at' => now()
        ]);
    }

    public function validate($pathologistId)
    {
        if ($this->status !== self::STATUS_REVIEWED) {
            throw new \Exception('Report can only be validated after review');
        }

        $this->update([
            'status' => self::STATUS_VALIDATED,
            'validated_at' => now()
        ]);
    }

    public function reject($pathologistId, $notes)
    {
        if (!in_array($this->status, [self::STATUS_SUBMITTED, self::STATUS_REVIEWED])) {
            throw new \Exception('Only submitted or reviewed reports can be rejected');
        }

        $this->update([
            'status' => self::STATUS_REJECTED,
            'pathologist_id' => $pathologistId,
            'pathologist_notes' => $notes
        ]);
    }
}