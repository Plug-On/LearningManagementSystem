import React, { useReducer } from 'react'
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { useParams , Link } from "react-router-dom";
import { apiUrl , token} from "../../../common/config";
import toast from "react-hot-toast";
import Accordion from 'react-bootstrap/Accordion';
import UpdateChapter from './UpdateChapter';
import CreateLesson from './CreateLesson';
import { FaPlus } from "react-icons/fa";

const ManageChapter = ({course,params}) => {

    const { register, handleSubmit, formState: {errors}, reset} = useForm();
    const [loading, setLoading] = useState(false);
    const [chapterData, setChapterData] = useState([]);

      //create chapter modal
        const [showChapter, setShowChapter] = useState(false);
        const handleClose = () => setShowChapter(false);
        const handleShow = (chapter) => {
            setShowChapter(true);
            setChapterData(chapter)
        }

        // create lesson modal
        const [showLessonModal, setShowLessonModal] = useState(false);
        const handleCloseLessonModal = () => setShowLessonModal(false);
        const handleShowLessonModal = () => {
            setShowLessonModal(true);
        }

    const chapterReducer= (state, action) => {
        
        switch (action.type) {
            case "SET_CHAPTER":
                return action.payload;
            case "ADD_CHAPTER":
                return[...state, action.payload]
            case "UPDATE_CHAPTER":
                return state.map(chapter => {
                    if (chapter.id === action.payload.id) {
                        return action.payload;
                    }
                    return chapter;
                })

            case "DELETE_CHAPTER":
                return state.filter(chapter => chapter.id != action.payload)
        
            default:
                return state;
        }
    }

    const [chapters, setChapters] = useReducer(chapterReducer, []);

    const onSubmit = async (data) => {
        setLoading(true)
        const formData = {...data, course_id: params.id};

         await fetch(`${apiUrl}/chapters`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept' : 'application/json',
                        'Authorization' : `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                })
                .then(res => res.json())
                .then(result => {
                    setLoading(false)
                    if (result.status == 200){
                        // const newOutcomes = [...outcomes,result.data]
                        // setOutcomes(newOutcomes)
                        setChapters({type: "ADD_CHAPTER", payload: result.data})
                        toast.success(result.message)
                        reset()
                    } else {
                    //    toast.error(result.message);
                    console.log("something went wrong");
                     }
                });

        }

    
     const deleteChapter = async (id) => {

        if (confirm( "Are you sure you want to delete ? ")) {
                await fetch(`${apiUrl}/chapters/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept' : 'application/json',
                            'Authorization' : `Bearer ${token}`
                        }
                    })
                    .then(res => res.json())
                    .then(result => {
                        if (result.status == 200){
                            setChapters({type: "DELETE_CHAPTER", payload:id})
                            toast.success(result.message)
                        } else {
                        //    toast.error(result.message);
                        console.log("something went wrong");
                        }
                    });

            }

        }

         


        useEffect(() => {

            if (course.chapters) {
                setChapters({type: "SET_CHAPTER", payload: course.chapters})
            }
        }, [course])


  return (
    <>
        <div className='card shadow-lg border-0 mt-4'>
            <div className='card-body p-4'>
                <div className='d-flex'>

                    <div className='d-flex justify-content-between w-100'>
                        <h4 className='h5 mb-3' >Chapters</h4>
                        <Link onClick={() => handleShowLessonModal()}><FaPlus size={12}/><strong>Add Lesson</strong></Link>
                    </div>

                </div>
                <form className="mb-4" onSubmit={handleSubmit (onSubmit)}>
                    <div className='mb-3'>
                            <input 
                            {
                                ...register("chapter", {
                                    required: "The Chapter field is required."
                                })
                            }
                            type="text" 
                            className={`form-control ${errors.chapter && 'is-invalid'} ` }
                            placeholder='chapter' />
                            {
                                errors.chapter && <p className="invalid-feedback">{errors.chapter.message}</p>
                            }
                    </div>
                    <button 
                        disabled={loading}
                        className='btn btn-primary'>
                        {loading == false ? 'Save' : 'Please wait...'}
                    </button>
                </form>

                 <Accordion >
                    {
                        chapters.map((chapter, index) => {
                            return(

                                    <Accordion.Item key={chapter.id} eventKey={index}>
                                        <Accordion.Header>{chapter.title}</Accordion.Header>
                                        <Accordion.Body>
                                            <div className='d-flex'>
                                                <button 
                                                onClick={() => deleteChapter(chapter.id)}
                                                className='btn btn-danger btn-sm'>Delete Chapter</button>
                                                <button 
                                                    onClick={()=> handleShow(chapter)}
                                                className='btn btn-primary btn-sm ms-2'>Update Chapter</button>
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
     
                            )
                        })
                    }
    </Accordion>
            </div>
        </div>
        <UpdateChapter
            chapterData = {chapterData}
            showChapter={showChapter}
            handleClose={handleClose}
            setChapters={setChapters}
        />

        <CreateLesson
            showLessonModal={showLessonModal}
            handleCloseLessonModal={handleCloseLessonModal}
            course={course}
        />
    </>
  )
}

export default ManageChapter