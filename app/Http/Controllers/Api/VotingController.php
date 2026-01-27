<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Election;
use App\Models\Candidate;
use App\Models\Vote;
use Illuminate\Http\Request;

class VotingController extends Controller
{
    // GET /api/elections
    public function elections()
    {
        return Election::with('candidates')->latest()->get();
    }

    // POST /api/elections (Admin)
    public function createElection(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|min:3',
        ]);

        return Election::create($data);
    }

    // POST /api/elections/{election}/candidates (Admin)
    public function addCandidate(Request $request, Election $election)
    {
        $data = $request->validate([
            'name' => 'required|string|min:2',
            'party' => 'nullable|string',
        ]);

        return $election->candidates()->create($data);
    }

    // PATCH /api/elections/{election}/status (Admin)
    public function changeStatus(Request $request, Election $election)
    {
        $data = $request->validate([
            'status' => 'required|in:open,closed',
        ]);

        $election->update($data);
        return $election;
    }

    // POST /api/elections/{election}/vote (Voter)
    public function vote(Request $request, Election $election)
    {
        // Check election status
        if ($election->status !== 'open') {
            return response()->json(['message' => 'Election is closed'], 403);
        }

        // Validate input
        $data = $request->validate([
            'voter_id' => 'required|string|min:2',
            'candidate_id' => 'required|exists:candidates,id',
        ]);

        // Check candidate belongs to this election
        $candidate = Candidate::where('id', $data['candidate_id'])
            ->where('election_id', $election->id)
            ->first();

        if (!$candidate) {
            return response()->json(['message' => 'Invalid candidate'], 422);
        }

        // Prevent duplicate voting
        $alreadyVoted = Vote::where('election_id', $election->id)
            ->where('voter_id', $data['voter_id'])
            ->exists();

        if ($alreadyVoted) {
            return response()->json(['message' => 'You already voted in this election'], 409);
        }

        // Save vote
        Vote::create([
            'election_id' => $election->id,
            'candidate_id' => $candidate->id,
            'voter_id' => $data['voter_id'],
        ]);

        return response()->json(['message' => '✅ Vote submitted successfully']);
    }

    // GET /api/elections/{election}/results
    public function results(Election $election)
    {
        $election->load('candidates');

        $totalVotes = Vote::where('election_id', $election->id)->count();

        $results = $election->candidates->map(function ($candidate) use ($election, $totalVotes) {
            $count = Vote::where('election_id', $election->id)
                ->where('candidate_id', $candidate->id)
                ->count();

            $percent = $totalVotes > 0
                ? round(($count / $totalVotes) * 100, 2)
                : 0;

            return [
                'candidate_id' => $candidate->id,
                'name' => $candidate->name,
                'party' => $candidate->party,
                'votes' => $count,
                'percent' => $percent,
            ];
        })->sortByDesc('votes')->values();

        return response()->json([
            'election_id' => $election->id,
            'title' => $election->title,
            'status' => $election->status,
            'total_votes' => $totalVotes,
            'results' => $results,
            'winner' => $results->first(),
        ]);
    }

    // DELETE /api/elections/{election} (Admin)
    public function deleteElection(Election $election)
    {
        $election->delete();
        return response()->json(['message' => 'Election deleted successfully']);
    }

    // DELETE /api/candidates/{candidate} (Admin)
    public function deleteCandidate(Candidate $candidate)
    {
        $candidate->delete();
        return response()->json(['message' => 'Candidate deleted successfully']);
    }
}
