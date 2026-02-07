<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        \App\Models\Message::create($validated);

        return response()->json(['message' => 'Message sent successfully!'], 201);
    }

    public function index()
    {
        return response()->json(\App\Models\Message::orderBy('created_at', 'desc')->get());
    }

    public function markAsRead($id)
    {
        $message = \App\Models\Message::findOrFail($id);
        $message->update(['is_read' => true]);
        return response()->json(['message' => 'Message marked as read']);
    }

    public function destroy($id)
    {
        $message = \App\Models\Message::findOrFail($id);
        $message->delete();
        return response()->json(['message' => 'Message deleted successfully']);
    }
}
