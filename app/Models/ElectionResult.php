<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ElectionResult extends Model
{
    protected $fillable = [
        'election_id',
        'candidate_id',
        'total_votes',
        'percentage',
        'rank',
        'breakdown',
        'calculated_at',
        'calculated_by'
    ];

    protected $casts = [
        'breakdown' => 'array',
        'calculated_at' => 'datetime'
    ];

    public function election()
    {
        return $this->belongsTo(Election::class);
    }

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }
}
