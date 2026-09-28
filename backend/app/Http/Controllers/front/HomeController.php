<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Language;
use App\Models\Level;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function fetchCategories() {
        $categories = Category::orderBy('name', 'ASC')
                                ->where('status',1)
                                ->get();
        return response()->json([
            'status' => 200,
            'data' => $categories
        ],200);
    }

     public function fetchLevels() {
        $levels = Level::orderBy('name', 'ASC')
                                ->where('status',1)
                                ->get();
        return response()->json([
            'status' => 200,
            'data' => $levels
        ],200);
    }

     public function fetchLanguages() {
        $languages = Language::orderBy('created_at', 'ASC')
                                ->where('status',1)
                                ->get();
        return response()->json([
            'status' => 200,
            'data' => $languages
        ],200);
    }

    public function fetchFeaturedCourses() {
        $courses = Course::orderBy('title', 'ASC')
            ->with('level')
            ->withCount('enrollments')
            ->withCount('reviews')
            ->withSum('reviews', 'rating')
            ->where('is_featured', 'yes')
            ->where('status',1)
            ->get();



        $courses->map(function($course) {
            $course->rating =  $course->reviews_count > 0 ?
                number_format($course->reviews_sum_rating/ $course->reviews_count,1) : "0.0";
        });

        return response()->json([
            'status' => 200,
            'data' => $courses
        ],200);
    }

    public function recommendedCourses(Request $request){
        $courseId = $request->course_id;

        // Check if course_id was provided
        if (!$courseId) {
            return response()->json([
                'status' => 400,
                'message' => 'course_id is required'
            ], 400);
        }

        // Get the selected course
        $selectedCourse = Course::where('id', $courseId)
            ->where('status', 1)
            ->with([
                'category',
                'level',
                'outcomes',
                'requirements'
            ])
            ->first();

        if (!$selectedCourse) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found'
            ], 404);
        }

        // Get all other active courses
        $courses = Course::where('status', 1)
            ->where('id', '!=', $courseId)
            ->with([
                'category',
                'level',
                'outcomes',
                'requirements',
                'level',
            ])
            ->withCount('reviews')
            ->withSum('reviews', 'rating')
            ->get();

        if ($courses->isEmpty()) {
            return response()->json([
                'status' => 200,
                'data' => [],
                'message' => 'No other courses available'
            ], 200);
        }

        /*
        |--------------------------------------------------------------------------
        | Create text for selected course
        |--------------------------------------------------------------------------
        */

        $selectedText = '';

        $selectedText .= ' ' . $selectedCourse->title;
        $selectedText .= ' ' . ($selectedCourse->description ?? '');

        if ($selectedCourse->category) {
            $selectedText .= ' ' . $selectedCourse->category->name;
        }

        if ($selectedCourse->level) {
            $selectedText .= ' ' . $selectedCourse->level->name;
        }

        foreach ($selectedCourse->outcomes as $outcome) {
                $selectedText .= ' ' . ($outcome->text ?? '');
            }

            foreach ($selectedCourse->requirements as $requirement) {
                $selectedText .= ' ' . ($requirement->text ?? '');
            }

        $selectedWords = $this->preprocessText($selectedText);

        /*
        |--------------------------------------------------------------------------
        | Create documents
        |--------------------------------------------------------------------------
        */

        $documents = [];

        $documents[] = $selectedWords;

        foreach ($courses as $course) {

            $text = '';

            $text .= ' ' . $course->title;
            $text .= ' ' . ($course->description ?? '');

            if ($course->category) {
                $text .= ' ' . $course->category->name;
            }

            if ($course->level) {
                $text .= ' ' . $course->level->name;
            }

            foreach ($course->outcomes as $outcome) {
                $text .= ' ' . ($outcome->text ?? '');
            }

            foreach ($course->requirements as $requirement) {
                $text .= ' ' . ($requirement->text ?? '');
            }

            $documents[] = $this->preprocessText($text);
        }

        /*
        |--------------------------------------------------------------------------
        | Calculate Term Frequency (TF)
        |--------------------------------------------------------------------------
        */

        $termFrequencies = [];

        foreach ($documents as $documentIndex => $document) {

            $termFrequencies[$documentIndex] = [];

            $wordCount = count($document);

            if ($wordCount == 0) {
                continue;
            }

            foreach ($document as $word) {

                if (!isset($termFrequencies[$documentIndex][$word])) {
                    $termFrequencies[$documentIndex][$word] = 0;
                }

                $termFrequencies[$documentIndex][$word]++;
            }

            foreach ($termFrequencies[$documentIndex] as $word => $count) {

                $termFrequencies[$documentIndex][$word] =
                    $count / $wordCount;
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Calculate Inverse Document Frequency (IDF)
        |--------------------------------------------------------------------------
        */

        $documentCount = count($documents);

        $documentFrequency = [];

        foreach ($documents as $document) {

            $uniqueWords = array_unique($document);

            foreach ($uniqueWords as $word) {

                if (!isset($documentFrequency[$word])) {
                    $documentFrequency[$word] = 0;
                }

                $documentFrequency[$word]++;
            }
        }

        $idf = [];

        foreach ($documentFrequency as $word => $frequency) {

            $idf[$word] =
                log($documentCount / (1 + $frequency)) + 1;
        }

        /*
        |--------------------------------------------------------------------------
        | Calculate TF-IDF
        |--------------------------------------------------------------------------
        */

        $tfidfVectors = [];

        foreach ($termFrequencies as $documentIndex => $terms) {

            $tfidfVectors[$documentIndex] = [];

            foreach ($terms as $word => $tf) {

                $tfidfVectors[$documentIndex][$word] =
                    $tf * ($idf[$word] ?? 0);
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Selected course vector
        |--------------------------------------------------------------------------
        */

        $selectedVector = $tfidfVectors[0];

        /*
        |--------------------------------------------------------------------------
        | Calculate Cosine Similarity
        |--------------------------------------------------------------------------
        */

        $recommendations = [];

        foreach ($courses as $index => $course) {

            $courseVector = $tfidfVectors[$index + 1];

            $dotProduct = 0;
            $selectedMagnitude = 0;
            $courseMagnitude = 0;

            $allWords = array_unique(
                array_merge(
                    array_keys($selectedVector),
                    array_keys($courseVector)
                )
            );

            foreach ($allWords as $word) {

                $selectedValue =
                    $selectedVector[$word] ?? 0;

                $courseValue =
                    $courseVector[$word] ?? 0;

                $dotProduct +=
                    $selectedValue * $courseValue;

                $selectedMagnitude +=
                    $selectedValue * $selectedValue;

                $courseMagnitude +=
                    $courseValue * $courseValue;
            }

            $selectedMagnitude =
                sqrt($selectedMagnitude);

            $courseMagnitude =
                sqrt($courseMagnitude);

            if (
                $selectedMagnitude == 0 ||
                $courseMagnitude == 0
            ) {

                $similarity = 0;

            } else {

                $similarity =
                    $dotProduct /
                    ($selectedMagnitude * $courseMagnitude);
            }

            $course->similarity_score =
                round($similarity * 100, 2);

            $course->rating =
                $course->reviews_count > 0
                    ? number_format(
                        $course->reviews_sum_rating /
                        $course->reviews_count,
                        1
                    )
                    : "0.0";

            $recommendations[] = $course;
        }

        /*
        |--------------------------------------------------------------------------
        | Sort by similarity
        |--------------------------------------------------------------------------
        */

        usort($recommendations, function ($a, $b) {

            return $b->similarity_score
                <=> $a->similarity_score;
        });

        /*
        |--------------------------------------------------------------------------
        | Return top 4
        |--------------------------------------------------------------------------
        */

        $recommendations =
            array_slice($recommendations, 0, 4);

        return response()->json([
            'status' => 200,
            'data' => $recommendations
        ], 200);
    }

    private function preprocessText($text){
        $text = strtolower($text);

        $text = preg_replace('/[^a-z0-9\s]/', ' ', $text);

        $words = preg_split('/\s+/', trim($text));

        $stopWords = [
            'the',
            'and',
            'or',
            'is',
            'are',
            'a',
            'an',
            'to',
            'of',
            'in',
            'on',
            'for',
            'with',
            'this',
            'that',
            'by',
            'from',
            'as',
            'be',
            'will',
            'can',
            'you',
            'your',
            'our',
            'learn',
            'course'
        ];

        $words = array_filter($words, function ($word) use ($stopWords) {
            return strlen($word) > 2 &&
                !in_array($word, $stopWords);
        });

        return array_values($words);
    }

    public function courses (Request $request) {
        $courses = Course::where('status', 1)
        ->withCount('enrollments')
        ->withCount('reviews')
        ->withSum('reviews', 'rating')
        ->with('level');

        // Filter by courses by keywords
        if(!empty($request->keyword)){
            $courses = $courses->where('title', 'LIKE', '%' . $request->keyword . '%');
        }


        // Filter by courses by category
        if(!empty($request->category)){
            $categoryArr = explode(',',$request->category);
            if(!empty($categoryArr)){
                $courses = $courses->whereIn('category_id', $categoryArr);
            }
        }

        // Filter by courses by level
        if(!empty($request->level)){
            $levelArr = explode(',',$request->level);
            if(!empty($levelArr)){
                $courses = $courses->whereIn('level_id', $levelArr);
            }
        }

        // Filter by courses by language
        if(!empty($request->language)){
            $languageArr = explode(',',$request->language);
            if(!empty($languageArr)){
                $courses = $courses->whereIn('language_id', $languageArr);
            }
        }


        if(!empty($request->sort)){
            $sortArr = ['asc', 'desc'];
            if(in_array($request->sort, $sortArr)){
                $courses = $courses->orderBy('created_at', $request->sort);
            }else{
                $courses = $courses->orderBy('created_at', 'DESC');
            }
        }


        $courses = $courses->get();

        $courses->map(function($course) {
            $course->rating =  $course->reviews_count > 0 ?
                number_format($course->reviews_sum_rating/ $course->reviews_count,1) : "0.0";
        });

        return response()->json([
            'status' => 200,
            'data' => $courses
        ],200);

    }


    public function course($id) {
        $course =Course::where('id', $id)
            ->withCount('enrollments')
            ->withCount('chapters')
            ->withCount('reviews')
            ->withSum('reviews', 'rating')
            ->with([
                'reviews',
                'reviews.user',
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
                },
                'outcomes',
                'requirements'
            ])
            ->first();

        if($course == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found'
            ],404);
            }


            $totalDuration = $course->chapters->sum('lessons_sum_duration');
            $totalLessons = $course->chapters->sum('lessons_count');

            $course->total_duration= $totalDuration;
            $course->total_lessons= $totalLessons;

            $course->rating =  $course->reviews_count > 0 ?
                number_format(($course->reviews_sum_rating/ $course->reviews_count),1) : "0.0";

            return response()->json([
                'status' => 200,
                'data' => $course
            ],200);
    }

    public function enroll (Request $request) {

        $course = Course::find($request->course_id);

         if($course == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found'
            ],404);
            }

        $count = Enrollment::where(['user_id' => $request->user()->id,
                            'course_id' => $request->course_id
        ])->count();

        if($count > 0 ) {
            return response()->json([
                'status' => 409,
                'message' => 'You already enrolled'
            ],409);

        }

        $enrollment = new Enrollment();
        $enrollment->user_id = $request->user()->id;
        $enrollment->course_id = $request->course_id;
        $enrollment->save();

        return response()->json([
                'status' => 200,
                'message' => 'You have successfully enrolled'
            ],200);

    }
}
