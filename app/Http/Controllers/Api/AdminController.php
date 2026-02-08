<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Election;
use App\Models\User;
use App\Models\Vote;
use App\Models\Candidate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminController extends Controller
{
    public function dashboard()
    {
        $stats = [
            'total_users' => User::count(),
            'total_voters' => User::where('role', 'voter')->count(),
            'total_admins' => User::where('role', 'admin')->count(),
            'total_elections' => Election::count(),
            'active_elections' => Election::where('status', 'active')->count(),
            'total_votes' => Vote::count(),
            'pending_verifications' => User::where('is_verified', false)->count(),
        ];

        return response()->json($stats);
    }

    public function elections()
    {
        $elections = Election::with(['creator', 'candidates'])->latest()->get();
        return response()->json($elections);
    }

    public function createElection(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_public' => 'boolean',
        ]);

        $validated['created_by'] = auth()->id();
        
        $baseSlug = \Str::slug($validated['title']);
        $slug = $baseSlug;
        $counter = 1;
        while (Election::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }
        $validated['slug'] = $slug;
        
        $validated['status'] = 'draft';

        $election = Election::create($validated);

        return response()->json([
            'message' => 'Election created successfully',
            'election' => $election
        ], 201);
    }

    public function updateElection(Request $request, Election $election)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'is_public' => 'boolean',
        ]);

        if ($election->title !== $validated['title']) {
            $baseSlug = \Str::slug($validated['title']);
            $slug = $baseSlug;
            $counter = 1;
            while (Election::where('slug', $slug)->where('id', '!=', $election->id)->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }
            $validated['slug'] = $slug;
        }

        $election->update($validated);

        return response()->json([
            'message' => 'Election updated successfully',
            'election' => $election
        ]);
    }

    public function users()
    {
        $users = User::latest()->get();
        return response()->json($users);
    }

    public function verifyUser(Request $request, User $user)
    {
        $user->update(['is_verified' => true]);
        return response()->json(['message' => 'User verified successfully']);
    }

    public function toggleStatus(Election $election)
    {
        $newStatus = $election->status === 'active' ? 'draft' : 'active';
        $election->update(['status' => $newStatus]);

        return response()->json([
            'message' => "Election is now " . $newStatus,
            'status' => $newStatus
        ]);
    }

    public function addCandidate(Request $request, Election $election)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'party' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'photo' => 'nullable|file|mimes:jpeg,png,jpg,gif,avif|max:2048',
            'party_logo' => 'nullable|file|mimes:jpeg,png,jpg,gif,avif|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('candidates', 'public');
        }

        if ($request->hasFile('party_logo')) {
            $validated['party_logo'] = $request->file('party_logo')->store('party_logos', 'public');
        }

        $validated['position'] = 'Candidate';

        $candidate = $election->candidates()->create($validated);

        return response()->json([
            'message' => 'Candidate added successfully',
            'candidate' => $candidate
        ], 201);
    }

    public function deleteCandidate(Candidate $candidate)
    {
        $candidate->delete();
        return response()->json(['message' => 'Candidate removed successfully']);
    }

    public function getCandidates(Election $election)
    {
        return response()->json($election->candidates);
    }

    public function getResults(Election $election)
    {
        $totalVotes = \App\Models\Vote::where('election_id', $election->id)->count();
        $candidates = $election->candidates;
        
        $results = $candidates->map(function($candidate) use ($totalVotes) {
            $votes = \App\Models\Vote::where('candidate_id', $candidate->id)->count();
            return [
                'candidate_id' => $candidate->id,
                'candidate' => $candidate,
                'votes' => $votes,
                'percentage' => $totalVotes > 0 ? round(($votes / $totalVotes) * 100, 1) : 0
            ];
        });

        return response()->json([
            'total_votes' => $totalVotes,
            'results' => $results
        ]);
    }

    public function deleteUser(User $user)
    {
        // Don't allow deleting yourself
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'You cannot delete your own account'], 403);
        }

        // Delete associated votes
        \App\Models\Vote::where('voter_id', $user->id)->delete();
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    public function deleteElection(Election $election)
    {
        $election->candidates()->delete();
        \App\Models\Vote::where('election_id', $election->id)->delete();
        $election->delete();

        return response()->json(['message' => 'Election deleted successfully']);
    }
}
