<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ComplaintDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'complaint_id',
        'document_name',
        'document_type',
        'file_path',
        'file_size'
    ];

    /**
     * Get the complaint that owns the document.
     */
    public function complaint()
    {
        return $this->belongsTo(Complaint::class);
    }
}
