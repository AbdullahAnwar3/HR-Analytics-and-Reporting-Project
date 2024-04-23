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

const CoursesBoard = (prop)=>{

    // userAccount object stores the current state including email, occupation, jwt
    const {userAccount} = useAuthorize();

    const [courses, setCourses] = useState(null);
    const [coursesExist, setExist] = useState(true);

    const [isFetching, setFetching] = useState(true);

    // Use effect hook only run once initially when the page in rendered.
    useEffect(() => {
        setFetching(true);

        const fetchCourses = async () => {
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
            console.log(resultJson);
            setFetching(false);
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
                    {isFetching && <LoadingIcon />}
                    {!isFetching && !coursesExist && 
                        <div className="no-courses no-courses-view animate__animated animate__fadeInUp">
                            <img src={no_record_icon} alt="Record None" />
                            <h2>No Courses Available</h2>
                        </div>
                    }
                    {!isFetching && coursesExist && courses && courses.map((course) => (
                        <div key={course._id} className="course-card animate__animated animate__fadeInUp">
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

export default CoursesBoard
