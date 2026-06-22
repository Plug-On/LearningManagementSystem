<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
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
            ->where('is_featured', 'yes')
            ->where('status',1)
            ->get();
        return response()->json([
            'status' => 200,
            'data' => $courses
        ],200);
    }

    public function courses (Request $request) {
        $courses = Course::where('status', 1)->with('level');

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

        return response()->json([
            'status' => 200,
            'data' => $courses
        ],200);

    }
}
