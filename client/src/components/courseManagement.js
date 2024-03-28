import React, { useState, useEffect} from "react";
import { Link } from 'react-router-dom';

// For accessing global state for logged in users
import { useAuthorize } from "../context/hook/useAuthorization";

import '../styles/courses.css'

// Importing icon images to be used in course cards
import * as MdIcons from "react-icons/md";
import course_icon from './Images/Course/course-card-img.jpg'
import no_record_icon from './Images/Record/no-record-img.png'

//Importing Shared Components
import NavMenu from "./SharedComponents/navMenu";

const CoursesManage = (prop)=>{
    
    // userAccount object stores the current state including email, occupation, jwt
    const {userAccount} = useAuthorize();

    const [courses, setCourses] = useState(null);
    const [coursesExist, setExist] = useState(true);

    const [title, setTitle] = useState('');
    const [description, setDescript] = useState('');
    const [website, setWebsite] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(null);

    // State kept to highlight input tags incase of blank field.
    const [blankFields, setBlankFields] = useState([]);

    // Use effect hook only run once initially when the page in rendered.
    useEffect(() => {
        const fetchCourses = async () => {
            const result = await fetch('/api/courses/', {
                headers: {
                    'Authorization': `Bearer ${userAccount.userToken}`
                }
            });
    
            // Parsing json results as array of objects.
            const resultJson = await result.json();
    
            if (result.ok)
            {
                setCourses(resultJson);
                if(resultJson.length !== 0)
                    setExist(true);
                else
                    setExist(false);

            }

            console.log(resultJson);
        }
           
        if(userAccount && userAccount.occupation === 'admin')
            fetchCourses();
            
    }, [userAccount]);

    const handleNewCourse = async (e) => {

        // Prevents default action of page refresh on form submission
        e.preventDefault();

        setIsLoading(true);

        if(!userAccount)
        {
            setError('You are not logged in');
            return;
        }
        else if(userAccount.occupation !== 'admin')
        {
            setError('You are not an admin');
            return;
        }

        const newCourse = {title, description, website};

        const result = await fetch('/api/courses/', {
            method: 'POST',
            body: JSON.stringify(newCourse),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userAccount.userToken}`
            }
        })
        
        const resultJson = await result.json();

        if (result.ok)
        {
            setError(null);
            setBlankFields([]);
            setTitle('');
            setDescript('');
            setWebsite('')
            console.log("New course added: ",resultJson);
            setIsLoading(false);
        }
        else
        {
            setError(resultJson.error);
            if(resultJson.errorFields)
            {
                setBlankFields(resultJson.errorFields);
            }
            else
            {
                setBlankFields([]);
            }
            setIsLoading(false);
        }
        
    }

    const handleDeleteCourse = async (id) => {
        if(!userAccount)
            return;
        else if(userAccount.occupation !== 'admin')
            return;

        const result = await fetch('/api/courses/' + id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${userAccount.userToken}`
            }
        })

        const resultJson = await result.json();

        if (result.ok)
        {
            console.log("Course deleted: ",resultJson);
        }
        else
        {
            console.log(resultJson.error)
        }
    }

    return (   
        <div className="coursespage">

            {/* Main Nav Bar */}
            <NavMenu isAdmin={true} breadcrum="Courses" pagePath="/courses-manage"/>
            
            {/* Course Add Form */}
            <div className="course-management">
                <div className="course-add-form">
                    <form onSubmit={handleNewCourse}>
                        <h1>Add A New Course</h1>
                        <div className="course-form-unit">
                            <label>Course Title<span className="form-required">*</span></label>
                            <input 
                                type="text" 
                                onChange={(e) => setTitle(e.target.value)} 
                                value={title} 
                                className={blankFields.includes('Title') ? 'empty-error' : ''} 
                            />
                        </div>
                        <div className="course-form-unit">
                            <label>Course Description<span className="form-required">*</span></label>
                            <input 
                                type="text" 
                                onChange={(e) => setDescript(e.target.value)} 
                                value={description} 
                                className={blankFields.includes('Description') ? 'empty-error' : ''} 
                            />
                        </div>
                        <div className="course-form-unit">
                            <label>Course Url<span className="form-required">*</span></label>
                            <input 
                                type="text" 
                                onChange={(e) => setWebsite(e.target.value)} 
                                value={website}
                                className={blankFields.includes('Url') ? 'empty-error' : ''} 
                            />
                        </div>
                        <button disabled={isLoading}>Add Course</button>
                        {error && <div className="error">{error}</div>}
                    </form>
                </div>

                {/* Course Cards */}
                <div className="courses">
                    {!coursesExist && 
                        <div className="no-courses">
                            <img src={no_record_icon} alt="Record None" />
                            <h2>No Courses Added</h2>
                        </div>
                    }
                    {courses && courses.map((course) => (
                        <div key={course._id} className="course-card">
                            <div className="course-card-delete-wrapper">
                                <MdIcons.MdDelete className="course-card-delete-icon" onClick={()=>handleDeleteCourse(course._id)} />
                            </div>
                            <ul className="course-card-content-wrapper">
                                <li>
                                    <img src={course_icon} alt="Course"/>
                                </li>
                                <li>
                                    <h2>{course.title}</h2>
                                    <p>{course.description}</p>
                                </li>
                            </ul>
                            <div className="course-card-link-wrapper">
                                    <Link to={course.website}>Select <MdIcons.MdArrowOutward /></Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )

}

export default CoursesManage