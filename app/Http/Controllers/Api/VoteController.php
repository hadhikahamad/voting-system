<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vote;
use App\Models\Election;
use App\Models\Candidate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VoteController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'election_id' => 'required|exists:elections,id',
            'candidate_id' => 'required|exists:candidates,id',
        ]);

        $user = $request->user();
        $election = Election::find($request->election_id);

        // Check if user can vote
        if (!$user->canVote()) {
            return response()->json(['message' => 'You are not eligible to vote'], 403);
        }

        // Check if election is active
        if (!$election->isActive()) {
            return response()->json(['message' => 'Election is not active'], 400);
        }

        // Check if user already voted
        $existingVote = Vote::where('voter_id', $user->id)
                          ->where('election_id', $request->election_id)
                          ->exists();

        if ($existingVote) {
            return response()->json(['message' => 'You have already voted in this election'], 400);
        }

        // Create vote
        $vote = Vote::create([
            'voter_id' => $user->id,
            'election_id' => $request->election_id,
            'candidate_id' => $request->candidate_id,
            'voted_at' => now(),
        ]);

        return response()->json([
            'message' => 'Vote submitted successfully',
            'vote' => $vote
        ], 201);
    }

    public function myVotes(Request $request)
    {
        $votes = Vote::where('voter_id', $request->user()->id)
                    ->with(['election', 'candidate'])
                    ->latest()
                    ->get();

        return response()->json($votes);
    }

    public function electionResults(Election $election)
    {
        $results = Vote::select('candidate_id', DB::raw('count(*) as votes'))
                      ->where('election_id', $election->id)
                      ->with('candidate')
                      ->groupBy('candidate_id')
                      ->orderBy('votes', 'desc')
                      ->get();

        $totalVotes = $election->totalVotes();

        $results = $results->map(function($item) use ($totalVotes) {
            $item->percentage = $totalVotes > 0 ? round(($item->votes / $totalVotes) * 100, 2) : 0;
            return $item;
        });

        return response()->json([
            'election' => $election,
            'results' => $results,
            'total_votes' => $totalVotes
        ]);
    }
}
