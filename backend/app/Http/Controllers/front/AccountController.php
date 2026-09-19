<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Chapter;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AccountController extends Controller
{
    public function register (Request $request) {

        $validator = Validator::make($request->all(), [
            'name' => 'required|min:5',
            'email' => 'required|email|unique:users',
            'password' => 'required',
        ]);

        //This will return validation error
        if($validator-> fails()){
            return response()->json([
                'status' =>400,
                'errors' => $validator->errors()
            ],400);
        }

        //Now save user info in database
        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'status' => 200,
            'message' => 'User Registered successfully.'
        ],200);

    }

    public function authenticate(Request $request){
            $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        //This will return validation error
        if($validator-> fails()){
            return response()->json([
                'status' =>400,
                'errors' => $validator->errors()
            ],400);
        }

        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {

            $user = User::find(Auth::user()->id);
            $token = $user->createToken('token')->plainTextToken;

            return response()->json([
                'status' => 200,
                'message' => 'User authenticated successfully.',
                'token' => $token,
                'name' => $user->name,
                'id' => Auth::user()->id
            ],200);

        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Invalid email or password.'
            ],401);

        }
    }

    public function courses(Request $request) {
        $courses = Course:: where('user_id', $request->user()->id)
                    ->withCount('reviews')
                    ->withCount('enrollments')
                    ->withSum('reviews', 'rating')
                    ->with('level')
                    ->get();

        $courses->map(function($course) {
            $course->rating =  $course->reviews_count > 0 ?
                number_format(($course->reviews_sum_rating/ $course->reviews_count),1) : "0.0";
        });

        return response()->json([
                'status' => 200,
                'courses' => $courses
            ],200);


    }

    public function enrollments (Request $request) {
        $enrollments = Enrollment::where('user_id', $request->user()->id)
                                        ->with(['course' => function($query) {
                                            $query ->withCount('reviews');
                                            $query->withSum('reviews', 'rating');
                                            $query->withCount('enrollments');
                                        }, 'course.level'])
                                        ->get();

        $enrollments->map(function($enrollments) {
            $enrollments->course->rating =  $enrollments->course->reviews_count > 0 ?
                number_format(($enrollments->course->reviews_sum_rating/ $enrollments->course->reviews_count),1) : "0.0";
        });

        return response()->json([
                'status' => 200,
                'data' => $enrollments
            ],200);
    }


    public function course($id, Request $request) {

        $count = Enrollment::where([
            'user_id'=> $request->user()->id,
            'course_id'=> $id
            ])->count();

        if($count == 0) {
            return response()->json([
                'status' => 404,
                'message' => "You cannot access this course"
            ],404);
        }


        $course =Course::where('id', $id)
            ->withCount('chapters')
            ->with([
                'category',
                'level',
                'language',
                'chapters' => function($query) {
                    $query->withCount(['lessons' => function($q) {
                        $q->where('status',1);
                        $q->whereNotNull('video');
                    }]);
                    $query->withSum(['lessons' => function($q) {
                        $q->where('status',1);
                        $q->whereNotNull('video');
                    }], 'duration');
                },
                'chapters.lessons' => function($q) {
                    $q->where('status',1);
                    $q->whereNotNull('video');
                }
            ])
            ->first();


            $totalLessons = $course->chapters->sum('lessons_count');



            $activeLesson = collect();

            //if no activity saved then show first lesson of first chapter

            $activityCount = Activity::where([
                'user_id' => $request->user()->id,
                'course_id' =>$id
            ])->count();

            if($activityCount == 0) {

                $chapter = Chapter::where('course_id', $id)
                            ->orderBy('sort_order', 'ASC')
                            ->first();

                $lesson = Lesson::where('chapter_id', $chapter->id)
                            ->where('status',1)
                            ->whereNotNull('video')
                            ->orderBy('sort_order', 'ASC')
                            ->first();


                $activity =new Activity();
                $activity->course_id = $id;
                $activity->user_id = $request->user()->id;
                $activity->chapter_id = $chapter->id;
                $activity->lesson_id = $lesson->id;
                $activity->is_last_watched= "yes";
                $activity->save();

                $activeLesson = $lesson;
            } else {
                $activity = Activity::where([
                        'user_id' => $request->user()->id,
                        'course_id' =>$id,
                        'is_last_watched' => "yes"
                 ])->first();

                $activeLesson = Lesson::where('id', $activity->lesson_id)
                            ->first();
            }

            //fetch which lesson are completed
            $completedLessons = Activity::where([
                'user_id' => $request->user()->id,
                'course_id' =>$id,
                'is_completed' => "yes"
            ])
            ->pluck('lesson_id')
            ->toArray();

             $completedLessonsCount = Activity::where([
                'user_id' => $request->user()->id,
                'course_id' =>$id,
                'is_completed' => "yes"
            ])
            ->count();

            $progress = round(($completedLessonsCount/$totalLessons )* 100);



            return response()->json([
                'status' => 200,
                'data' => $course,
                'progress' => $progress,
                'activeLesson' => $activeLesson,
                'completedLessons' => $completedLessons
            ],200);

    }

    public function saveUserActivity(Request $request) {
        Activity::where([
            'user_id' => $request->user()->id,
            'course_id' =>$request->course_id
        ])->update([
            'is_last_watched' => "no"]);

        Activity::updateOrInsert(
            [
                'user_id' => $request->user()->id,
                'course_id' =>$request->course_id,
                'chapter_id' =>$request->chapter_id,
                'lesson_id' =>$request->lesson_id
            ],
            [
                'is_last_watched' => "yes"
            ]
        );

        return response()->json([
                'status' => 200,
                'message' => "User activity saved successfully"
            ],200);
    }

    public function markAsComplete(Request $request){

     Activity::where([
                'user_id' => $request->user()->id,
                'course_id' =>$request->course_id,
                'chapter_id' =>$request->chapter_id,
                'lesson_id' =>$request->lesson_id,
            ])->update([
                'is_completed' => "yes"
            ]);


            //fetch which lesson are completed
            $completedLessons = Activity::where([
                'user_id' => $request->user()->id,
                'course_id' =>$request->course_id,
                'is_completed' => "yes"
            ])
            ->pluck('lesson_id')
            ->toArray();


            $completedLessonsCount = Activity::where([
                'user_id' => $request->user()->id,
                'course_id' =>$request->course_id,
                'is_completed' => "yes"
            ])
            ->count();


            $course =Course::where('id', $request->course_id)
            ->withCount('chapters')
            ->with([
                'chapters' => function($query) {
                    $query->withCount(['lessons' => function($q) {
                        $q->where('status',1);
                        $q->whereNotNull('video');
                    }]);
                    $query->withSum(['lessons' => function($q) {
                        $q->where('status',1);
                        $q->whereNotNull('video');
                    }], 'duration');
                },
                'chapters.lessons' => function($q) {
                    $q->where('status',1);
                    $q->whereNotNull('video');
                }
            ])
            ->first();


            $totalLessons = $course->chapters->sum('lessons_count');

            $progress = round(($completedLessonsCount/$totalLessons )* 100);


            return response()->json([
                'status' => 200,
                'completedLessons' => $completedLessons,
                'progress' => $progress,
                'message' => "Lesson marked as complete"
            ],200);

    }



    public function saveRating(Request $request) {

        $course = Course::find($request->course_id);

        if ($course == null) {
            return response()-> json([
                'status' => 404,
                "message" => "Course not found"
            ],404);
        }

        $count = Review::where('course_id', $request->course_id)
                            ->where('user_id',$request->user()->id)->count();

        if ($count > 0) {
            return response()-> json([
                'status' => 200,
                "message" => "You already rated this course."
            ],200);
        }

        $review = new Review();
        $review->comment = $request ->comment;
        $review->rating = $request ->rating;
        $review->user_id = $request->user()->id;
        $review->course_id = $request->course_id;
        $review->status = 1;
        $review->save();

        return response()-> json([
                'status' => 200,
                "message" => "Thanks for your feedback."
            ],200);
    }
}
