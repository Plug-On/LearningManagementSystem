import React, { useEffect, useState } from 'react'
import { apiUrl, token } from '../common/config'
import Course from './Course'

const RecommendedCourses = ({ courseId }) => {

    const [courses, setCourses] = useState([]);

    const fetchRecommendedCourses = () => {

        if (!courseId) {
            return;
        }

        fetch(`${apiUrl}/recommended-courses?course_id=${courseId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(result => {

            if (result.status === 200) {
                setCourses(result.data);
            } else {
                console.log("Something went wrong");
            }

        })
        .catch(error => {
            console.log(error);
        });
    }

    useEffect(() => {
        fetchRecommendedCourses();
    }, [courseId]);

    if (courses.length === 0) {
        return null;
    }

    return (
        <section className='section-3 my-5'>
            <div className="container">

                <div className='section-title py-3 mt-4'>
                    <h2 className='h3'>Recommended Courses</h2>
                    <p>
                        Courses recommended based on content similarity.
                    </p>
                </div>

                <div className="row gy-4">

                    {
                        courses.map(course => {

                            return (
                                <Course
                                    key={course.id}
                                    course={course}
                                    customClasses="col-lg-3 col-md-6"
                                />

                                 //This shows similarity course (for demo) 
                                // <div className="col-lg-3 col-md-6" key={course.id}>
                                //     <Course
                                //         course={course}
                                //     />

                                //     <p className="mt-2 text-center">
                                //         Similarity Score: {course.similarity_score}%
                                //     </p>
                                // </div>
                            )

                        })
                    }

                </div>

            </div>
        </section>
    )
}

export default RecommendedCourses