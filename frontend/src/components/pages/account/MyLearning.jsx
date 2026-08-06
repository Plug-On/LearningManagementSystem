import React, { useEffect, useState } from 'react'
import UserSidebar from '../../common/UserSidebar'
import CourseEnrolled from '../../common/CourseEnrolled'
import Layout from '../../common/Layout'
import { apiUrl, token } from '../../common/config'
const MyLearning = () => {

    const [enrollments, setEnrollments] = useState([])

    const fetchEnrollments = async (id) => {
                
                        await fetch(`${apiUrl}/enrollments`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept' : 'application/json',
                            'Authorization' : `Bearer ${token}`
                        }
                    })
                    .then(res => res.json())
                    .then(result => {
                        
                        if (result.status == 200){
                          
                        setEnrollments(result.data);
                        } else {
                        console.log("something went wrong");
                        }
                    });
                
            }

            useEffect(()=> {
                fetchEnrollments()
            },[])


  return (
    <Layout>
        <section className='section-4'>
                    <div className='container'>
                        <div className='row'>
                            <div className='d-flex justify-content-between  mt-5 mb-3'>
                                <h2 className='h4 mb-0 pb-0'>My Learning</h2>
                                {/* <a href="#" className='btn btn-primary'>Create</a> */}
                            </div>
                            <div className='col-lg-3 account-sidebar'>
                              <UserSidebar/>
                            </div>
                            <div className='col-lg-9'>
                                <div className='row gy-4'>
                                    {
                                        enrollments && enrollments.map(enrollment => {
                                            return(
                                                <CourseEnrolled
                                                enrollment={enrollment}
                                                key={enrollment.id} />
                                            )
                                        })
                                    }
                                    
                                                                  
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
    </Layout>
  )
}

export default MyLearning