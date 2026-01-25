<?php

namespace App\Models;

use Iluminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vote extends Model
{
    use HasFactory;


    protected $fillable = ['election_id', 'candidate_id', 'voter_id'];
}
