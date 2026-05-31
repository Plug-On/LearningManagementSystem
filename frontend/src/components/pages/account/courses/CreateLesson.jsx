import React, { useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import { apiUrl, token } from '../../../common/config';
import toast from 'react-hot-toast';
import { useState } from 'react';



const CreateLesson = ({ showLessonModal, handleCloseLessonModal, course, chapters }) => {

    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: {errors}, reset} = useForm();

     const onSubmit = async (data) => {
        setLoading(true)
         await fetch(`${apiUrl}/lessons`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept' : 'application/json',
                        'Authorization' : `Bearer ${token}`
                    },
                    body: JSON.stringify(data)
                })
                .then(res => res.json())
                .then(result => {
                    setLoading(false)
                    if (result.status == 200){
                       // setChapters({type: "UPDATE_CHAPTER", payload: result.data})
                        toast.success(result.message)
                        reset({
                            chapter: '',
                            lesson: '',
                            status: 1
                        });
                        handleCloseLessonModal();
                        
                    } else {
                    console.log("something went wrong");
                     }
                });

     }


  return (
    <>
      
      <Modal size='lg' show={showLessonModal} onHide={handleCloseLessonModal}>
            <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header closeButton>
                    <Modal.Title>Create Lesson</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='mb-3'>
                            <label htmlFor="" className='form-label'> 
                                Chapter
                            </label>
                            <select 
                                {
                                    ...register('chapter', {
                                        required:'Please select a chapter.'
                                    })
                                 }
                                 className={`form-select ${errors.chapter && 'is-invalid'} ` }>
                                <option value="">Select a Chapter</option>
                                {
                                    chapters && chapters.map(chapter => {
                                        return (
                                            <option key={chapter.id} value={chapter.id}>{chapter.title}</option>
                                        )
                                    })
                                }
                            </select>
                                {
                                    errors.chapter && <p className="invalid-feedback">{errors.chapter.message}</p>
                                }
                            
                        </div>

                        <div className='mb-3'>
                            <label htmlFor="" className='form-label'> 
                                Lesson
                            </label>
                            <input 
                                {
                                    ...register('lesson', {
                                        required:'The Lesson field is required.'
                                    })
                                }
                                type="text" 
                                className={`form-control ${errors.lesson && 'is-invalid'} ` }
                                placeholder='Lesson'
                            />
                            {
                            errors.lesson && <p className="invalid-feedback">{errors.lesson.message}</p>
                        }
                        </div>

                        <div>
                            <label htmlFor="" className='form-label'> 
                                Status
                            </label>
                            <select 
                                    {
                                        ...register('status', {
                                            required:'The Status field is required.'
                                        })
                                    }
                            className='form-select'>
                                <option value="1" selected>Active</option>
                                <option value="0">Inactive</option>
                            </select>
                        </div>

                    </Modal.Body>
                    <Modal.Footer>


                    <button 
                        disabled={loading}
                        className='btn btn-primary'>
                        {loading == false ? 'Save' : 'Please wait...'}
                    </button>
                    </Modal.Footer>
            </form>
        </Modal>
    </>

  )
}

export default CreateLesson
