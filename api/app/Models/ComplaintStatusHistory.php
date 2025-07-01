<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ComplaintStatusHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'complaint_id',
        'status',
        'notes',
        'user_id'
    ];

    /**
     * Get the complaint that owns the status history.
     */
    public function complaint()
    {
        return $this->belongsTo(Complaint::class);
    }

    /**
     * Get the user that created the status history.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
