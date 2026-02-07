<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Election;
use App\Models\Candidate;
use Illuminate\Http\Request;

class ElectionController extends Controller
{
    public function index()
    {
        $elections = Election::where('is_public', true)
                           ->where('status', 'active')
                           ->with('candidates')
                           ->get();

        return response()->json($elections);
    }

    public function show(Election $election)
    {
        if (!$election->is_public) {
            return response()->json(['message' => 'Election not found'], 404);
        }

        $election->load('candidates');
        return response()->json($election);
    }

    public function candidates(Election $election)
    {
        $candidates = $election->candidates()->get();
        return response()->json($candidates);
    }
}
