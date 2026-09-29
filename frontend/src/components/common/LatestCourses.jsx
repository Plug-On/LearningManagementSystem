import React, { useEffect, useState } from 'react'
import { apiUrl, token } from './config'
import Course from './Course'

const LatestCourses = () => {

    const [courses, setCourses] = useState([]);

    const fetchLatestCourses = () => {

        fetch(`${apiUrl}/fetch-latest-courses`, {
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
        fetchLatestCourses();
    }, []);

    if (courses.length === 0) {
        return null;
    }

    return (
        <section className='section-3 my-5'>
            <div className="container">

                <div className='section-title py-3 mt-4'>
                    <h2 className='h3'>Latest Courses</h2>
                    <p>
                        Discover the latest courses added to our platform.
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
                            )
                        })
                    }

                </div>

            </div>
        </section>
    )
}

export default LatestCourses