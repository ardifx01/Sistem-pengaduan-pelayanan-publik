<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Complaint extends Model
{
    use HasFactory;

    protected $fillable = [
        'registration_number',
        'user_id',
        'service_id',
        'applicant_name',
        'applicant_nik',
        'applicant_address',
        'applicant_phone',
        'applicant_job',
        'applicant_birth_date',
        'description',
        'status',
        'notes',
        'result_document'
    ];

    protected function casts(): array
    {
        return [
            'applicant_birth_date' => 'date',
        ];
    }

    /**
     * Get the user that owns the complaint.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the service that owns the complaint.
     */
    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    /**
     * Get the documents for the complaint.
     */
    public function documents()
    {
        return $this->hasMany(ComplaintDocument::class);
    }

    /**
     * Get the status histories for the complaint.
     */
    public function statusHistories()
    {
        return $this->hasMany(ComplaintStatusHistory::class)->orderBy('created_at', 'desc');
    }

    /**
     * Generate registration number.
     */
    public static function generateRegistrationNumber()
    {
        $prefix = 'REG-' . date('Ymd') . '-';
        $lastComplaint = self::where('registration_number', 'like', $prefix . '%')
            ->orderBy('registration_number', 'desc')
            ->first();

        if ($lastComplaint) {
            $lastNumber = (int) substr($lastComplaint->registration_number, -4);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return $prefix . str_pad($newNumber, 4, '0', STR_PAD_LEFT);
    }
}
