<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vote;
use Illuminate\Support\Facades\Validator;

class VotesController extends Controller
{
    public function vote(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'poll_id' => 'required|integer|exists:polls,id',
            'option' => 'required|string',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()
            ], 400);
        }
        $vote = Vote::where('poll_id', $request->poll_id)->where('ip_address', $request->ip())->where('user_agent', request()->userAgent())->get();
        if ($vote->count() > 0) {
            return response()->json([
                'error' => 'You have already voted'
            ], 400);
        };
        $vote = new Vote();
        $vote->poll_id = $request->poll_id;
        $vote->option = $request->option;
        $vote->ip_address = $request->ip();
        $vote->user_agent = request()->userAgent();
        $vote->save();

        return response()->json([
            'message' => 'Voted'
        ]);
    }
    public function changeVote(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'poll_id' => 'required|integer|exists:polls,id|exists:votes,poll_id',
            'option' => 'required|string',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()
            ], 400);
        }
        $vote = Vote::where('poll_id', $request->poll_id)->where('ip_address', $request->ip())->where('user_agent', request()->userAgent())->first();
        if ($vote == null) {
            return response()->json([
                'error' => 'You have not voted yet'
            ], 400);
        }
        if ($vote->changed_at != "") {
            return response()->json([
                'error' => 'You have already changed your vote once'
            ], 400);
        }
        $vote->option = $request->option;
        $vote->changed_at = now();
        $vote->save();

        return response()->json([
            'message' => 'Changed vote'
        ]);
    }
}
