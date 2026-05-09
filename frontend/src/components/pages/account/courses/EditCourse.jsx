import React, { useEffect, useState } from 'react'
import Layout from '../../../common/Layout'
import { Link, useNavigate } from 'react-router-dom'
import UserSidebar from '../../../common/UserSidebar'
import { useForm } from 'react-hook-form'
import { apiUrl, token } from '../../../common/config'
import toast from 'react-hot-toast'

const EditCourse = () => {

    const { register, handleSubmit, formState: {errors}} = useForm();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [levels, setLevels] = useState([]);
    const [languages, setLanguages] = useState([]);

    const onSubmit = async (data) =>{
         await fetch(`${apiUrl}/courses`, {
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
            
            if (result.status == 200){
                toast.success(result.message);
                 navigate('/account/courses/edit/'+result.data.id);
            } else {
               toast.error(result.message);
             }
        });
    }

    const courseMetaData = async () => {
        await fetch(`${apiUrl}/courses/meta-data`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json',
                'Authorization' : `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(result => {
            // console.log(result);
            if (result.status == 200){
                // toast.success(result.message);
                setCategories(result.categories);
                setLevels(result.levels);
                setLanguages(result.languages);
                // navigate('/account/courses/edit/'+result.data.id);
            } else {
            //    toast.error(result.message);
            console.log("something went wrong");
             }
        });
    }

    useEffect(() => {
        courseMetaData();
    },[])

  return (
    <Layout>
        <section className='section-4'>
             <div className='container pb-5 pt-3'>
				<nav aria-label="breadcrumb">
					<ol className="breadcrumb">
						<li className="breadcrumb-item"><Link to="/account">Account</Link></li>
						<li className="breadcrumb-item active" aria-current="page">Edit Course</li>
					</ol>
				</nav>
                <div className='row'>
                    <div className='col-md-12 mt-5 mb-3'>
                        <div className='d-flex justify-content-between'>
                            <h2 className='h4 mb-0 pb-0'>Edit Course</h2>
                        </div>
                    </div>
                    <div className='col-lg-3 account-sidebar'>
                        <UserSidebar/>
                    </div>
                    <div className='col-lg-9'>
                        <div className='row'>

                            <div className='col-md-7'>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className='card-border-0 shadow-lg'>
                                        <div className='card-body p-4'>
                                            <h4 className='h5 border-bottom pb-3 mb-3'>Course Details</h4>
                                            <div className='mb-3'>
                                                <label className='form-label' htmlFor="title">Title</label>
                                                <input type="text"
                                                    {
                                                        ...register('title',{
                                                            required:"The title field is required."
                                                        })
                                                    }
                                                    className={`form-control ${errors.title && "is-invalid"}`}
                                                    placeholder='Course Title'
                                                />
                                                {
                                                    errors.title && <p className='invalid-feedback'>{errors.title.message}</p>
                                                }
                                            </div>
                                                
                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor="category">Category</label>
                                                    <select className='form-select' id='category'>
                                                        <option value="">Select Category</option>
                                                        {
                                                            categories && categories.map((category) => {
                                                                return(
                                                                <option value={category.id}> {category.name}</option>
                                                            )
                                                        })
                                                        }
                                                    </select>
                                                </div>
                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor="level">Level</label>
                                                    <select className='form-select' id='level'>
                                                        <option value="">Select Level</option>
                                                        {
                                                            levels && levels.map((level) => {
                                                                return(
                                                                <option value={level.id}> {level.name}</option>
                                                            )
                                                        })
                                                        }
                                                    </select>
                                                </div>
                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor="language">Language</label>
                                                    <select className='form-select' id='language'>
                                                        <option value="">Select Language</option>
                                                        {
                                                            languages && languages.map((language) => {
                                                                return(
                                                                <option value={language.id}> {language.name}</option>
                                                            )
                                                        })
                                                        }
                                                    </select>
                                                </div>
                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor="descrition">Description</label>
                                                    <textarea id="description" rows={5} placeholder='Description' className='form-control'></textarea>
                                                </div>

                                            <h4 className='h5 border-bottom pb-3 mb-3'>Pricing</h4>
                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor="sell-price">Sell Price</label>
                                                    <input type="text"
                                                        {
                                                            ...register('title',{
                                                                required:"The title field is required."
                                                            })
                                                        }
                                                        className={`form-control ${errors.title && "is-invalid"}`}
                                                        placeholder='Sell Price'
                                                        id='sell-price'
                                                    />
                                                    {
                                                        errors.title && <p className='invalid-feedback'>{errors.title.message}</p>
                                                    }
                                                </div>

                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor="cross-price">Cross Price</label>
                                                    <input type="text"
                                                        {
                                                            ...register('title',{
                                                                required:"The title field is required."
                                                            })
                                                        }
                                                        className={`form-control ${errors.title && "is-invalid"}`}
                                                        placeholder='Cross Price'
                                                        id='cross-price'
                                                    />
                                                    {
                                                        errors.title && <p className='invalid-feedback'>{errors.title.message}</p>
                                                    }
                                                </div>


                                            <button className='btn btn-primary'>Update</button>
                                        </div>
                                    </div>

                                </form>
                            </div>
                            <div className='col-md-5'>

                            </div>


                            
                        </div>
                    </div>
                </div>
            </div>
        </section> 

    </Layout>
  )
}

export default EditCourse
