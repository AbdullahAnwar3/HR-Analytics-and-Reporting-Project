import React, { useState, useEffect} from "react";

// For accessing global state for logged in users
import { useAuthorize } from "../context/hook/useAuthorization";

import '../styles/courses.css'
import '../styles/surveys.css'
import 'animate.css';

// Importing icon images to be used in course cards
import * as MdIcons from "react-icons/md";
import { FiMinimize2 } from "react-icons/fi";
import survey_icon from './Images/Survey/survey-card-img2.jpg'
import no_record_icon from './Images/Record/no-record-img.png'

//Importing Shared Components
import NavMenu from "./SharedComponents/navMenu";
import LoadingIcon from "./SharedComponents/loading";

// Importing Alerts
import Swal from "sweetalert2";

//Importing socket.io
import {io} from 'socket.io-client';
const socket = io('https://hr-analytics-and-reporting-project.vercel.app',{
    reconnection: true
})

const Surveys = (prop)=>{
    
    // userAccount object stores the current state including email, occupation, jwt
    const {userAccount} = useAuthorize();

    const [surveys, setSurveys] = useState(null);
    const [surveysExist, setExist] = useState(true);

    const [title, setTitle] = useState('');
    const [description, setDescript] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(null);
    const [isFetching, setFetching] = useState(true);

    const [surveyId, setSurveyId] = useState('');
    const [showResponse, setShowResponse] = useState('');

    // State kept to highlight input tags incase of blank field.
    const [blankFields, setBlankFields] = useState([]);
    const [commentBlank, setCommentBlank] = useState([]);

    const [comment, setComment] = useState('');
    const [commentError, setCommentError] = useState('');


    // Use effect hook only run once initially when the page in rendered.
    useEffect(() => {
        const fetchSurveys = async () => {
            setFetching(true);
            const result = await fetch('https://hr-analytics-and-reporting-project.vercel.app/api/survey/', {
                headers: {
                    'Authorization': `Bearer ${userAccount.userToken}`
                }
            });
    
            // Parsing json results as array of objects.
            const resultJson = await result.json();
    
            if (result.ok)
            {
                // setSurveys(resultJson);
                // if(resultJson.length !== 0)
                //     setExist(true);
                // else
                //     setExist(false);

                    if(userAccount.occupation === 'admin')
                    {
                        setSurveys(resultJson);
                        if(resultJson.length !== 0){
                            setExist(true);
                        }
                        else{
                            setExist(false);
                        }
                    }
                    else
                    {
                        let visibleSurveys = [];
                        for(let i=0; i < resultJson.length; i++)
                        {
                            if(resultJson[i].visibility === 'true')
                                visibleSurveys.push(resultJson[i]);
                        }
                        setSurveys(visibleSurveys);
                        if(visibleSurveys.length === 0){
                            setExist(false);
                        }
                        else{
                            setExist(true);
                        }
                    }
            }

            setFetching(false);
        }
           
        if(userAccount)
            fetchSurveys();
            
    }, [userAccount]);

    useEffect(()=>{
        socket.on('surveys-update', (newSurveyAll)=>{
            if(userAccount.occupation === 'admin')
            {
                setSurveys(newSurveyAll);
                if(newSurveyAll.length === 0){
                    setExist(false);
                }
                else{
                    setExist(true);
                }
            }
            else
            {
                let visibleSurveys = [];
                for(let i=0; i < newSurveyAll.length; i++)
                {
                    if(newSurveyAll[i].visibility === 'true')
                        visibleSurveys.push(newSurveyAll[i]);
                }
                setSurveys(visibleSurveys);
                if(visibleSurveys.length === 0){
                    setExist(false);
                }
                else{
                    setExist(true);
                }
            }
        })

    }, []);

    const handleNewSurvey = async (e) => {

        // Prevents default action of page refresh on form submission
        e.preventDefault();

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

        setIsLoading(true);

        if((!title || title.trim().length === 0) || (!description || description.trim().length === 0)){
            setBlankFields([]);
            setError('Please fill out all the fields');
            let emptyfields = []
            if(!title || title.trim().length === 0){
                emptyfields.push('Title');
            }
            if(!description || description.trim().length === 0){
                emptyfields.push('Description');
            }
            setBlankFields(emptyfields);
            setIsLoading(false);
            return;
        }

        const newSurvey = {title, description};

        const result = await fetch('https://hr-analytics-and-reporting-project.vercel.app/api/survey/', {
            method: 'POST',
            body: JSON.stringify(newSurvey),
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
            console.log("New survey added: ",resultJson);
            Swal.fire({
                icon: "success",
                title: "New Survey Added!",
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

    const handleDeleteSurvey = async (id) => {
        if(!userAccount)
            return;
        else if(userAccount.occupation !== 'admin')
            return;

        let cancelOperation = false;

        await Swal.fire({
            title: "Are you sure?",
            text: "Delete this survey?",
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

        const result = await fetch('https://hr-analytics-and-reporting-project.vercel.app/api/survey/' + id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${userAccount.userToken}`
            }
        })

        const resultJson = await result.json();

        if (result.ok)
        {
            console.log("Survey deleted: ",resultJson);
            Swal.fire({
                title: "Survey deleted!",
                confirmButtonColor: "#1d578a",
            });
        }
        else
        {
            console.log(resultJson.error)
        }
    }

    const handleVisibilityTrue = async (id) => {
        if(!userAccount)
            return;
        else if(userAccount.occupation !== 'admin')
            return;

        let cancelOperation = false;

        await Swal.fire({
            title: "Are you sure?",
            text: "Employees will be able to respond to this survey!",
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

        const result = await fetch('https://hr-analytics-and-reporting-project.vercel.app/api/survey/' + id, {
            method: 'PATCH',
            body: JSON.stringify({visibility : 'true'}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userAccount.userToken}`
            }
        })

        const resultJson = await result.json();

        if (result.ok)
        {
            console.log("Survey visible: ",resultJson);
            Swal.fire({
                title: "Survey is now visible to employees!",
                confirmButtonColor: "#1d578a",
            });
        }
        else
        {
            console.log(resultJson.error)
        }
    }

    const handleVisibilityFalse = async (id) => {
        if(!userAccount)
            return;
        else if(userAccount.occupation !== 'admin')
            return;

        let cancelOperation = false;

        await Swal.fire({
            title: "Are you sure?",
            text: "Employees will not be able to respond to this survey!",
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

        const result = await fetch('https://hr-analytics-and-reporting-project.vercel.app/api/survey/' + id, {
            method: 'PATCH',
            body: JSON.stringify({visibility : 'false'}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userAccount.userToken}`
            }
        })

        const resultJson = await result.json();

        if (result.ok)
        {
            console.log("Survey visible: ",resultJson);
            Swal.fire({
                title: "Survey is no longer visible to employees!",
                confirmButtonColor: "#1d578a",
            });
        }
        else
        {
            console.log(resultJson.error);
        }
    }

    const getResponseEmail = (item) => {
        return item.split(';')[0];
    }

    const getResponseComment = (item) => {
        const components = item.split(';')
        let response = '';
        for (let i = 1; i < components.length; i++){
            response = response + components[i];
        }
        return response
    }

    const displayResponse = (id) => {
        setShowResponse(true);
        setSurveyId(id);
        setComment('');
        setCommentError('');
        setCommentBlank('')
    }

    const removeResponse = (id) => {
        setShowResponse(false);
        setSurveyId(null);
        setComment('');
        setCommentError('');
        setCommentBlank('')
    }

    const handleAddComment = async(e) => {

        // Prevents default action of page refresh on form submission
        e.preventDefault();

        if(!userAccount)
        {
            setError('You are not logged in');
            return;
        }
        else if(userAccount.occupation !== 'employee')
        {
            setError('You are not an employee');
            return;
        }

        setIsLoading(true);

        if(!comment || (comment && !comment.trim())){
            setCommentError('Please fill out the comment field');
            setCommentBlank(['Response']);
            setIsLoading(false);
            return;
        }

        const result = await fetch('https://hr-analytics-and-reporting-project.vercel.app/api/survey/comment/' + surveyId, {
            method: 'PATCH',
            body: JSON.stringify({response: comment}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userAccount.userToken}`
            }
        });

        const resultJson = await result.json();
        if (result.ok)
        {
            setComment('');
            setCommentError('');
            setCommentBlank([]);
            setIsLoading(false);
        }
        else{
            setCommentError(resultJson.error);
            if(resultJson.errorFields)
            {
                setCommentBlank(resultJson.errorFields);
            }
            else
            {
                setCommentBlank([]);
            }
            setIsLoading(false);
        }

    }

    return (   
        <div className="coursespage">

            {/* Main Nav Bar */}
            <NavMenu isAdmin={userAccount.occupation === 'admin' ? true : false} breadcrum="Surveys" pagePath="/surveys"/>

            {/* Course Add Form */}
            <div className={userAccount.occupation === 'admin' ? 'course-management' : 'course-management course-access'}>
                {userAccount && userAccount.occupation === 'admin' && 
                    <div className="course-add-form survey-add-form">
                        <form onSubmit={handleNewSurvey}>
                            <h1>Add A New Survey</h1>
                            <div className="course-form-unit">
                                <label>Survey Title<span className="form-required">*</span></label>
                                <input 
                                    type="text" 
                                    onChange={(e) => setTitle(e.target.value)} 
                                    value={title} 
                                    className={blankFields.includes('Title') ? 'empty-error' : ''} 
                                />
                            </div>
                            <div className="course-form-unit">
                                <label>Survey Description<span className="form-required">*</span></label>
                                <input 
                                    type="text" 
                                    onChange={(e) => setDescript(e.target.value)} 
                                    value={description} 
                                    className={blankFields.includes('Description') ? 'empty-error' : ''} 
                                />
                            </div>
                            <button disabled={isLoading}>Add Survey</button>
                            {error && <div className="error">{error}</div>}
                        </form>
                    </div>
                }

                {/* Course Cards */}
                <div className="courses">
                    {isFetching && <LoadingIcon />}
                    {!isFetching && !surveysExist &&
                        <div className={userAccount.occupation === 'admin' ? 'no-courses animate__animated animate__fadeInUp' : 'no-courses no-courses-view  animate__animated animate__fadeInUp'}>
                            <img src={no_record_icon} alt="Record None" />
                            <h2>{userAccount.occupation === 'admin' ? 'No Surveys Added' : 'No Surveys Available'}</h2>
                        </div>
                    }
                    {!isFetching && surveysExist && surveys && surveys.map((survey) => (
                        <div key={survey._id} className="course-card animate__animated animate__fadeInUp">
                            {userAccount && userAccount.occupation === 'admin' && 
                                <div className="survey-card-delete-wrapper">
                                    {survey.visibility === 'true' && <MdIcons.MdPauseCircleOutline className="course-card-delete-icon survey-visibility-pause" onClick={()=>handleVisibilityFalse(survey._id)} />}
                                    {survey.visibility === 'false' && <MdIcons.MdOutlinePlayCircleOutline className="course-card-delete-icon survey-visibility-play" onClick={()=>handleVisibilityTrue(survey._id)} />}
                                    <MdIcons.MdDelete className="course-card-delete-icon" onClick={()=>handleDeleteSurvey(survey._id)} />
                                </div>
                            }
                            <ul className="course-card-content-wrapper">
                                <li>
                                    <img src={survey_icon} alt="Course"/>
                                </li>
                                <li>
                                    <h2 className="make-blue">{survey.title}</h2>
                                    <p>{survey.description}</p>
                                </li>
                            </ul>
                            {(surveyId !== survey._id || !showResponse) && <div className="course-card-link-wrapper">
                                <div className="survey-response-selector" onClick={()=>displayResponse(survey._id)}>{userAccount.occupation === 'admin' ? 'View Response' : 'Comment'}</div>
                            </div>}
                            {surveyId === survey._id && showResponse &&
                                <div> 
                                    <ul className="survey-response-wrapper">
                                        <div className="response-heading">Response<FiMinimize2 className="minimize" onClick={removeResponse}/></div>
                                        {survey.responses.length === 0 ? <div className="no-response-wrapper">No Response</div> :
                                            survey.responses && survey.responses.map((item, index) => (
                                                <li className="survey-response" key={index}>
                                                    <div className="response-email">{getResponseEmail(item)}</div>
                                                    <div className="response-comment">{getResponseComment(item)}</div>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                    {userAccount && userAccount.occupation === 'employee' && 
                                        <form className="comment-form" onSubmit={handleAddComment}>
                                            <div className="comment-form-unit">
                                                <input 
                                                    placeholder="Add Comment"
                                                    type="text" 
                                                    onChange={(e) => setComment(e.target.value)} 
                                                    value={comment} 
                                                    className={commentBlank.includes('Response') ? 'empty-error' : ''} 
                                                />
                                                <button disabled={isLoading}>Add</button>
                                            </div>
                                            {commentError && <div className="comment-error">{commentError}</div>}
                                        </form>
                                    }
                                </div> 
                            }
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

}

export default Surveys
