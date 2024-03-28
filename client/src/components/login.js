import { useState } from "react"

// For updating global state when logging in
import { useAuthorize } from "../context/hook/useAuthorization";

import '../styles/login.css'

// Importing icon images to be used in NavBar
import logo from './Images/Nav/logo.png'

// Importing icons to show password visibility
import * as FiIcons from "react-icons/fi";

const Login = (prop)=>{

    const {dispatch} = useAuthorize();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [typePassword, setTypePassword] = useState('password');

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(null);

    // Function manages password visibilty
    const setShowPassword = () => {
        if(typePassword === 'password')
            setTypePassword('text');
        else
            setTypePassword('password');
    }

    // State kept to highlight input tags incase of blank field.
    const [blankFields, setBlankFields] = useState([]);

    const handleLogin = async (e) => {

        // Prevents default action of page refresh on form submission
        e.preventDefault();
    
        setIsLoading(true);

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
            // Saving web tokens and user info to local storage
            localStorage.setItem('userAccount', JSON.stringify(resultJson));

            // Updating user authorization
            dispatch({type: 'LOGIN', payload: resultJson})

            setEmail('');
            setPassword('');
            setError('');
            setBlankFields([]);
            setIsLoading(false);
        }
        else
        {
            setError(resultJson.error);
            setBlankFields(resultJson.errorFields);
            setIsLoading(false);
        }

    }

    return (   
        <div className="login">
            <div className="top-bar-login">
                <img src={logo} alt="Logo" className="bar-logo-login"/>
            </div>

            <div className="login-form-wrapper">
                <form className="login-form" onSubmit={handleLogin}>
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
                    <button disabled={isLoading} type="submit" className="login-btn-submit">Login</button>
                    {error && <div className="login-error">{error}</div>}
                </form>
            </div>
        </div>
    )
}

export default Login

