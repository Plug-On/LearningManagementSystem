import React, { useEffect, useState } from 'react'
import Layout from '../../../common/Layout'
import { Link, useParams } from 'react-router-dom'
import UserSidebar from '../../../common/UserSidebar'
import { useForm } from 'react-hook-form'
import { apiUrl, token } from '../../../common/config'

const EditLesson = () => {

    const { register, handleSubmit, formState: {errors}, reset, setError} = useForm();
    const [chapters, setChapters] = useState();
    const params = useParams();

    const onSubmit = (data) => {
        
    }

    useEffect(() => {
        // fetch lesson details and fill the form
        fetch(`${apiUrl}/chapters?course_id=${params.courseId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json',
                'Authorization' : `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(result => {
            if(result.status == 200){
                setChapters(result.data);
            } else {
                console.log("Something went wrong");
            }
        });


    }, [])
    
  return (
    <>
      <Layout>
        <section className='section-4'>
             <div className='container pb-5 pt-3'>
                <div className='row'>
                    <div className='col-md-12 mt-5 mb-3'>
                        <div className='d-flex justify-content-between'>
                            <h2 className='h4 mb-0 pb-0'>Edit Lesson</h2>
                        </div>
                    </div>
                    <div className='col-lg-3 account-sidebar'>
                        <UserSidebar/>
                    </div>
                    <div className='col-lg-9'>
                        <div className='row'>
                            <div className='col-md-8'>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className='card-border-0 shadow-lg'>
                                        <div className='card-body p-4'>
                                            <h4 className='h5 border-bottom pb-3 mb-3'>Basic Information</h4>

                                            <div className='mb-3'>
                                                <label className='form-label'>Title</label>
                                                <input type="text" className='form-control' placeholder="Lesson Title"/>
                                            </div>

                                            <div className='mb-3'>
                                                <label className='form-label'>Chapter</label>
                                                <select className='form-select'>
                                                    <option value="">Select Chapter</option>
                                                    {
                                                        chapters && chapters.map((chapter) => {
                                                            return(
                                                                    <option key={chapter.id} value={chapter.id}>{chapter.title}</option>
                                                            )
                                                        }
                                                    )}
                                                </select>
                                            </div>

                                            <div className='mb-3'>
                                                <label className='form-label'>Duration(mis)</label>
                                                <input type="text" className='form-control' placeholder="Duration in minutes"/>
                                            </div>

                                        </div>
                                    </div>
                                </form>        
                            </div>
                        </div>
                    </div>
                </div>
             </div>
        </section>
      </Layout>
    </>
  )
}

export default EditLesson
