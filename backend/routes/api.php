<?php

use App\Http\Controllers\front\AccountController;
use App\Http\Controllers\front\CourseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::post('/register', [AccountController::class, 'register']);
Route::post('/login', [AccountController::class, 'authenticate']);


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::group(['middleware' => ['auth:sanctum']],function(){
    Route::post('/courses',[CourseController::class, 'store']);
    Route::get('/courses/meta-data',[CourseController::class, 'metaData']);
    Route::get('/courses/{id}',[CourseController::class, 'show']);
});

