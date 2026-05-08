<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class CourseController extends Controller
{
    //This method will return all course for a specific user
    public function index() {

    }

    //This method will save/store a course in database as a draft
    public function store (Request $request) {
        $validator = Validator::make($request->all(),[
            'title' => 'required|min:5'
        ]);

        if($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ],400);
        }

    //This will store course in DB
    $course = new Course();
    $course->title = $request->title;
    $course->status = 0;
    $course->user_id = $request-> user()->id;
    $course->save();

    return response()->json([
                'status' => 200,
                'data' => $course,
                'message' => 'Course has been created successfully.'
            ],200);

    }
}
