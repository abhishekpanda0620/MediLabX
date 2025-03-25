<?php
class TestBooking extends Model
{
    use HasFactory;

    protected $fillable = ['patient_id', 'lab_technician_id', 'test_type', 'status'];

    public function patient() {
        return $this->belongsTo(Patient::class);
    }

    public function labTechnician() {
        return $this->belongsTo(LabTechnician::class);
    }
}
