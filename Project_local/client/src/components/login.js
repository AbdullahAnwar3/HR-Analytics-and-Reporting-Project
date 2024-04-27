import { useState } from "react"

// For updating global state when logging in
import { useAuthorize } from "../context/hook/useAuthorization";

import '../styles/login.css'
import '../styles/signup.css'
import '../styles/leave.css'
import 'animate.css';

// Importing icon images to be used in NavBar
import logo from './Images/Nav/logo.png'

// Importing icons to show password visibility
import * as FiIcons from "react-icons/fi";

// Importing icons for dropdown
import { FaAngleDown } from "react-icons/fa6";

// Antd components
import {DatePicker} from "antd";
import moment from 'moment';

// Loading slider
import { BarLoader } from "react-spinners";

const Login = (prop)=>{

    const {dispatch} = useAuthorize();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [typePassword, setTypePassword] = useState('password');

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(null);

    // State for user with first signin
    const [fname, setFName] = useState('');
    const [lname, setLName] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [residence, setResidence] = useState('');
    const [dropValue, setDropValue] = useState('');

    const [fnameError, setFNameError] = useState('');
    const [lnameError, setLNameError] = useState('');
    const [dobError, setDobError] = useState('');
    const [genderError, setGenderError] = useState('');
    const [residenceError, setResidenceError] = useState('');

    const [loginJson, setLoginJson] = useState('');
    const [firstLogin, setFirst] = useState(null);


    // State kept to highlight input tags incase of blank field.
    const [blankFields, setBlankFields] = useState([]);

    // To highlight error by changing class in case radio option not selected
    const [genderErrorClass, setGenderErrorClass] = useState('radio-option');

    // Function manages password visibilty
    const setShowPassword = () => {
        if(typePassword === 'password')
            setTypePassword('text');
        else
            setTypePassword('password');
    }

    const options = [
        {label: 'Punjab', value:'Punjab', key: 1},
        {label: 'Sindh', value:'Sindh', key: 2},
        {label: 'Balochistan', value:'Balochistan', key: 3},
        {label: 'Khyber Pakhtunkhwa', value:'Khyber Pakhtunkhwa', key: 4},
        {label: 'Kashmir', value:'Kashmir', key: 5}
    ]

    const setGenderMale = () => {
        if(gender === 'male')
            setGender('');
        else
            setGender('male')
    }

    const setGenderFemale = () => {
        if(gender === 'female')
            setGender('');
        else
            setGender('female')
    }

    const handleResidence = (e) => {
        setDropValue(e.target.value);
        setResidence(e.target.value);
    }

    const handleDob = async (date, dateString) => {
        if(date)
        {
            const sDate = moment(dateString).format('YYYY/MM/DD');
            setDob(sDate);
        }
        else
        {
            setDob('');
        }
    }

    const handleSetup = async (e) => {

        // Prevents default action of page refresh on form submission
        e.preventDefault();

        setIsLoading(true);

        setFNameError('');
        setLNameError('');
        setDobError('');
        setGenderError('');
        setGenderErrorClass('radio-option');
        setResidenceError('')

        const result = await fetch('/api/signup', {
            method: 'PATCH',
            body: JSON.stringify({fname, lname, dob, gender, residence}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${loginJson.userToken}`
            }
        })

        const resultJson = await result.json();

        if (result.ok)
        {
            console.log(resultJson);
            // Saving web tokens and user info to local storage
            localStorage.setItem('userAccount', JSON.stringify(loginJson));

            // Updating user authorization
            dispatch({type: 'LOGIN', payload: loginJson})

            setIsLoading(false);
        }
        else
        {
            setError(resultJson.error);

            if(resultJson.errorList)
            {
                if (resultJson.errorList.fname)
                    setFNameError(resultJson.errorList.fname);

                if (resultJson.errorList.lname)
                    setLNameError(resultJson.errorList.lname);

                if (resultJson.errorList.dob)
                    setDobError(resultJson.errorList.dob);

                if (resultJson.errorList.gender)
                {
                    setGenderError(resultJson.errorList.gender);
                    setGenderErrorClass('radio-option-error')
                }

                if (resultJson.errorList.residence)
                    setResidenceError(resultJson.errorList.residence);
            }
            setIsLoading(false);
        }

    }

    const handleLogin = async (e) => {

        // Prevents default action of page refresh on form submission
        e.preventDefault();

        setIsLoading(true);
    
        setError('');
        if(!email || !password){
            setBlankFields([]);
            setError('Please fill out all the fields');
            let emptyfields = []
            if(!email){
                emptyfields.push('Email');
            }
            if(!password){
                emptyfields.push('Password');
            }
            setBlankFields(emptyfields);
            setIsLoading(false);
            return;
        }

        const result = await fetch('/api/login/', {
            method: 'POST',
            body: JSON.stringify({email, password}),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const resultJson = await result.json();

        if (result.ok)
        {
            if(resultJson.fname)
            {
                // Saving web tokens and user info to local storage
                localStorage.setItem('userAccount', JSON.stringify(resultJson));

                // Updating user authorization
                dispatch({type: 'LOGIN', payload: resultJson})
            }
            else
            {
                setLoginJson(resultJson);
                setFirst(true);
            }
            setError('');
            setBlankFields([]);
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

    const promotion = 'Seeking to optimize your HR operations and enhance employee management efficiency? This tool is tailored to facilitate tasks such as employee onboarding, leave management, and other essential HR functions. Through this application, you can streamline processes, boost productivity, and promote seamless organizational workflows. Take advantage of this solution to experience a significant improvement in managing your HR responsibilities.'

    return (   
        <div className="login">
            {firstLogin && <div className="top-bar-login">
                <img src={logo} alt="Logo" className="bar-logo-login"/>
            </div>}

            {!firstLogin &&
            <div className="login-view-wrapper">
                <div className="login-cover">
                    <h1 className="animate__animated animate__fadeInUp">HR Management System</h1>
                    <span className="animate__animated animate__fadeInUp">{promotion}</span>
                </div>
                <div className="login-form-wrapper">
                    <div className="top-bar-login">
                        <img src={logo} alt="Logo" className="bar-logo-login"/>
                    </div>
                    <form className="login-form animate__animated animate__fadeInUp" onSubmit={handleLogin}>
                        <h1 className="login-heading">Login</h1>
                        <div className="login-form-unit">
                            <label>Email<span className="form-required">*</span></label>
                            <input 
                                type="email" 
                                onChange={(e) => setEmail(e.target.value)} 
                                value={email} 
                                className={blankFields.includes('Email') ? 'empty-error' : ''} 
                            />
                        </div>
                        <div className="login-form-unit">
                            <label>Password<span className="form-required">*</span></label>
                            <div className="password-wrapper">                   
                                <input 
                                    type={typePassword} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    value={password} 
                                    className={blankFields.includes('Password') ? 'empty-error' : ''} 
                                />
                                <button type="button" className="show-password"  onClick={setShowPassword}>
                                    {typePassword === 'password' ? <FiIcons.FiEye /> : <FiIcons.FiEyeOff /> } 
                                </button>
                            </div>     
                        </div>
                        <button disabled={isLoading} type="submit" className="login-btn-submit">
                            {
                                !isLoading ? 'Login' : <BarLoader size={20} color="white"  />
                            }
                        </button>
                        {error && <div className="login-error">{error}</div>}
                    </form>
                </div>
            </div>}

            {firstLogin &&
            <div className="signup-form-wrapper">
                <form className="signup-form animate__animated animate__fadeInUp" onSubmit={handleSetup}>
                    <h1 className="signup-heading">
                        Finish Account Setup
                    </h1>
                    <div className="signup-setup-grid">
                        <div className="signup-form-unit signup-fname">
                            <label>First Name<span className="form-required">*</span></label>
                            <input 
                                type="text" 
                                onChange={(e) => setFName(e.target.value)} 
                                value={fname} 
                                className={fnameError ? 'field-error' : ''} 
                            />
                            {fnameError && <div className="error-text">{fnameError}</div>}
                        </div>
                        <div className="signup-form-unit signup-lname">
                            <label>Last Name<span className="form-required">*</span></label>
                            <input 
                                type="text" 
                                onChange={(e) => setLName(e.target.value)} 
                                value={lname} 
                                className={lnameError ? 'field-error' : ''} 
                            />
                            {lnameError && <div className="error-text">{lnameError}</div>}
                        </div>
                        <div className="signup-form-unit signup-age">
                            <label>Date Of Birth<span className="form-required">*</span></label>
                            <DatePicker
                                disabledDate={(current) => current.isAfter(moment())}
                                className={dobError ? 'field-error signup-date-unit' : 'signup-date-unit'} 
                                // value={dob}
                                onChange={handleDob}
                            />
                            {dobError && <div className="error-text">{dobError}</div>}
                        </div>


                        <div className="signup-form-unit signup-gender">
                            <label>Gender<span className="form-required">*</span></label>
                            <div className="radio-wrapper"> 
                                <button type="button" 
                                    className={gender === 'male' ? 'radio-option-selected' : genderErrorClass} 
                                    onClick={setGenderMale}>
                                    Male
                                </button>
                                <button type="button"
                                    className={gender === 'female' ? 'radio-option-selected' : genderErrorClass} 
                                    onClick={setGenderFemale}>
                                    Female
                                </button>
                            </div>
                            {genderError && <div className="error-text">{genderError}</div>}
                        </div>
                        <div className="signup-form-unit signup-residence">
                            <label>Residence<span className="form-required">*</span></label>
                            <span className="absolute-icon-wrapper">
                                <select 
                                    className={residenceError ? 'field-error dep-drop' : 'dep-drop'} 
                                    onChange={handleResidence}
                                    value={dropValue}
                                >
                                    <option hidden></option>
                                    {options.map(option => (
                                        <option key={option.key} value={option.value}>
                                        {option.label}
                                        </option>
                                    ))}
                                </select>
                                    <FaAngleDown className="drop-icon" />
                                </span>
                            {residenceError && <div className="error-text">{residenceError}</div>}
                        </div>
                        <button disabled={isLoading} className="signup-btn-submit signup-btn">
                            {
                                !isLoading ? 'Login' : <BarLoader size={20} color="white"  />
                            }
                        </button>
                    </div>
                    {error && <div className="signup-error">{error}</div>}
                </form>
            </div>}


        </div>
    )
}

export default Login

