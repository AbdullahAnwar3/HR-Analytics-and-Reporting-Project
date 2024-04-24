import React, { useState, useEffect} from "react";

// For accessing global state for logged in users
import { useAuthorize } from "../context/hook/useAuthorization";

import '../styles/leave.css'
import 'animate.css';

// Importing icon images to be used in leave cards
import * as MdIcons from "react-icons/md";
import * as CgIcons from "react-icons/cg";
import * as BsIcon from "react-icons/bs";

import file_upload_icon from './Images/Upload/file-upload-img.png'
import no_record_icon from './Images/Record/no-record-img.png'
import no_photo_icon from './Images/Profile/no-profile-img.png'

//Importing Shared Components
import NavMenu from "./SharedComponents/navMenu";
import LoadingIcon from "./SharedComponents/loading";
import {convertToBase64, downloadBase64, validateFile} from "./SharedComponents/base64"

// Importing Alerts
import Swal from "sweetalert2";

// Loading slider
import { BarLoader } from "react-spinners";

// Date formatting and antd components
import {format, formatDistanceToNow} from "date-fns";
import {DatePicker} from "antd";
import moment from 'moment';
const {RangePicker} = DatePicker;

const ApplyLeave = (prop)=>{
    
    // userAccount object stores the current state including email, occupation, jwt
    const {userAccount} = useAuthorize();

    const [profile, setProfile] = useState(null);
    const [leaves, setLeaves] = useState(null);
    const [leaveExist, setExist] = useState(true);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [description, setDescript] = useState('');
    const [attachment, setAttachment] = useState('');
    const [attachmentName, setAttachmentName] = useState('No file selected');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(null);
    const [isFetching, setFetching] = useState(true);
    const [pickerVal, setPickerVal] = useState(null)

    // State kept to highlight input tags incase of blank field.
    const [blankFields, setBlankFields] = useState([]);

    const handleDateSelection = (leaveDates, dateString)=>{
        if(leaveDates)
        {
            setPickerVal(leaveDates);
            const sDate = moment(dateString[0]).format('YYYY-MM-DD');
            const eDate = moment(dateString[1]).format('YYYY-MM-DD');
            setStartDate(sDate);
            setEndDate(eDate);
        }
        else
        {
            setPickerVal('');
            setStartDate('');
            setEndDate('');
        }
    }

    const handleAttachmentUpload = async (e) => {
        try{
            const fileValidity = validateFile(e.target.files[0]);
            if(fileValidity !== 'Accepted')
            {
                setError(fileValidity);
                let errorFields = blankFields;
                errorFields.push('Attach');
                setBlankFields(errorFields);
                setAttachment('');
                setAttachmentName('No file selected');
                return;
            }
            {
                const attachIndex = blankFields.indexOf('Attach');
                console.log(attachIndex);
                if (attachIndex !== -1){
                    let errorFields = [];
                    for (let i = 0; i < blankFields.length; i++)
                    {
                        if(i !== attachIndex)
                            errorFields.push(blankFields[i]);
                    }
                    console.log(errorFields);
                    setBlankFields(errorFields);
                    setError('');
                }
            }

            const base64 = await convertToBase64(e.target.files[0]);
            setAttachment(base64);
            setAttachmentName(e.target.files[0].name);
        }
        catch (error){
            return;
        }
    }

    const handleAttachmentRemove = () => {
        setAttachment('');
        setAttachmentName('No file selected');
        return;
    }

    // Use effect hook only run once initially when the page in rendered.
    useEffect(() => {
        setFetching(true);

        const fetchLeave = async () => {
            const result = await fetch('/api/leave/', {
                headers: {
                    'Authorization': `Bearer ${userAccount.userToken}`
                }
            });
    
            // Parsing json results as array of objects.
            const resultJson = await result.json();
    
            if (result.ok)
            {
                setProfile(resultJson.user);
                setLeaves(resultJson.leave);
                if(resultJson.leave.length !== 0)
                    setExist(true);
                else
                    setExist(false);
            }

            setFetching(false);
        }
           
        if(userAccount && userAccount.occupation === 'employee')
            fetchLeave();
            
    }, [userAccount]);

    const handleNewLeave = async (e) => {

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

        if((!startDate || !endDate) || (!description || description.trim().length === 0)){
            setBlankFields([]);
            setError('Please fill out all the required fields');
            let emptyfields = []
            if(!startDate || !endDate){
                emptyfields.push('Date');
            }
            if(!description || description.trim().length === 0){
                emptyfields.push('Description');
            }
            setBlankFields(emptyfields);
            setIsLoading(false);
            return;
        }

        const newLeave = {startDate, endDate, description, attachment};

        const result = await fetch('/api/leave/add', {
            method: 'POST',
            body: JSON.stringify(newLeave),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userAccount.userToken}`
            }
        })
        
        const resultJson = await result.json();

        console.log(resultJson);

        if (result.ok)
        {
            setError(null);
            setBlankFields([]);
            setStartDate('');
            setEndDate('');
            setDescript('');
            setAttachment('')
            setAttachmentName('No file selected');
            setPickerVal(null);
            setExist(true);
            
            Swal.fire({
                icon: "success",
                title: "Leave Request Added!",
                confirmButtonColor: "#1d578a",
            });

            setLeaves(leaves => [resultJson, ...leaves]);
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

    return (   
        <div className="leavepage">

            {/* Main Nav Bar */}
            <NavMenu breadcrum="Leave" pagePath="/leave"/>
            
            {/* Leave Add Form */}
            <div className="leave-management">
                <div className="leave-form-wrapper">
                    <div className="leave-add-form">
                        <form onSubmit={handleNewLeave} className="leave-form-secondary">
                            <h1 className="leave-heading">Add A Leave Request</h1>
                            <div className="leave-form-unit">
                                <label>Date<span className="form-required">*</span></label>
                                <RangePicker className={blankFields.includes('Date') ? 'date-range-picker-error' : 'date-range-picker'}
                                    disabledDate={(current) => current.isBefore(moment().subtract(1,"day"))}
                                    onChange={handleDateSelection}
                                    value={pickerVal}
                            />
                            </div>
                            <div className="leave-form-unit">
                                <label>Description<span className="form-required">*</span></label>
                                <textarea
                                    className={blankFields.includes('Description') ? 'leave-textarea-error' : 'leave-textarea'}
                                    onChange={(e) => setDescript(e.target.value)} 
                                    value={description}
                                />
                            </div>
                            <div className="leave-form-unit">
                                <label>Attachment</label>
                                <div className={blankFields.includes('Attach') ? 'file-upload-area-error' : 'file-upload-area'} onClick={() => document.querySelector(".file-upload-btn").click()}>
                                    <input 
                                        onClick={(e) => {e.target.value=null}}
                                        onChange={handleAttachmentUpload} 
                                        type="file" 
                                        // accept="image/*,application/*" 
                                        className="file-upload-btn" 
                                        hidden
                                    />
                                    <img src={file_upload_icon} alt="Upload file" />
                                    <p>Browse File To Upload</p>
                                </div>
                                <div className={blankFields.includes('Attach') ? 'file-upload-status-error' : 'file-upload-status'}>
                                    <div className="filename">{attachmentName}</div>
                                    <MdIcons.MdDelete className="undo-attachment-icon" onClick={handleAttachmentRemove}/>
                                </div>
                            </div>
                            <button disabled={isLoading} type="submit" className="leave-btn-submit">
                                {
                                    !isLoading ? 'Add Requests' : <BarLoader size={20} color="white"  />
                                }
                            </button>
                            {error && <div className="leave-submit-error">{error}</div>}
                        </form>
                    </div>
                </div>
                
                {/* Leave Cards */}
                <div className="leaves">
                    {isFetching && <LoadingIcon />}
                    {!isFetching && !leaveExist && 
                        <div className="no-leaves animate__animated animate__fadeInUp">
                            <img src={no_record_icon} alt="Leave None" />
                            <h2>No Leave Request Added</h2>
                        </div>
                    }
                    {!isFetching && leaveExist && leaves && leaves.map((leave) => (
                        <div key={leave._id} className="leave-card animate__animated animate__fadeInUp">
                            <div className="leave-card-delete-wrapper"></div>
                            <ul className="leave-card-content-wrapper">
                                <li>
                                    {profile.photo && <img src={profile.photo} alt="Profile" />}
                                    {!profile.photo && <img src={no_photo_icon} alt="No Profile" />}
                                </li>
                                <li >
                                    <div className="leave-cotent-profile">
                                        <label>Email:</label>
                                        <p>{profile.email}</p>
                                    </div>
                                    <div className="leave-cotent-profile">
                                        <label>Name:</label>
                                        <p className="leave-profile-name">{profile.fname} {profile.lname}</p>
                                    </div>
                                    <div className="leave-cotent-profile">
                                        <label>Leave Dates:</label>
                                        <p className="leave-profile-date">
                                            {format(new Date(leave.startDate), "dd/MM/yyyy")}
                                            <BsIcon.BsDash className="leave-date-space-icon"/>
                                            {format(new Date(leave.endDate), "dd/MM/yyyy")}
                                        </p>
                                    </div>
                                </li>
                            </ul>
                            <div className="leave-card-description-wrapper">
                                <label>Description:</label>
                                {leave.description}
                            </div>
                            <div className="leave-card-status-wrapper">
                                <div className="leave-card-status">
                                    {leave.standing === 'accepted' && <span className="leave-card-standing-g">
                                        {leave.standing}
                                    </span>}
                                    {leave.standing === 'rejected' && <span className="leave-card-standing-r">
                                        {leave.standing}
                                    </span>}
                                    {leave.standing !== 'accepted' && leave.standing !== 'rejected' && <span className="leave-card-standing">
                                        {leave.standing}
                                    </span>}
                                    {leave.attachment &&
                                        <span className="leave-card-attach">
                                            <CgIcons.CgAttachment className="attach-icon" onClick={() => {downloadBase64(leave.attachment)}} />
                                        </span>}
                                </div>
                                <span className="distance-now">{formatDistanceToNow(new Date(leave.createdAt), {addSuffix : true})}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )

}

export default ApplyLeave
