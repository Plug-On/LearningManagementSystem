import React, { useState } from 'react'
import Layout from '../../common/Layout'
import UserSidebar from '../../common/UserSidebar'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { apiUrl, token } from '../../common/config'
import toast from 'react-hot-toast'

const ChangePassword = () => {

  const {register, handleSubmit, formState: {errors}, reset, setError, watch} = useForm()
  const [loading, setLoading] = useState(false)
  const newPassword = watch('new_password')

      const onSubmit = async(data) => {
        setLoading(true)
         await fetch(`${apiUrl}/update-password`, {
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
                        toast.success(result.message)
                        reset()
                    } else {                   
                    const errors = result.errors
                    Object.keys(errors).forEach(field => {
                        setError(field,{message: errors[field][0]})
                    })
                     }
                });


    }

  return (
     <Layout> 
      <section className='section-4'>
             <div className='container pb-5 pt-3'>
				<nav aria-label="breadcrumb">
					<ol className="breadcrumb">
						<li className="breadcrumb-item"><Link to="/account">Account</Link></li>
						<li className="breadcrumb-item active" aria-current="page">Change Password</li>
					</ol>
				</nav>
                <div className='row'>
                    <div className='col-md-12 mt-5 mb-3'>
                        <div className='d-flex justify-content-between'>
                            <h2 className='h4 mb-0 pb-0'>Change Password </h2>
                        </div>
                    </div>
                    <div className='col-lg-3 account-sidebar'>
                        <UserSidebar/>
                    </div>
                    <div className='col-lg-9'>
                        <div className='row'>
                          <div className='col-md-12'> 
                                 <div className='card p-3 border-0 shadow-lg'>
                                                    <div className='card-body'>
                                                        <form onSubmit={handleSubmit(onSubmit)}>
                                                            <div className='mb-3'>
                                                                <label className='form-label'>Old Password</label>
                                                                <input type='password' 
                                                                {
                                                                    ...register('old_password', {
                                                                        required: "The old password field is required."
                                                                    })
                                                                }
                                                                className= {`form-control ${errors.old_password && 'is-invalid'}`}
                                                                placeholder='Old Password'/>
                                                                {
                                                                    errors.old_password && <p className='invalid-feedback'>{errors.old_password?.message}</p>
                                                                }
                                                            </div>

                                                            <div className='mb-3'>
                                                                <label className='form-label'>New Password</label>
                                                                <input type='password' 
                                                                {
                                                                    ...register('new_password', {
                                                                        required: "The new password field is required."
                                                                    })
                                                                }
                                                                className= {`form-control ${errors.new_password && 'is-invalid'}`}
                                                                placeholder='New Password'/>
                                                                {
                                                                    errors.new_password && <p className='invalid-feedback'>{errors.new_password?.message}</p>
                                                                }
                                                            </div>

                                                            <div className='mb-3'>
                                                                <label className='form-label'>Confirm Password</label>
                                                                <input type='password' 
                                                                {
                                                                    ...register('confirm_password', {
                                                                        required: "Please confirm your new password.",
                                                                        validate: (value) => {
                                                                          return newPassword === value || "Password do not match with new password"

                                                                        }
                                                                    })
                                                                }
                                                                className= {`form-control ${errors.confirm_password && 'is-invalid'}`}
                                                                placeholder='Confirm Password'/>
                                                                {
                                                                    errors.confirm_password && <p className='invalid-feedback'>{errors.confirm_password?.message}</p>
                                                                }
                                                            </div>

                                                            <button disabled={loading} className='btn btn-primary'>
                                                              
                                                              {
                                                                loading ? "Please wait..." : "Change Password"
                                                              }
                                                            </button>
                                                        </form>

                                                    </div>
                                                </div>
                          </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </Layout>
  )
}

export default ChangePassword