<?php

namespace App\Http\Controllers;

use App\Models\Poll;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class PollsController extends Controller
{
    public function indexRunning(Request $request, $ct)
    {
        if ($ct == '') {
            return response()->json([
                'error' => 'Client time now is required'
            ], 400);
        }
        $polls = Poll::where('start_at', '<=', $ct)->where('end_at', '>=', $ct)->where('is_active', 1)->orderBy('created_at','desc')->get();
        
        $formattedPolls = [];
        foreach($polls as $poll) {
            if ($poll->votes()->where('ip_address', $request->ip())->where('user_agent', $request->header('User-Agent'))->exists()) {
                $isVoted = true;
                $opt = $poll->votes()->where('ip_address', $request->ip())->where('user_agent', $request->header('User-Agent'))->first()->option;
                $changed_at = $poll->votes()->where('ip_address', $request->ip())->where('user_agent', $request->header('User-Agent'))->first()->changed_at;
            } else {
                $isVoted = false;
            }
            $formattedPolls[] = [
                'id' => $poll->id,
                'question' => $poll->question,
                'options' => explode(',', $poll->options),
                'totalVotes' => $poll->votes->count(),
                'start_at' => $poll->start_at,
                'end_at' => $poll->end_at,
                'isVoted' => $isVoted,
                'votedOption' => $isVoted ? $opt : null,
                'changed_at' => $isVoted ? $changed_at : null,
                'created_at'=> $poll->created_at,
            ];
        }
        return response()->json([
            'polls'=> $formattedPolls
        ]);
    }
    public function indexNotStarted($ct)
    {
        $polls = Poll::where('start_at', '>', $ct)->orderBy('created_at','desc')->get();
        $formattedPolls = [];
        foreach($polls as $poll) {
            $formattedPolls[] = [
                'id' => $poll->id,
                'question' => $poll->question,
                'options' => explode(',', $poll->options),
                'start_at' => $poll->start_at,
                'end_at' => $poll->end_at,
                'created_at'=> $poll->created_at,
            ];
        }
        return response()->json([
            'polls'=> $formattedPolls
        ]);
    }
    public function indexFinished(Request $request, $ct)
    {
        $polls = Poll::where('end_at', '<=', $ct)->orderBy('created_at','desc')->get();
        $formattedPolls = [];
        foreach($polls as $poll) {
            $result = [];
            foreach($poll->votes as $vote) {
                if (!isset($result[$vote->option])) {
                    $result[$vote->option] = 0;
                }
                $result[$vote->option]++;
            }
            $formattedPolls[] = [
                'id' => $poll->id,
                'question' => $poll->question,
                'options' => explode(',', $poll->options),
                'totalVotes' => $poll->votes->count(),
                'start_at' => $poll->start_at,
                'end_at' => $poll->end_at,
                'votes' => $result,
                'created_at'=> $poll->created_at,
            ];
        }
        return response()->json([
            'polls'=> $formattedPolls
        ]);
    }
    public function indexRunningAdmin($ct)
    {
        if ($ct == '') {
            return response()->json([
                'error' => 'Client time now is required'
            ], 400);
        }
        $polls = Poll::where('start_at', '<=', $ct)->where('end_at', '>=', $ct)->orderBy('created_at','desc')->get();
        $formattedPolls = [];
        foreach($polls as $poll) {
            $result = [];
            foreach($poll->votes as $vote) {
                if (!isset($result[$vote->option])) {
                    $result[$vote->option] = 0;
                }
                $result[$vote->option]++;
            }
            $formattedPolls[] = [
                'id' => $poll->id,
                'question' => $poll->question,
                'options' => explode(',', $poll->options),
                'totalVotes' => $poll->votes->count(),
                'votes' => $result,
                'star_at'=> $poll->start_at,
                'end_at'=> $poll->end_at,
                'is_active'=> $poll->is_active,
            ];
        }
        return response()->json([
            'polls'=> $formattedPolls
        ]);
    }
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'question' => 'required',
            'options' => 'required',
            'start_at' => 'required',
            'end_at' => 'required|after:start_at',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()
            ], 400);
        }
        $opts_arr = explode(',', $request->options);
        if (count($opts_arr) < 2) {
            return response()->json([
                'error' => 'At least 2 options are required'
            ], 400);
        }
        if (count($opts_arr) > 10) {
            return response()->json([
                'error' => 'Maximum 10 options are allowed'
            ], 400);
        }
        if (count(array_unique($opts_arr)) < count($opts_arr)) {
            return response()->json([
                'error' => 'Duplicate options are not allowed'
            ], 400);
        }

        $poll = new Poll();
        $poll->question = $request->question;
        $poll->options = $request->options;
        $poll->start_at = $request->start_at;
        $poll->end_at = $request->end_at;
        $poll->save();
        return response()->json([
            'status' => 'success',
            'poll' => $poll
        ]);
    }
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:polls,id',
            'question' => 'required',
            'options' => 'required',
            'ct' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()
            ], 400);
        }
        $poll = Poll::find($request->id);
        if ($poll->start_at < $request->ct) {
            return response()->json([
                'error' => 'Poll has already been started'
            ], 400);
        }
        $poll->question = $request->question;
        $poll->options = $request->options;
        $poll->save();
        return response()->json([
            'status' => 'success',
            'message' => 'Poll updated successfully',
            'poll' => $poll
        ]);
    }
    public function delete(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:polls,id',
            'ct' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()
            ], 400);
        }
        $poll = Poll::find($request->id);
        if ($poll->start_at < $request->ct) {
            return response()->json([
                'error' => 'Poll has already been started'
            ], 400);
        }
        $poll->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Poll deleted successfully'
        ]);
    }
    public function pause(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:polls,id',
            'ct' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()
            ], 400);
        }
        $poll = Poll::find($request->id);
        if ($poll->start_at > $request->ct) {
            return response()->json([
                'error' => 'Poll has not been started yet'
            ], 400);
        }
        if ($poll->end_at < $request->ct) {
            return response()->json([
                'error' => 'Poll has already been finished'
            ], 400);
        }
        $poll->is_active = 0;
        $poll->save();
        return response()->json([
            'message' => 'Poll paused successfully'
        ]);
    }
    public function resume(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:polls,id',
            'ct' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()
            ], 400);
        }
        $poll = Poll::find($request->id);
        if ($poll->start_at > $request->ct) {
            return response()->json([
                'error' => 'Poll has not been started yet'
            ], 400);
        }
        if ($poll->end_at < $request->ct) {
            return response()->json([
                'error' => 'Poll has already been finished'
            ], 400);
        }
        $poll->is_active = 1;
        $poll->save();
        return response()->json([
            'message' => 'Poll resumed successfully'
        ]);
    }
    public function stop(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:polls,id',
            'ct' => 'required',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'error' => $validator->errors()
            ], 400);
        }
        $poll = Poll::find($request->id);
        if ($poll->start_at > $request->ct) {
            return response()->json([
                'error' => 'Poll has not been started yet'
            ], 400);
        }
        if ($poll->end_at < $request->ct) {
            return response()->json([
                'error' => 'Poll has already been finished'
            ], 400);
        }
        $poll->is_active = 0;
        $poll->end_at = $request->ct;
        $poll->save();
        return response()->json([
            'message' => 'Poll stopped successfully'
        ]);
    }
}
