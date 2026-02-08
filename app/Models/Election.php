<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Election extends Model
{
    use HasFactory;


    protected $fillable = [
        'title',
        'slug',
        'description',
        'start_date',
        'end_date',
        'status',
        'is_public',
        'created_by'
    ];
    
    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'is_public' => 'boolean',
    ];

    public function candidates()
    {
        return $this->hasMany(Candidate::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function totalVotes()
    {
        return $this->hasMany(Vote::class)->count();
    }

    public function isActive()
    {
        return $this->status === 'active' && 
               now()->between($this->start_date, $this->end_date);
    }

    public function isClosed()
    {
        return $this->status === 'closed' || now()->greaterThan($this->end_date);
    }
}
