import React, { useEffect, useState } from 'react'
import { apiUrl, token } from './config'
import Course from './Course'

const PopularCourses = () => {

    const [courses, setCourses] = useState([]);

    const fetchPopularCourses = () => {

        fetch(`${apiUrl}/fetch-popular-courses`, {
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
        fetchPopularCourses();
    }, []);

    return (
        <section className='section-3 my-5'>
            <div className="container">

                <div className='section-title py-3 mt-4'>
                    <h2 className='h3'>Popular Courses</h2>
                    <p>
                        Explore courses that are popular among our students.
                    </p>
                </div>

                <div className="row gy-4">

                    {
                        courses && courses.map(course => {
                            return (
                                <Course
                                    key={course.id}
                                    course={course}
                                    customClasses="col-lg-3 col-md-6"
                                />
                            )
                        })
                    }

                </div>

            </div>
        </section>
    )
}

export default PopularCourses