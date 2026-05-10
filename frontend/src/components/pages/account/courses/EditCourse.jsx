import React, { useEffect, useState } from 'react'
import Layout from '../../../common/Layout'
import { Link, useNavigate, useParams } from 'react-router-dom'
import UserSidebar from '../../../common/UserSidebar'
import { useForm } from 'react-hook-form'
import { apiUrl, token } from '../../../common/config'
import toast from 'react-hot-toast'

const EditCourse = () => {
    const params = useParams();
    const { register, handleSubmit, formState: {errors}, reset} = useForm({
        defaultValues: async () => {
            await fetch(`${apiUrl}/courses/${params.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json',
                'Authorization' : `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(result => {
            //  console.log(result);
            if (result.status == 200){
                reset({
                    title: result.data.title,
                    category: result.data.category_id,
                    level: result.data.level_id,
                    languages: result.data.language_id,
                    description: result.data.description,
                    'sell-price': result.data.sell_price,
                    'cross-price': result.data.cross_price
                })
            } else {
            //    toast.error(result.message);
            console.log("something went wrong");
             }
        });
        }
    });

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
                                                    <select 
                                                        {
                                                            ...register('category',{
                                                                required:"The category field is required."
                                                            })
                                                        }
                                                        className={`form-select ${errors.category && "is-invalid"}`}
                                                        placeholder='Category'
                                                    >
                                                        <option value="">Select Category</option>
                                                        {
                                                            categories && categories.map((category) => {
                                                                return(
                                                                <option value={category.id}> {category.name}</option>
                                                            )
                                                        })
                                                        }
                                                    </select>
                                                    {
                                                        errors.category && <p className='invalid-feedback'>{errors.category.message}</p>
                                                    }
                                                </div>
                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor="level">Level</label>
                                                    <select 
                                                        {
                                                            ...register('level',{
                                                                required:"The level field is required."
                                                            })
                                                        }
                                                        className={`form-select ${errors.level && "is-invalid"}`}
                                                        placeholder='Level'
                                                    >
                                                        <option value="">Select Level</option>
                                                        {
                                                            levels && levels.map((level) => {
                                                                return(
                                                                <option value={level.id}> {level.name}</option>
                                                            )
                                                        })
                                                        }
                                                    </select>
                                                    {
                                                        errors.level && <p className='invalid-feedback'>{errors.level.message}</p>
                                                    }
                                                </div>
                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor="language">Language</label>
                                                    <select
                                                        {
                                                            ...register('language',{
                                                                required:"The language field is required."
                                                            })
                                                        }
                                                        className={`form-select ${errors.language && "is-invalid"}`} id='language' placeholder='Language'
                                                    >
                                                        <option value="">Select Language</option>
                                                        {
                                                            languages && languages.map((language) => {
                                                                return(
                                                                <option value={language.id}> {language.name}</option>
                                                            )
                                                        })
                                                        }
                                                    </select>
                                                    {
                                                        errors.language && <p className='invalid-feedback'>{errors.language.message}</p>
                                                    }
                                                </div>
                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor="description">Description</label>
                                                    <textarea
                                                        {
                                                            ...register('description')
                                                        }
                                                        className={`form-control ${errors.description && "is-invalid"}`}
                                                        id='description'
                                                        rows={5}
                                                        placeholder='Description'
                                                    ></textarea>
                                                    {
                                                        errors.description && <p className='invalid-feedback'>{errors.description.message}</p>
                                                    }
                                                </div>

                                            <h4 className='h5 border-bottom pb-3 mb-3'>Pricing</h4>
                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor="sell-price">Sell Price</label>
                                                    <input type="text"
                                                        {
                                                            ...register('sell-price',{
                                                                required:"The sell price field is required."
                                                            })
                                                        }
                                                        className={`form-control ${errors['sell-price'] && "is-invalid"}`}
                                                        placeholder='Sell Price'
                                                        id='sell-price'
                                                    />
                                                    {
                                                        errors['sell-price'] && <p className='invalid-feedback'>{errors['sell-price'].message}</p>
                                                    }
                                                </div>

                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor="cross-price">Cross Price</label>
                                                    <input type="text"
                                                        {
                                                            ...register('cross-price',{
                                                                required:"The cross price field is required."
                                                            })
                                                        }
                                                        className={`form-control ${errors['cross-price'] && "is-invalid"}`}
                                                        placeholder='Cross Price'
                                                        id='cross-price'
                                                    />
                                                    {
                                                        errors['cross-price'] && <p className='invalid-feedback'>{errors['cross-price'].message}</p>
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
