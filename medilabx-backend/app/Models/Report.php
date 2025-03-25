<?php
class Report extends Model
{
    use HasFactory;

    protected $fillable = ['patient_id', 'pathologist_id', 'test_type', 'file_path'];

    public function patient() {
        return $this->belongsTo(Patient::class);
    }

    public function pathologist() {
        return $this->belongsTo(Pathologist::class);
    }
}
