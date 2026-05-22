<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use App\Models\Language;
use App\Models\Level;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Alignment;


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

    public function show($id) {
        $course = Course::with('chapters')->find($id);

        if($course === null) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found.'
            ],404);
        }

        return response()->json([
                'status' => 200,
                'data' => $course,
            ],200);
    }

    //This method will return  category,level,language
    public function metaData(){
        $categories = Category::all();
        $levels = Level::all();
        $languages = Language::all();

        return response()->json([
            'status' => 200,
            'categories' => $categories,
            'levels' => $levels,
            'languages' => $languages,
        ],200);
    }

       //This method will update a course in basic data
    public function update ($id, Request $request) {

        $course = Course::find($id);

        if($course === null) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found.'
            ],404);
        }

        $validator = Validator::make($request->all(),[
            'title' => 'required|min:5',
            'category' => 'required',
            'level' => 'required',
            'language' => 'required',
            'sell_price' => 'required',
        ]);

        if($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ],400);
        }

    //This will update course in DB
    $course->title = $request->title;
    $course->category_id = $request->category;
    $course->level_id = $request->level;
    $course->language_id = $request->language;
    $course->price = $request->sell_price;
    $course->cross_price = $request->cross_price;
    $course->description = $request->description;
    $course->save();

    return response()->json([
                'status' => 200,
                'data' => $course,
                'message' => 'Course has been updated successfully.'
            ],200);

    }

    public function  saveCourseImage($id, Request $request) {
        $course = Course::find($id);

        if($course == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found.'
            ],404);
        }

        $validator =Validator::make($request->all(), [
            'image' => 'required|file|mimes:png,jpg,jpeg'
        ]);

        if($validator->fails()) {
            return response()->json([
                'status' => 404,
                'message' => $validator->errors()
            ],404);
        }

        if($course->image != ""){
            if(File::exists(public_path('uploads/course/'.$course->image))){
                File::delete(public_path('uploads/course/'.$course->image));
            }

            if(File::exists(public_path('uploads/course/small/'.$course->image))){
                File::delete(public_path('uploads/course/small/'.$course->image));
            }

        }

        //to make unique image name
        $image = $request->image;
        $ext = $image->getClientOriginalExtension();
        $imageName = strtotime('now').'-'.$id.'.'.$ext; //123123132-1.jpg
        $image->move(public_path('uploads/course'),$imageName);


        // create new image instance (800 x 600)
        $manager = ImageManager::usingDriver(Driver::class);
        $img = $manager->decode(public_path('uploads/course/'.$imageName));

        // crop the best fitting 5:3 (600x360) ratio and resize to 600x360 pixel
        $img->cover(750, 450);
        $img->save(public_path('uploads/course/small/'.$imageName));

        $course->image =$imageName;
        $course->save();

        return response() -> json ([
            'status'  =>200,
            'data' => $course,
            'message' => 'Image uploaded successfully.'
        ],200);
    }
}
