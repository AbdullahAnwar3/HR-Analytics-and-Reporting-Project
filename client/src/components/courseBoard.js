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

const CoursesBoard = (prop)=>{

    // userAccount object stores the current state including email, occupation, jwt
    const {userAccount} = useAuthorize();

    const [courses, setCourses] = useState(null);
    const [coursesExist, setExist] = useState(true);

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

        if(userAccount && userAccount.occupation === 'employee')
            fetchCourses();

    }, [userAccount])

    return (   
        <div className="coursespage">

            {/* Main Nav Bar */}
            <NavMenu breadcrum="Courses" pagePath="/courses"/>

            {/* Course Cards */}
            <div className="course-management course-access">
                <div className="courses">
                    {!coursesExist && 
                        <div className="no-courses no-courses-view">
                            <img src={no_record_icon} alt="Record None" />
                            <h2>No Courses Available</h2>
                        </div>
                    }
                    {courses && courses.map((course) => (
                        <div key={course._id} className="course-card">
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

export default CoursesBoard