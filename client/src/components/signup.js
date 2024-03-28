import { useState } from "react";

// For accessing global state for logged in users
import { useAuthorize } from "../context/hook/useAuthorization";

import '../styles/signup.css'

// Importing icon images for question circle
import * as BsTcons from "react-icons/bs";

//Importing Shared Components
import NavMenu from "./SharedComponents/navMenu";

// Importing Alerts
import Swal from "sweetalert2";

const SignUp = (prop)=>{

    // userAccount object stores the current state including email, occupation, jwt
    const {userAccount} = useAuthorize();

    const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    const [fname, setFName] = useState('');
    const [lname, setLName] = useState('');
    const [salary, setSalary] = useState('');
    const [occupation, setOccupation] = useState('');

    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    // const [passwordError, setPasswordError] = useState('');
    const [fnameError, setFNameError] = useState('');
    const [lnameError, setLNameError] = useState('');
    const [salaryError, setSalaryError] = useState('');
    const [occupationError, setOccupationError] = useState('');

    // To highlight error by changing class in case radio option not selected
    const [occupationErrorClass, setOccupationErrorClass] = useState('radio-option');

    const [isLoading, setIsLoading] = useState(null);

    const showPageInfo = () => {
    Swal.fire({
        text: "For account creation complete the following fields. Login credentials including password will be emailed automatically.",
        confirmButtonColor: "#1d578a",
        });   
    }

    const setOccupationAdmin = () => {
        if(occupation === 'admin')
            setOccupation('');
        else
            setOccupation('admin')
    }

    const setOccupationEmployee = () => {
        if(occupation === 'employee')
            setOccupation('');
        else
            setOccupation('employee')
    }

    const handleAccountCreation = async (e) => {

        // Prevents default action of page refresh on form submission
        e.preventDefault();

        // Remove this
        // await signup(email,fname, lname, salary, occupation);

        setIsLoading(true);

        const result = await fetch('/api/signup', {
            method: 'POST',
            body: JSON.stringify({email, password: 'hassan', fname, lname, salary, occupation}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userAccount.userToken}`
            }
        })

        const resultJson = await result.json();

        if (result.ok)
        {
            setError('');
            setEmailError('');
            // setPasswordError('')
            setFNameError('');
            setLNameError('');
            setSalaryError('');
            setOccupationError('');
            setOccupationErrorClass('radio-option')

            setEmail('');
            // setPassword('');
            setFName('');
            setLName('');
            setSalary('');
            setOccupation('');

            Swal.fire({
                icon: "success",
                title: "Account Created!",
                text: "User has been emailed the account credentials.",
                confirmButtonColor: "#1d578a",
            });
            console.log(resultJson);
            setIsLoading(false);
        }
        else
        {
            setError(resultJson.error);

            if(resultJson.errorList)
            {
                if (resultJson.errorList.email)
                    setEmailError(resultJson.errorList.email);

                // if (resultJson.errorList.password)
                //     setPasswordError(resultJson.errorList.password);

                if (resultJson.errorList.fname)
                    setFNameError(resultJson.errorList.fname);

                if (resultJson.errorList.lname)
                    setLNameError(resultJson.errorList.lname);

                if (resultJson.errorList.salary)
                    setSalaryError(resultJson.errorList.salary);

                if (resultJson.errorList.occupation)
                {
                    setOccupationError(resultJson.errorList.occupation);
                    setOccupationErrorClass('radio-option-error')
                }
            }
            else
            {
                Swal.fire({
                    icon: "error",
                    text: error,
                    confirmButtonColor: "#1d578a",
                    });   
            }
            setIsLoading(false);
        }

    }

    return (   
        <div className="signup">

            {/* Main Nav Bar */}
            <NavMenu isAdmin={true} breadcrum="Add Employee" pagePath="/create-account"/>

            <div className="signup-form-wrapper">
                <form className="signup-form" onSubmit={handleAccountCreation}>
                    <h1 className="signup-heading signup-title">
                        Create Account 
                        <BsTcons.BsQuestionCircleFill className="question-icon" onClick={showPageInfo} />
                    </h1>
                    <div className="signup-form-unit signup-email">
                        <label>Email<span className="form-required">*</span></label>
                        <input 
                            type="email" 
                            onChange={(e) => setEmail(e.target.value)} 
                            value={email} 
                            className={emailError ? 'field-error' : ''} 
                        />
                        {emailError && <div className="error-text">{emailError}</div>}
                    </div>
                    {/* <div className="signup-form-unit">
                        <label>Password<span className="form-required">*</span></label>
                        <input 
                            type="password" 
                            onChange={(e) => setPassword(e.target.value)} 
                            value={password} 
                            className={passwordError ? 'field-error' : ''}  
                        />
                        {passwordError && <div className="error-text">{passwordError}</div>}
                    </div> */}
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
                    <div className="signup-form-unit signup-salary">
                        <label>Salary<span className="form-required">*</span></label>
                        <input 
                            type="text" 
                            onChange={(e) => setSalary(e.target.value)} 
                            value={salary} 
                            className={salaryError ? 'field-error' : ''} 
                        />
                        {salaryError && <div className="error-text">{salaryError}</div>}
                    </div>
                    <div className="signup-form-unit signup-occupation">
                        <label>Rank<span className="form-required">*</span></label>
                        <div className="radio-wrapper"> 
                            <button type="button" 
                                className={occupation === 'admin' ? 'radio-option-selected' : occupationErrorClass} 
                                onClick={setOccupationAdmin}>
                                Admin
                            </button>
                            <button type="button"
                                className={occupation === 'employee' ? 'radio-option-selected' : occupationErrorClass} 
                                onClick={setOccupationEmployee}>
                                Employee
                            </button>
                        </div>
                        {occupationError && <div className="error-text">{occupationError}</div>}
                    </div>
                    <button disabled={isLoading} className="signup-btn-submit signup-submit">Create</button>
                </form>
            </div>
        </div>
    )
}

export default SignUp

