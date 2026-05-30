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
import { HiMiniPencilSquare } from "react-icons/hi2";
import { FaTrashAlt } from "react-icons/fa";
import LessonsSort from './LessonsSort';
import SortChapters from './SortChapters';
import { RiDragMove2Fill } from "react-icons/ri";

const ManageChapter = ({course,params}) => {

    const { register, handleSubmit, formState: {errors}, reset} = useForm();
    const [loading, setLoading] = useState(false);
    const [chapterData, setChapterData] = useState([]);
    const [lessonsData, setLessonsData] = useState([]);

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

        // Sort lesson modal
        const [showLessonSortModal, setShowLessonSortModal] = useState(false);
        const handleCloseLessonSortModal = () => setShowLessonSortModal(false);
        const handleShowLessonSortModal = (lessons) => {
            setLessonsData(lessons);
            setShowLessonSortModal(true);
        }

        // Sort Chapter modal
        const [showChapterSortModal, setShowChapterSortModal] = useState(false);
        const handleCloseChapterSortModal = () => setShowChapterSortModal(false);
        const handleShowChapterSortModal = (lessons) => {
            
            setShowChapterSortModal(true);
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

         const deleteLesson = async (id) => {

            if (confirm( "Are you sure you want to delete ? ")) {
                await fetch(`${apiUrl}/lessons/${id}`, {
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
                            setChapters({type: "UPDATE_CHAPTER", payload: result.chapter})
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
                        <div >
                             <Link onClick={() => handleShowLessonModal()}><FaPlus size={12}/> <strong>Add Lesson</strong></Link>
                            
                        </div>
                       

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
                            placeholder='Add chapter' />
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
                            <div className='text-end mb-2'>
                                <Link className='mb-5 mt-5' onClick={() => handleShowChapterSortModal()}><RiDragMove2Fill /><strong> Reorder Chapters</strong></Link> 
                            </div>
                 <Accordion >
                    {
                        chapters.map((chapter, index) => {
                            return(

                                    <Accordion.Item key={chapter.id} eventKey={index}>
                                        <Accordion.Header>{chapter.title}</Accordion.Header>
                                        <Accordion.Body>

                                            <div className="row">
                                                <div className="col-md-12">

                                                    <div className='d-flex justify-content-between mb-2 mt-4'>
                                                        <h4 className='h5'>Lessons</h4>
                                                        <Link className='h6' onClick={() => handleShowLessonSortModal(chapter.lessons)} data-discover="true">
                                                            <strong>Reorder Lesson</strong>
                                                        </Link>
                                                    </div>

                                                </div>
                                                <div className="col-md-12">
                                                    {
                                                        chapter.lessons && chapter.lessons.map(lesson => {
                                                            return (
                                                            <div key={lesson.id} className='card shadow px-3 py-2 mb-2'>
                                                                <div className="row">
                                                                    <div className="col-md-7">
                                                                        {lesson.title}
                                                                    </div>

                                                                    <div className="col-md-5 text-end">
                                                                        {
                                                                            lesson.duration > 0 && <small className="fw-bold text-muted me-2">20 mins</small>
                                                                        }

                                                                        {
                                                                            lesson.is_free_preview == "yes" && <span className='badge bg-success'>Preview</span>
                                                                        }
                                                                        <Link to={`/account/courses/edit-lesson/${lesson.id}/${course.id}`} className="ms-2">
                                                                            <HiMiniPencilSquare />
                                                                        </Link>

                                                                        <Link onClick={() => deleteLesson(lesson.id)} className="ms-2 text-danger">
                                                                            <FaTrashAlt />
                                                                        </Link>
                                                                    </div>
                                                                </div>

                                                                </div>
                                                            )
                                                        })
                                                    }                                                  
                                                </div>
                                                <div className="col-md-12 mt-3">
                                                    <div className='d-flex'>
                                                        <button 
                                                        onClick={() => deleteChapter(chapter.id)}
                                                        className='btn btn-danger btn-sm'>Delete Chapter</button>
                                                        <button 
                                                            onClick={()=> handleShow(chapter)}
                                                        className='btn btn-primary btn-sm ms-2'>Update Chapter</button>
                                                    </div>
                                                </div>
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

        <LessonsSort
            showLessonSortModal ={showLessonSortModal}
            handleCloseLessonSortModal={handleCloseLessonSortModal}
            lessonsData={lessonsData}
            setChapters={setChapters}
        />


        <SortChapters
            showChapterSortModal={showChapterSortModal}
            handleCloseChapterSortModal={handleCloseChapterSortModal}
            course={course}
            setChapters={setChapters}
        />
    </>
  )
}

export default ManageChapter