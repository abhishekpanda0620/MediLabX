<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Exception;

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

    /**
     * Relationship to the test booking
     */
    public function testBooking()
    {
        return $this->belongsTo(TestBooking::class);
    }

    /**
     * Get the lab technician who submitted this report
     */
    public function labTechnician()
    {
        return $this->belongsTo(User::class, 'lab_technician_id');
    }

    /**
     * Get the verified lab technician (ensuring they have the correct role)
     */
    public function verifiedLabTechnician()
    {
        return $this->belongsTo(User::class, 'lab_technician_id')
            ->whereHas('roles', function($query) {
                $query->where('name', 'lab_technician');
            });
    }

    /**
     * Get the pathologist who reviewed this report
     */
    public function pathologist()
    {
        return $this->belongsTo(User::class, 'pathologist_id');
    }

    /**
     * Get the verified pathologist (ensuring they have the correct role)
     */
    public function verifiedPathologist()
    {
        return $this->belongsTo(User::class, 'pathologist_id')
            ->whereHas('roles', function($query) {
                $query->where('name', 'pathologist');
            });
    }

    /**
     * Check if a user has lab technician role
     */
    protected function validateLabTechnician($userId)
    {
        $user = User::find($userId);
        
        if (!$user) {
            throw new Exception('User not found');
        }
        
        if (!$user->hasRole('lab_technician')) {
            throw new Exception('User is not authorized as a lab technician');
        }
        
        return true;
    }
    
    /**
     * Check if a user has pathologist role
     */
    protected function validatePathologist($userId)
    {
        $user = User::find($userId);
        
        if (!$user) {
            throw new Exception('User not found');
        }
        
        if (!$user->hasRole('pathologist')) {
            throw new Exception('User is not authorized as a pathologist');
        }
        
        return true;
    }

    /**
     * Submit a report by a lab technician
     */
    public function submit($labTechnicianId, $testResults, $notes = null)
    {
        if ($this->status !== self::STATUS_DRAFT) {
            throw new Exception('Report can only be submitted from draft status');
        }

        // Validate that the user is actually a lab technician
        $this->validateLabTechnician($labTechnicianId);
        
        $this->update([
            'status' => self::STATUS_SUBMITTED,
            'lab_technician_id' => $labTechnicianId,
            'test_results' => $testResults,
            'technician_notes' => $notes,
            'submitted_at' => now()
        ]);
    }

    /**
     * Review a report by a pathologist
     */
    public function review($pathologistId, $notes = null, $conclusion = null)
    {
        if ($this->status !== self::STATUS_SUBMITTED) {
            throw new Exception('Report can only be reviewed when submitted');
        }

        // Validate that the user is actually a pathologist
        $this->validatePathologist($pathologistId);
        
        $this->update([
            'status' => self::STATUS_REVIEWED,
            'pathologist_id' => $pathologistId,
            'pathologist_notes' => $notes,
            'conclusion' => $conclusion,
            'reviewed_at' => now()
        ]);
    }

    /**
     * Validate a report by a pathologist
     */
    public function validate($pathologistId)
    {
        if ($this->status !== self::STATUS_REVIEWED) {
            throw new Exception('Report can only be validated after review');
        }

        // Validate that the user is actually a pathologist
        $this->validatePathologist($pathologistId);
        
        // Additional check to ensure the same pathologist who reviewed is validating
        if ($this->pathologist_id != $pathologistId) {
            throw new Exception('Report must be validated by the same pathologist who reviewed it');
        }
        
        $this->update([
            'status' => self::STATUS_VALIDATED,
            'validated_at' => now()
        ]);
    }

    /**
     * Reject a report by a pathologist
     */
    public function reject($pathologistId, $notes)
    {
        if (!in_array($this->status, [self::STATUS_SUBMITTED, self::STATUS_REVIEWED])) {
            throw new Exception('Only submitted or reviewed reports can be rejected');
        }

        // Validate that the user is actually a pathologist
        $this->validatePathologist($pathologistId);
        
        $this->update([
            'status' => self::STATUS_REJECTED,
            'pathologist_id' => $pathologistId,
            'pathologist_notes' => $notes
        ]);
    }

    /**
     * Determine if this report has valid workflow participants
     */
    public function hasValidParticipants()
    {
        if ($this->lab_technician_id && !$this->verifiedLabTechnician()->exists()) {
            return false;
        }
        
        if ($this->pathologist_id && !$this->verifiedPathologist()->exists()) {
            return false;
        }
        
        return true;
    }
}