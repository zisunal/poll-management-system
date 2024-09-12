<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PollsController;
use App\Http\Controllers\VotesController;
use App\Http\Controllers\AuthController; // Add this line

// \Lomkit\Rest\Facades\Rest::resource('users', \App\Rest\Controllers\UsersController::class);

Route::group(['prefix' => 'polls'], function () {
    Route::get('/running/{ct}', [PollsController::class, 'indexRunning']);
    Route::get('/finished/{ct}', [PollsController::class,'indexFinished']);
});
Route::group(['prefix'=> 'vote'], function () {
    Route::post('/', [VotesController::class, 'vote']);
    Route::put('/', [VotesController::class,'changeVote']);
});
Route::group(['prefix'=> 'auth'], function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::group(['middleware' => 'auth:sanctum'], function () {
        Route::post('/verify', [AuthController::class, 'verifyToken']);
        Route::post('/change', [AuthController::class, 'changeProfile']);
        Route::get('/running-admin/{ct}', [PollsController::class, 'indexRunningAdmin']);
        Route::get('/not-started/{ct}', [PollsController::class,'indexNotStarted']);
        Route::post('/store', [PollsController::class, 'store']);
        Route::put('/update', [PollsController::class, 'update']);
        Route::post('/delete', [PollsController::class, 'delete']);
        Route::put('/pause', [PollsController::class, 'pause']);
        Route::put('/resume', [PollsController::class, 'resume']);
        Route::put('/stop', [PollsController::class, 'stop']);
    });
});
Route::get('/password/{string}', function ($string) {
    return response()->json(['password' => Hash::make($string)]);
});