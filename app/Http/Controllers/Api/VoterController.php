<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Vote;
use App\Models\Election;
use App\Models\Candidate;

class VoterController extends Controller
{
    public function castVote(Request $request)
    {
        $validated = $request->validate([
            'election_id' => 'required|exists:elections,id',
            'candidate_id' => 'required|exists:candidates,id',
        ]);

        $election = Election::findOrFail($validated['election_id']);
        
        // 0. Check if user is verified
        if (!auth()->user()->is_verified) {
            return response()->json(['message' => 'Your account must be verified by an administrator before you can vote.'], 403);
        }
        
        // 1. Check if election is active
        if ($election->status !== 'active') {
            return response()->json(['message' => 'This election is not currently active.'], 422);
        }

        // 2. Check dates
        $now = now();
        if ($now < $election->start_date || $now > $election->end_date) {
            return response()->json(['message' => 'Voting is not open for this election.'], 422);
        }

        // 3. Check if candidate belongs to election
        $candidate = Candidate::where('id', $validated['candidate_id'])
            ->where('election_id', $election->id)
            ->first();
            
        if (!$candidate) {
            return response()->json(['message' => 'Invalid candidate selected.'], 422);
        }

        // 4. Check if user already voted in this election
        $existingVote = Vote::where('election_id', $election->id)
            ->where('voter_id', auth()->id())
            ->first();

        if ($existingVote) {
            return response()->json(['message' => 'You have already cast your vote in this election.'], 422);
        }

        // 5. Create vote
        Vote::create([
            'election_id' => $election->id,
            'candidate_id' => $candidate->id,
            'voter_id' => auth()->id()
        ]);

        return response()->json([
            'message' => 'Your vote has been cast successfully!',
            'status' => 'success'
        ]);
    }
}
