import React from 'react'
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { useParams , Link } from "react-router-dom";
import { apiUrl , token} from "../../../common/config";
import toast from "react-hot-toast";
import Accordion from 'react-bootstrap/Accordion';

const ManageChapter = ({course,params}) => {

    const { register, handleSubmit, formState: {errors}, reset} = useForm();
    const [loading, setLoading] = useState(false);

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
                        toast.success(result.message)
                        reset()
                    } else {
                    //    toast.error(result.message);
                    console.log("something went wrong");
                     }
                });

        }


  return (
    <>
        <div className='card shadow-lg border-0 mt-4'>
            <div className='card-body p-4'>
                <div className='d-flex'>
                    <h4 className='h5 mb-3' >Chapters</h4>
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
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Accordion Item #1</Accordion.Header>
                        <Accordion.Body>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                        minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                        aliquip ex ea commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                        culpa qui officia deserunt mollit anim id est laborum.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                        <Accordion.Header>Accordion Item #2</Accordion.Header>
                        <Accordion.Body>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                        minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                        aliquip ex ea commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                        culpa qui officia deserunt mollit anim id est laborum.
                        </Accordion.Body>
                    </Accordion.Item>
    </Accordion>
            </div>
        </div>
    </>
  )
}

export default ManageChapter