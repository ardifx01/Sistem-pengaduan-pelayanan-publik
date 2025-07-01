<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'category',
        'required_documents',
        'is_active'
    ];

    protected function casts(): array
    {
        return [
            'required_documents' => 'array',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the complaints for the service.
     */
    public function complaints()
    {
        return $this->hasMany(Complaint::class);
    }

    /**
     * Scope a query to only include active services.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
