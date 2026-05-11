import { useEffect, useState } from "react"
import React from 'react'
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { apiUrl , token} from "../../../common/config";
import toast from "react-hot-toast";


const ManageOutcome = () => {
    const [loading, setLoading] = useState(false);
    const [outcomes, setOutcomes] = useState([]);
     const { register, handleSubmit, formState: {errors}, reset} = useForm();
     const params = useParams();

     const onSubmit = async (data) => {
        setLoading(true)
        const formData = {...data, course_id: params.id}

         await fetch(`${apiUrl}/outcomes`, {
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
                        toast.success(result.message)
                        reset()
                    } else {
                    //    toast.error(result.message);
                    console.log("something went wrong");
                     }
                });

     }

    const fetchOutcomes = async () => {

         await fetch(`${apiUrl}/outcomes?course_id=${params.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept' : 'application/json',
                        'Authorization' : `Bearer ${token}`
                    }
                })
                .then(res => res.json())
                .then(result => {
                    console.log(result);
                    if (result.status == 200){
                        setOutcomes(result.data);
                    } else {
                    console.log("something went wrong");
                     }
                });
     }

     useEffect(()=> {
        fetchOutcomes()
     },[]);

  return (
    <div className='card-body p-4'>
        <div className='d-flex'>
            <h4 className='h5 mb-3' >Outcome</h4>
        </div>
        <form onSubmit={handleSubmit (onSubmit)}>
            <div className='mb-3'>
                    <input 
                    {
                        ...register("outcome", {
                            required: "The Outcome field is required."
                        })
                    }
                    type="text" 
                    className={`form-control ${errors.outcome && 'is-invalid'} ` }
                    placeholder='outcome' />
                    {
                        errors.outcome && <p className="invalid-feedback">{errors.outcome.message}</p>
                    }
            </div>
            <button 
                 disabled={loading}
                  className='btn btn-primary'>
                 {loading == false ? 'Save' : 'Please wait...'}
             </button>
        </form>

                                        
    </div>
  )
}

export default ManageOutcome