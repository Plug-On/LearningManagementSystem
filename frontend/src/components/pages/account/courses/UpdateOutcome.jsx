import React, { useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import { apiUrl, token } from '../../../common/config';
import toast from 'react-hot-toast';
import { useState } from 'react';

const UpdateOutcome = ({outcomeData,showOutcome, handleClose, outcomes, setOutcomes}) => {

    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: {errors}, reset} = useForm();

     const onSubmit = async (data) => {
        setLoading(true)
         await fetch(`${apiUrl}/outcomes/${outcomeData.id}`, {
                    method: 'PUT',
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
                        const updatedOutcomes = outcomes.map(outcome => outcome.id==result.data.id 
                            ? {...outcome, text:result.data.text}: outcome )
                        setOutcomes(updatedOutcomes)
                        toast.success(result.message)
                        
                    } else {
                    console.log("something went wrong");
                     }
                });

     }

     useEffect(() => {
        if(outcomeData) {
            reset({
                outcome: outcomeData.text
            })
        }

     },[outcomeData]);

  return (
    <>
    <Modal size='lg' show={showOutcome} onHide={handleClose}>
        <form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Header closeButton>
                <Modal.Title>Update Outcome</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='mb-3'>
                        <label htmlFor="" className='form-label'> 
                            Outcome
                        </label>
                        <input 
                            {
                                ...register('outcome', {
                                    required:'The outcome field is required.'
                                })
                            }
                            type="text" 
                            className={`form-control ${errors.outcome && 'is-invalid'} ` }
                            placeholder='Outcome'
                        />
                         {
                        errors.outcome && <p className="invalid-feedback">{errors.outcome.message}</p>
                    }
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

export default UpdateOutcome