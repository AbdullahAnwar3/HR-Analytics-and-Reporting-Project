import React, { useState, useEffect} from "react";
import {useNavigate} from 'react-router-dom';

// For accessing global state for logged in users
import { useAuthorize } from "../context/hook/useAuthorization";
import { useLocation } from 'react-router-dom'

import '../styles/myaccount.css'
import '../styles/signup.css'
import 'animate.css';

// Importing icons
import * as IoIcons from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { FaAngleDown } from "react-icons/fa6";
import no_photo_icon from './Images/Profile/no-profile-img.png'

// Date formatting and antd components
import {formatDistanceToNow} from "date-fns";
import moment from 'moment';

//Importing Shared Components
import NavMenu from "./SharedComponents/navMenu";

// Importing Alerts
import Swal from "sweetalert2";

// Importing Tooltips
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';

const Record = (props)=>{

    const Navigate = useNavigate();
    const handleRecordNavigate = () => {
        Navigate('/record-manage');
    }

    try{
        const location = useLocation();
        var {email : employeeEmail} = location.state;
    }
    catch (error){

        Swal.fire({
            icon: "warning",
            title: "Please choose an employee!",
            confirmButtonColor: "#1d578a",
        }).then(function() {
            handleRecordNavigate();
        });;   

    }
    
    // userAccount object stores the current state including email, occupation, jwt
    const {userAccount} = useAuthorize();

    // Account summary states
    const [photo, setPhoto] = useState('');
    const [email, setEmail] = useState('');
    const [fname, setFName] = useState('');
    const [lname, setLName] = useState('')
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');

    const [salary, setSalary] = useState('');
    const [department, setDepartment] = useState('');

    // Record form states
    const [salaryNew, setSalaryNew] = useState('');
    const [departmentNew, setDepartmentNew] = useState('');

    const [salaryNewError, setSalaryNewError] = useState('');
    const [departmentNewError, setDepartmentNewError] = useState('');
    const [error, setError] = useState('');

    const [updateOptions, setUpdateOptions] = useState(false);
    const [dropValue, setDropValue] = useState('');
    const [updateOptionDisable, setupdateOptionDisable] = useState('option-disable');
    const [isUpdating, setUpdating] = useState(false);

    const handleUpdateOptions = () => {
        setupdateOptionDisable('');
        setUpdateOptions(true);
    }

    const options = [
        {label: 'Marketing', value:'Marketing', key: 1},
        {label: 'Finance', value:'Finance', key: 2},
        {label: 'Design', value:'Design', key: 3},
        {label: 'Sales', value:'Sales', key: 4},
        {label: 'Other', value:'Other', key: 5}
    ]

    const handleDepartmentNew = (e) => {
        setDropValue(e.target.value);
        setDepartmentNew(e.target.value);
    }

    const resetForm = () => {
        setSalaryNew('');
        setDepartmentNew('');
    
        setSalaryNewError('');
        setDepartmentNewError('');

        setupdateOptionDisable('option-disable');

        setUpdateOptions(false);
        setError('');
    }

    const handleUpdateCancel = () => {
        setUpdating(true);
        resetForm();
        setUpdating(false);
    }

    const UpdateInfo = async (e) => {

        // Prevents default action of page refresh on form submission
        e.preventDefault();

        if(!userAccount)
        {
            setError('You are not logged in');
            return;
        }
        else if(userAccount.occupation !== 'admin')
            return;

        setUpdating(true);

        setSalaryNewError('');
        setDepartmentNewError('');

        let updateList = {email : employeeEmail};
        if(salaryNew){updateList.salary=salaryNew}
        if(departmentNew){updateList.department=departmentNew}

        if(!salaryNew && !departmentNew){
            setError('No fields to update');
            setUpdating(false);
            return;
        }

        const result = await fetch('/api/account/sensitive', {
            method: 'PATCH',
            body: JSON.stringify({...updateList}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userAccount.userToken}`
            }
        })

        const resultJson = await result.json();

        if (result.ok)
        {
            if(salaryNew)
                setSalary(salaryNew);
            if(departmentNew)
                setDepartment(departmentNew);

            resetForm();

            Swal.fire({
                icon: "success",
                title: "Employee Info Updated!",
                confirmButtonColor: "#1d578a",
            });

            setUpdating(false);
        }
        else
        {
            setError(resultJson.error);

            if(resultJson.errorList)
            {
                if (resultJson.errorList.salary)
                    setSalaryNewError(resultJson.errorList.salary);

                if (resultJson.errorList.department)
                    setDepartmentNewError(resultJson.errorList.department);
            }
            setUpdating(false);
        }
    }

    // Use effect hook only run once initially when the page in rendered.
    useEffect(() => {
        const fetchProfile = async () => {
            const result = await fetch('/api/account//profile', {
                method: 'POST',
                body: JSON.stringify({email : employeeEmail}),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userAccount.userToken}`
                }
            });
    
            // Parsing json results as array of objects.
            const resultJson = await result.json();
    
            if (result.ok)
            {
                if (resultJson.photo){
                    setPhoto(resultJson.photo);
                }
                setEmail(resultJson.email);
                setFName(resultJson.fname);
                setLName(resultJson.lname);
                setDob(moment(resultJson.dob).format('YYYY/MM/DD'))
                setGender(resultJson.gender);
                setSalary(resultJson.salary);
                setDepartment(resultJson.department);
            }

            console.log(resultJson);
        }
           
        if(userAccount)
            fetchProfile();
            
    }, [userAccount, employeeEmail]);

    // Tooltip style
    const style = { backgroundColor: "#cbd6e2", color: "#222", fontSize: "13px", fontWeight: "normal" };

    return (   
        <div className="recordpage">

            {/* Main Nav Bar */}
            <NavMenu isAdmin={true} breadcrum="Employee Account" pagePath="/employee-account"/>

            <div className="account-wrapper animate__animated animate__fadeInUp">
                {/* Account Details */}
                <span className="account-summary">
                    {photo && <img src={photo} alt="Profile" />}
                    {!photo && <img src={no_photo_icon} alt="No Profile" />}
                    <span className="account-summary-profile">
                        <p className="account-profile-name">{fname + ' ' + lname}</p>
                        <p>{email}</p>
                        <p className="employee-p-wrapper">
                            {gender === 'male' ? <IoIcons.IoIosMale className="employee-gender-icon"/> : <IoIcons.IoIosFemale className="employee-gender-icon"/>}
                            {dob && formatDistanceToNow(new Date(dob), {addSuffix : false})} old
                        </p>
                    </span>
                    <span className="account-summary-work">
                        <div className="account-work-unit work-unit-top">Department:<span>{department}</span></div>
                        <div className="account-work-unit work-unit-bottom">salary:<span>{salary}</span></div>
                    </span>
                </span>

                {/* Update Form */}
                <form className="employee-record-form" onSubmit={UpdateInfo}>
                    <h1 className="employee-record-heading">
                        Employee Info
                        {!updateOptions && <MdEdit data-tooltip-id="edit" data-tooltip-content="Edit info" onClick={handleUpdateOptions} className="form-edit-icon"/>}
                        <Tooltip id="edit" place="left" style={style}/>
                    </h1>
                    <div className="signup-form-unit employee-form-unit">
                        <label>Department</label>
                        <span className="absolute-icon-wrapper">
                            <select 
                                disabled={!updateOptions} 
                                className={departmentNewError ? 'field-error dep-drop employee-form-unit' : updateOptionDisable + ' dep-drop employee-form-unit'} 
                                onChange={handleDepartmentNew}
                                value={dropValue}
                            >
                                <option hidden className='default-dep-drop'>{department}</option>
                                {options.map(option => (
                                    <option key={option.key} value={option.value}>
                                    {option.label}
                                    </option>
                                ))}
                            </select>
                                {updateOptions && <FaAngleDown className="drop-icon" />}
                            </span>
                        {departmentNewError && <div className="error-text">{departmentNewError}</div>}
                    </div>
                    <div className="signup-form-unit employee-form-unit">
                            <label>Salary</label>
                            <input
                                type="number"
                                placeholder={salary} 
                                min="0"
                                onChange={(e) => setSalaryNew(e.target.value)} 
                                value={salaryNew} 
                                disabled={!updateOptions} 
                                className={salaryNewError ? 'field-error' : updateOptionDisable} 
                            />
                            {salaryNewError && <div className="error-text">{salaryNewError}</div>}
                        </div>

                    {updateOptions && <div className="info-btn-update signup-btn update-btn-margin">
                        <button disabled={isUpdating} className="password-btn-update">Save</button>
                        <button type="button" disabled={isUpdating} onClick={handleUpdateCancel} className="password-btn-cancel">Cancel</button>
                    </div>}
                    {error && <div className="signup-error error-update-margin">{error}</div>}
                </form>
            </div>

        </div>


    )
}

export default Record