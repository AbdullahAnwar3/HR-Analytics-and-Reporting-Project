import React, { useState, useEffect} from "react";

// For accessing global state for logged in users
import { useAuthorize } from "../context/hook/useAuthorization";

import '../styles/leave.css'
import 'animate.css';

// Importing icon images to be used in leave cards
import * as IoIcons from "react-icons/io";
import * as Io5Icons from "react-icons/io5";
import * as CgIcons from "react-icons/cg";
import * as BsIcon from "react-icons/bs";
import { FaAngleDown } from "react-icons/fa6";

import no_result_icon from './Images/Record/no-result-img.png'
import no_photo_icon from './Images/Profile/no-profile-img.png'

//Importing Shared Components
import NavMenu from "./SharedComponents/navMenu";
import LoadingIcon from "./SharedComponents/loading";
import {downloadBase64} from "./SharedComponents/base64";

// Importing Alerts
import Swal from "sweetalert2";

// Date formatting and antd components
import {format, formatDistanceToNow} from "date-fns";
import {DatePicker} from "antd";
import moment from 'moment';

const ManageLeave = (prop)=>{
    
    // userAccount object stores the current state including email, occupation, jwt
    const {userAccount} = useAuthorize();

    const [leaves, setLeaves] = useState(null);
    const [leaveExist, setExist] = useState(true);

    const [email, setEmail] = useState('');
    const [inputText, setText] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [standing, setStanding] = useState('pending');
    const [sort, setSort] = useState(null);
    const [emailResponse, setResponse] = useState('');
    const [emailRequestSubmit, setSubmit] = useState(null);
    const [isFetching, setFetching] = useState(null);
    const [isLoading, setIsLoading] = useState(null);

    const options = [
        {label: 'Pending', value:'pending', key: 1},
        {label: 'Accepted', value:'accepted', key: 2},
        {label: 'Rejected', value:'rejected', key: 3},
        {label: 'All', value:'all', key: 4},
    ]

    const fetchFilteredLeave = async (LeaveFilter) => {
        setFetching(true);
        const result = await fetch('/api/leave/', {
            method: 'POST',
            body: JSON.stringify({...LeaveFilter}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userAccount.userToken}`
            }
        });
        
        const resultJson = await result.json();
        console.log(resultJson);

        if (result.ok)
        {
            setLeaves(resultJson);
            if(resultJson.length !== 0)
                setExist(true);
            else
                setExist(false);

        }

        setFetching(null);
    }

    // Use effect hook only run once initially when the page in rendered.
    useEffect(() => {   
        
        const fetchDefault = async (defaultFilter) => {
            setFetching(true);
            const result = await fetch('/api/leave/', {
                method: 'POST',
                body: JSON.stringify({...defaultFilter}),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userAccount.userToken}`
                }
            });

            const resultJson = await result.json();
            console.log(resultJson);
            if (result.ok)
            {
                setLeaves(resultJson);
                if(resultJson.length !== 0)
                    setExist(true);
                else
                    setExist(false);
            }
            setFetching(null);  
        }

         
        if(userAccount && userAccount.occupation === 'admin')
            fetchDefault({email, createdAt, standing, sort});
            
    }, [userAccount, email, createdAt, standing, sort]);

    const setSortOldest = () => {
        if(!userAccount)
            return;
        else if(userAccount.occupation !== 'admin')
            return;

        if(sort)
        {
            setSort(null);
            fetchFilteredLeave({email, createdAt, standing, sort : null});
        }
    }

    const setSortNewest = async () => {
        if(!userAccount)
            return;
        else if(userAccount.occupation !== 'admin')
            return;

        if(!sort)
        {
            setSort(true);
            fetchFilteredLeave({email, createdAt, standing, sort : true});
        }
    }

    const handleFilterStatus = (e) => {
        if(!userAccount)
            return;
        else if(userAccount.occupation !== 'admin')
            return;

        if(e.target.value === 'all')
        {
            setStanding('');
            fetchFilteredLeave({email, createdAt, standing : '', sort})
        }
        else
        {
            setStanding(e.target.value);
            fetchFilteredLeave({email, createdAt, standing : e.target.value, sort})
        }
    }

    const handleDateFilter = async (date, dateString) => {
        if(!userAccount)
            return;
        else if(userAccount.occupation !== 'admin')
            return;
        if(date)
        {
            const cDate = moment(dateString).format('YYYY/MM/DD');
            setCreatedAt(cDate);
            console.log(cDate);
            fetchFilteredLeave({email, createdAt : cDate, standing, sort})    
        }
        else
        {
            setCreatedAt('');
            fetchFilteredLeave({email, standing, sort}) 
        }
    }

    const handleFilterEmail = async (e) => {

        // Prevents default action of page refresh on form submission
        e.preventDefault();

        if(!userAccount)
            return;
        else if(userAccount.occupation !== 'admin')
            return;

        setSubmit(true);
        setIsLoading(true);

        if (!inputText){
            setEmail('');
            await fetchFilteredLeave({createdAt, standing, sort});
            return;
        }

        const result = await fetch('/api/leave/email', {
            method: 'POST',
            body: JSON.stringify({email : inputText}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userAccount.userToken}`
            }
        });
        
        const resultJson = await result.json();

        if (result.ok)
        {
            setEmail(inputText);
            console.log('inputText is :',inputText)
            await fetchFilteredLeave({email :inputText, createdAt, standing, sort});
            setResponse(resultJson.mssg);
            setIsLoading(false);
        }
        else
        {
            setResponse(resultJson.error);
            setIsLoading(false);
        }
    }

    const handleClearEmail = async () => {
        setIsLoading(true);
        setText('');
        setSubmit(false);
        setEmail('')
        await fetchFilteredLeave({email :'', createdAt, standing, sort});
        setIsLoading(false);
    }

    const handleInputBox = async (e) => {
        setText(e.target.value);
        setResponse(null); 
        setSubmit(false);
        if(e.target.value === '')
        {
            setEmail('');
            fetchFilteredLeave({email :'', createdAt, standing, sort});
        }
    }

    const handleUpdateLeave = async (id, leaveStatus) => {
        if(!userAccount)
            return;
        else if(userAccount.occupation !== 'admin')
            return;

        let cancelOperation = false;

        if(leaveStatus === 'accepted')
        {
            await Swal.fire({
                title: "Are you sure?",
                text: "Accept this request?",
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
        }
        else if(leaveStatus === 'rejected')
        {
            await Swal.fire({
                title: "Are you sure?",
                text: "Reject this request?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#1d578a",
                confirmButtonText: "Yes",
                }).then((result) => {
                if (!result.isConfirmed) {
                    cancelOperation = true
                }
                });
        }

        if (cancelOperation) {return;}

        const result = await fetch('/api/leave/' + id, {
            method: 'PATCH',
            body: JSON.stringify({standing : leaveStatus}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userAccount.userToken}`
            }
        })

        const resultJson = await result.json();

        if (result.ok)
        {
            console.log("Leave request Updated: ",resultJson);
            if (leaveStatus === 'accepted')
            {
                Swal.fire({
                    title: "Leave Request Accepted!",
                    confirmButtonColor: "#1d578a",
                });
            }
            if (leaveStatus === 'rejected')
            {
                Swal.fire({
                    title: "Leave Request Rejected!",
                    confirmButtonColor: "#1d578a",
                });
            }
            fetchFilteredLeave({email, createdAt, standing, sort})
        }
        else
        {
            Swal.fire({
                icon: "error",
                title: "Error occured while updating request status!",
                confirmButtonColor: "#1d578a",
            });
            fetchFilteredLeave({email, createdAt, standing, sort});
        }

    }

    return (   
        <div className="leavepage">

            {/* Main Nav Bar */}
            <NavMenu isAdmin={true} breadcrum="Leave" pagePath="/leave-manage"/>
            
            {/* Leave Add Form */}
            <div className="leave-management">
                <div className="leave-form-wrapper">
                    <div className="leave-search-form">
                        <div className="leave-form-search-secondary">
                            <h1 className="leave-heading leave-area-heading">Search Leave Request</h1>
                            <div className="leave-form-unit leave-area-sort">
                                <label>Sort By</label>
                                <div className="sort-wrapper"> 
                                    <button type="button" 
                                        className={!sort ? 'sort-selection' : ''} 
                                        onClick={setSortOldest}
                                    >
                                        Oldest
                                    </button>
                                    <button type="button"
                                        className={sort ? 'sort-selection' : ''}  
                                        onClick={setSortNewest}
                                    >
                                        Newest
                                    </button>
                                </div>
                            </div>
                            <div className="leave-form-unit leave-area-status">
                                <label>Status</label>
                                <span className="absolute-icon-wrapper">
                                    <select 
                                        className="search-unit cursor-pointer"  
                                        onChange={handleFilterStatus}
                                    >
                                        {options.map(option => (
                                            <option key={option.key} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                        <FaAngleDown className="drop-icon" />
                                    </span>
                            </div>
                            <div className="leave-form-unit leave-area-date">
                                <label>Date Requested</label>
                                <DatePicker
                                    className="search-unit"
                                    disabledDate={(current) => current.isBefore('2024/01/01')}
                                    onChange={handleDateFilter}
                                />
                            </div>
                            <div className="leave-form-unit leave-area-email">
                                <label>Email</label>
                                <form className="absolute-icon-wrapper" onSubmit={handleFilterEmail}>
                                    <input 
                                        type="text" 
                                        onChange={handleInputBox}
                                        value={inputText}
                                        className="search-unit"
                                    />
                                    {!emailRequestSubmit && inputText && <button disabled={isLoading}>
                                        <Io5Icons.IoSearch className="checkmark-icon" />
                                    </button>}
                                    {emailRequestSubmit && inputText && <button disabled={isLoading} type="button" 
                                    onClick={handleClearEmail}>
                                        <IoIcons.IoMdCloseCircle  className="checkmark-icon clear-icon" />
                                    </button >}

                                </form>
                                {emailResponse && inputText && <div className="email-search-response">{emailResponse}</div>}
                            </div>
                            {/* {error && <div className="leave-submit-error">{error}</div>} */}
                        </div>
                    </div>
                </div>
                

                {/* Leave Cards */}
                <div className="leaves">
                    {isFetching && <LoadingIcon />}
                    {!leaveExist && !isFetching &&
                        <div className="no-leaves no-leaves-manage animate__animated animate__bounce">
                            <img src={no_result_icon} alt="Results None" />
                            <h2>No Results</h2>
                        </div>
                    }
                    {leaves && !isFetching && leaves.map((leave) => (
                        <div key={leave._id} className="leave-card animate__animated animate__fadeInUp">
                            <div className="leave-card-delete-wrapper">
                            {leave.standing !== 'accepted' && leave.standing!== 'rejected' &&
                                <span>
                                    <IoIcons.IoMdCloseCircle 
                                        className="leave-card-delete-icon icon-reject" 
                                        onClick={()=>handleUpdateLeave(leave._id,'rejected')} 
                                    />
                                    <IoIcons.IoMdCheckmarkCircle 
                                        className="leave-card-delete-icon icon-accept" 
                                        onClick={()=>handleUpdateLeave(leave._id,'accepted')} 
                                    />
                                </span>
                            }
                            </div>
                            <ul className="leave-card-content-wrapper">
                                <li>
                                    {leave.profile[0].photo && <img src={leave.profile[0].photo} alt="Profile" />}
                                    {!leave.profile[0].photo && <img src={no_photo_icon} alt="No Profile" />}
                                </li>
                                <li >
                                    <div className="leave-cotent-profile">
                                        <label>Email:</label>
                                        <p>{leave.email_id}</p>
                                    </div>
                                    <div className="leave-cotent-profile">
                                        <label>Name:</label>
                                        <p className="leave-profile-name">{leave.profile[0].fname} {leave.profile[0].lname}</p>
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
                                            <CgIcons.CgAttachment 
                                                className="attach-icon"
                                                onClick={() => {downloadBase64(leave.attachment)}} 
                                            />
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

export default ManageLeave