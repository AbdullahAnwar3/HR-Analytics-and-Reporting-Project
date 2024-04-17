import React, { useState, useEffect} from "react";
import { Link } from 'react-router-dom';

// For accessing global state for logged in users
import { useAuthorize } from "../context/hook/useAuthorization";

import '../styles/courses.css'
import 'animate.css';

// Importing icon images to be used in course cards
import * as MdIcons from "react-icons/md";
import course_icon from './Images/Course/course-card-img.jpg'
import no_record_icon from './Images/Record/no-record-img.png'

//Importing Shared Components
import NavMenu from "./SharedComponents/navMenu";
import LoadingIcon from "./SharedComponents/loading";

// Importing Alerts
import Swal from "sweetalert2";

//Importing socket.io
import {io} from 'socket.io-client';
const socket = io('https://hr-analytics-and-reporting-project.vercel.app/',{
    reconnection: true
})

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
    const [isFetching, setFetching] = useState(true);

    // State kept to highlight input tags incase of blank field.
    const [blankFields, setBlankFields] = useState([]);

    // Use effect hook only run once initially when the page in rendered.
    useEffect(() => {
        const fetchCourses = async () => {
            setFetching(true);
            const result = await fetch('https://hr-analytics-and-reporting-project.vercel.app/api/courses/', {
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

            setFetching(false);
        }
           
        if(userAccount && userAccount.occupation === 'admin')
            fetchCourses();
            
    }, [userAccount]);

    useEffect(()=>{
        console.log('courseManagement Socket');
        socket.on('courses-update', (newCourseAll)=>{
            setCourses(newCourseAll);
            if(newCourseAll.length === 0){
                setExist(false);
            }
            else{
                setExist(true);
            }
        })

    }, []);

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

        const result = await fetch('https://hr-analytics-and-reporting-project.vercel.app/api/courses/', {
            method: 'POST',
            body: JSON.stringify(newCourse),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userAccount.userToken}`
            }
        });
        
        const resultJson = await result.json();

        if (result.ok)
        {
            setError(null);
            setBlankFields([]);
            setTitle('');
            setDescript('');
            setWebsite('')
            console.log("New course added: ",resultJson);
            Swal.fire({
                icon: "success",
                title: "New Course Added!",
                confirmButtonColor: "#1d578a",
            });
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

        let cancelOperation = false;

        await Swal.fire({
            title: "Are you sure?",
            text: "Delete this course?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#1d578a",
            confirmButtonText: "Yes",
            }).then((result) => {
            if (!result.isConfirmed) {
                cancelOperation = true;
            }
        });

        if (cancelOperation) {return;}

        const result = await fetch('https://hr-analytics-and-reporting-project.vercel.app/api/courses/' + id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${userAccount.userToken}`
            }
        })

        const resultJson = await result.json();

        if (result.ok)
        {
            console.log("Course deleted: ",resultJson);
            Swal.fire({
                title: "Course deleted!",
                confirmButtonColor: "#1d578a",
            });
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
                    {isFetching && <LoadingIcon />}
                    {!isFetching && !coursesExist && 
                        <div className="no-courses animate__animated animate__fadeInUp">
                            <img src={no_record_icon} alt="Record None" />
                            <h2>No Courses Added</h2>
                        </div>
                    }
                    {!isFetching && coursesExist && courses && courses.map((course) => (
                        <div key={course._id} className="course-card animate__animated animate__fadeInUp">
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
                                    <Link to={course.website} rel="noopener" target="_blank">Select <MdIcons.MdArrowOutward /></Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )

}

export default CoursesManage
