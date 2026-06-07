import React, { useEffect, useState } from 'react'
import Layout from '../common/Layout'
import Course from '../common/Course'
import { apiUrl } from '../common/config';
import { useSearchParams } from 'react-router-dom';
// import { searchParams } from 'react-router-dom';

const Courses = () => {
    
    const[searchParams, setSearchParams] = useSearchParams();
    const[categories, setCategories] = useState([]);
    const[levels, setLevels] = useState([]);
    const[languages, setLanguages] = useState([]);
    const[courses, setCourses] = useState([]);
    const[loading, setLoading] = useState(true);
    const[categoryChecked, setCategoryChecked] = useState(() => {
        const category = searchParams.get('category');
        return category ? category.split(',') : [];
    });

    const handleCategoryCheck = (e) => {
        const {checked, value} = e.target;
        if(checked){
            setCategoryChecked(prev => [...prev, value]);
        }else{
            setCategoryChecked(categoryChecked.filter(id => id !== value));
        }
        
    }

    const fetchCourses = () => {
        let search =[];
        let param = '';

            if(categoryChecked.length > 0){
                search.push(['category', categoryChecked]);
            }

            if (search.length > 0) {
                param = new URLSearchParams(search);
                setSearchParams(param);
            }

        fetch(`${apiUrl}/fetch-courses?${param}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(res => res.json())
        .then(result =>{
            // console.log(result);
            if(result.status === 200){
                setCourses(result.data);
            }else{
                console.log("Something went wrong");
            }
        })
    }


    // fetch categories
    const fetchCategories = () => {
        fetch(`${apiUrl}/fetch-categories`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(res => res.json())
        .then(result =>{
            // console.log(result);
            if(result.status === 200){
                setCategories(result.data);
            }else{
                console.log("Something went wrong");
            }
        })
    }

    // fetch levels
    const fetchLevels = () => {
        fetch(`${apiUrl}/fetch-levels`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(res => res.json())
        .then(result =>{
            // console.log(result);
            if(result.status === 200){
                setLevels(result.data);
            }else{
                console.log("Something went wrong");
            }
        })
    }

    // fetch languages
    const fetchLanguages = () => {
        fetch(`${apiUrl}/fetch-languages`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(res => res.json())
        .then(result =>{
            // console.log(result);
            if(result.status === 200){
                setLanguages(result.data);
            }else{
                console.log("Something went wrong");
            }
        })
    }

    useEffect(() => {
        fetchCategories();
        fetchLevels();
        fetchLanguages();
        fetchCourses();
        // console.log(categoryChecked);
    }, [categoryChecked])

  return (
    <div>
       <Layout>
        <div className='container pb-5 pt-3'>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="#">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Courses</li>
                    </ol>
                </nav>
                <div className='row'>
                    <div className='col-lg-3'>
                        <div className='sidebar mb-5 card border-0'>
                            <div className='card-body shadow'>
                                <input type="text" className='form-control' placeholder='Search by keyword'/>
                                <div className='pt-3'>
                                    <h3 className='h5 mb-2'>Category</h3>
                                        <ul>
                                            {
                                                categories && categories.map(category =>{
                                                    return (
                                                        <li key={category.id}>
                                                            <div className="form-check">
                                                                <input 
                                                                    defaultChecked={searchParams.get('category') ? searchParams.get('category').includes(category.id) : false}
                                                                    onClick={(e) => handleCategoryCheck(e)}
                                                                    className="form-check-input" 
                                                                    type="checkbox" 
                                                                    value={category.id} 
                                                                    id={`category-${category.id}`}/>
                                                                <label className="form-check-label" htmlFor={`category-${category.id}`}>
                                                                    {category.name}
                                                                </label>
                                                            </div>
                                                        </li>
                                                    )
                                                })
                                            }

                                        
                                    </ul>
                                </div>
                                <div className='mb-3'>
                                    <h3 className='h5  mb-2'>Level</h3>
                                    <ul>
                                        {
                                            levels && levels.map(level =>{
                                                return (
                                                    <li key={level.id}>
                                                        <div className="form-check">
                                                            <input className="form-check-input" 
                                                            type="checkbox" 
                                                            value={level.id} 
                                                            id={`level-${level.id}`}/>
                                                            <label className="form-check-label" htmlFor={`level-${level.id}`}>
                                                            {level.name}
                                                            </label>
                                                        </div>
                                                    </li>
                                        
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                                <div className='mb-3'>
                                    <h3 className='h5 mb-2'>Language</h3>
                                    <ul>
                                        {
                                            languages && languages.map(language =>{
                                                return (
                                                    <li key={language.id}>
                                                        <div className="form-check">
                                                            <input className="form-check-input" 
                                                            type="checkbox" 
                                                            value={language.id} 
                                                            id={`language-${language.id}`}/>
                                                            <label className="form-check-label" htmlFor={`language-${language.id}`}>
                                                            {language.name}
                                                            </label>
                                                        </div>
                                                    </li>
                                        
                                                )
                                            })
                                        }                                   
                                    </ul>
                                </div>
                                <a href="" className='clear-filter'>Clear All Filters</a>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-9'>
                        <section className='section-3'>
                            <div className='d-flex justify-content-between mb-3 align-items-center'>
                                <div  className='h5 mb-0'>
                                    {/* 10 courses found */}
                                </div>    
                                <div>
                                    <select name="" id="" className='form-select'>
                                        <option value="0">Newset First</option>
                                        <option value="1">Oldest First</option>
                                    </select>
                                </div>
                            </div> 
                            <div className="row gy-4">   
                                {
                                    courses && courses.map(course =>{
                                        return (
                                            <Course 
                                                key={course.id}
                                                course={course}
                                                customClasses="col-lg-4 col-md-6"
                                            />
                                        )
                                    })
                                }
                                                            
                                
                            </div>
                        </section>
                    </div>
                </div>
           </div>
       </Layout>

    </div>
  )
}

export default Courses