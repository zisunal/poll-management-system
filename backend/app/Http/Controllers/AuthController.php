<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required'
        ]);
        $credentials = $request->only('email', 'password');
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 401);
        }
        if (auth()->attempt($credentials)) {
            $token = auth()->user()->createToken('authToken');
            return response()->json(['token' => explode("|", $token->plainTextToken)[1]], 200);
        } else {
            return response()->json(['error' => 'Unauthorised'], 401);
        }
    }
    public function verifyToken(Request $request)
    {
        $user = auth()->user();
        if ($user) {
            // Token is valid
            return response()->json(['message' => 'Token is valid', 'user' => [
                "name" => $user->name,
                "email"=> $user->email
            ]], 200);
        } else {
            // Token is invalid
            return response()->json(['error' => 'Invalid token'], 401);
        }
    }
    public function changeProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email',
            'password' => 'nullable'
        ]);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 401);
        }
        $user = auth()->user();
        if ($user) {
            $user->name = $request->name;
            $user->email = $request->email;
            if ($request->password) {
                $user->password = bcrypt($request->password);
            }
            $user->save();
            return response()->json(['message' => 'Profile updated'], 200);
        } else {
            return response()->json(['error' => 'Invalid token'], 401);
        }
    }
}
