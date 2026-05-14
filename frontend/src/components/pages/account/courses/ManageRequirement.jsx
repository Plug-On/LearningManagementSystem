import React , {useEffect, useState} from 'react'
import { useForm } from "react-hook-form";
import { useParams , Link } from "react-router-dom";
import { apiUrl , token} from "../../../common/config";
import toast from "react-hot-toast";
import { MdDragIndicator } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";
import { FaRegTrashAlt } from "react-icons/fa";
import UpdateRequirement from './UpdateRequirement';


const ManageRequirement = () => {
    
    const [loading, setLoading] = useState(false);
    const [requirements, setRequirements] = useState([]);
    const [requirementData, setRequirementData] = useState([]);
    const { register, handleSubmit, formState: {errors}, reset} = useForm();
    const params = useParams();

     const [showRequirement, setShowRequirement] = useState(false);
    const handleClose = () => setShowRequirement(false);
    const handleShow = (requirement) => {
        setShowRequirement(true);
        setRequirementData(requirement)
    }
    
     const onSubmit = async (data) => {
        setLoading(true)
        const formData = {...data, course_id: params.id}

         await fetch(`${apiUrl}/requirements`, {
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
                        const newRequirements = [...requirements,result.data]
                        setRequirements(newRequirements)
                        toast.success(result.message)
                        reset()
                    } else {
                    //    toast.error(result.message);
                    console.log("something went wrong");
                     }
                });

     }

         const fetchRequirements = async () => {

         await fetch(`${apiUrl}/requirements?course_id=${params.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept' : 'application/json',
                        'Authorization' : `Bearer ${token}`
                    }
                })
                .then(res => res.json())
                .then(result => {
                    // console.log(result)
                    if (result.status == 200){
                        setRequirements(result.data);
                    } else {
                    console.log("something went wrong");
                     }
                });
     }


     const deleteRequirement = async (id) => {
        if (confirm("Are you sure you want to delete?")){
            await fetch(`${apiUrl}/requirements/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept' : 'application/json',
                        'Authorization' : `Bearer ${token}`
                    }
                })
                .then(res => res.json())
                .then(result => {
                    setLoading(false)
                    if (result.status == 200){
                        const newRequirements = requirements.filter(requirement => requirement.id != id)
                        setRequirements(newRequirements)
                        toast.success(result.message)
                    } else {
                    //    toast.error(result.message);
                    console.log("something went wrong");
                     }
                });
         }

     }


     useEffect(() => {
        fetchRequirements();
     },[])

  return (
    <>
    <div className='card shadow-lg border-0 mt-4'>
        <div className='card-body p-4'>
        <div className='d-flex'>
            <h4 className='h5 mb-3' >Requirement</h4>
        </div>
            <form className="mb-4" onSubmit={handleSubmit (onSubmit)}>
                <div className='mb-3'>
                        <input 
                        {
                            ...register("requirement", {
                                required: "The Requirement field is required."
                            })
                        }
                        type="text" 
                        className={`form-control ${errors.requirement && 'is-invalid'} ` }
                        placeholder='Requirement' />
                        {
                            errors.requirement && <p className="invalid-feedback">{errors.requirement.message}</p>
                        }
                </div>
                <button 
                    disabled={loading}
                    className='btn btn-primary'>
                    {loading == false ? 'Save' : 'Please wait...'}
                </button>
            </form>
                
            {
                requirements && requirements.map(requirement => {
                    return (
                        <div key={`requirement-${requirement.id}`} className="card shadow mb-2">
                                <div className="card-body p-2 d-flex">
                                    <div><MdDragIndicator /></div>
                                    <div className="d-flex justify-content-between w-100">
                                        <div className="ps-2">
                                            {requirement.text}
                                        </div>
                                        <div className="d-flex ">
                                            <Link onClick={() => handleShow(requirement)} className="text-primary me-1">
                                                <BsPencilSquare />
                                            </Link>

                                            <Link onClick={() => deleteRequirement(requirement.id)} className="text-danger">
                                                <FaRegTrashAlt />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                    )
                })
            }


        </div>
    </div>

    <UpdateRequirement
        showRequirement={showRequirement}
        requirements={requirements}
        setRequirements={setRequirements}
        requirementData={requirementData}
        handleClose={handleClose}
    />

    </>
  )
}

export default ManageRequirement