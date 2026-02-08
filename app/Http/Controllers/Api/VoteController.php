<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vote;
use App\Models\Election;
use App\Models\Candidate;
use App\Models\ElectionResult;
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
        // Assuming all verified users are eligible for public elections
        $totalEligibleVoters = \App\Models\User::where('is_verified', true)->count();

        $results = $results->map(function($item) use ($totalVotes) {
            $item->percentage = $totalVotes > 0 ? round(($item->votes / $totalVotes) * 100, 2) : 0;
            return $item;
        });

        return response()->json([
            'election' => $election,
            'results' => $results,
            'total_votes' => $totalVotes,
            'total_eligible_voters' => $totalEligibleVoters
        ]);
    }
    public function finalizeResults(Election $election)
    {
        // Check if user is admin (security middleware should catch this, but extra guard)
        if (auth()->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Calculate current results
        $results = Vote::select('candidate_id', DB::raw('count(*) as votes'))
                      ->where('election_id', $election->id)
                      ->groupBy('candidate_id')
                      ->orderBy('votes', 'desc')
                      ->get();

        $totalVotes = $election->totalVotes();
        $user = auth()->user();

        DB::beginTransaction();
        try {
            // Delete existing results for this election to allow re-finalization
            ElectionResult::where('election_id', $election->id)->delete();

            $rank = 1;
            foreach ($results as $row) {
                ElectionResult::create([
                    'election_id' => $election->id,
                    'candidate_id' => $row->candidate_id,
                    'total_votes' => $row->votes,
                    'percentage' => $totalVotes > 0 ? round(($row->votes / $totalVotes) * 100, 2) : 0,
                    'rank' => $rank++,
                    'calculated_at' => now(),
                    'calculated_by' => $user->id
                ]);
            }

            DB::commit();
            return response()->json(['message' => 'Results finalized successfully and recorded in the database.']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Finalization failed: ' . $e->getMessage()], 500);
        }
    }
}
