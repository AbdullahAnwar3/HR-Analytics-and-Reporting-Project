import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"
import axios from 'axios';

import './Login.css';
import devsinc_logo from '../Assets/Devsinc_logo.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';
// import { employeesData } from '../../data';

const Login = () => {
  
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:8000/", { email, password });
      
      if (response.data === "exist") {
        navigate("/EmployeePortal",{state:{id:email}})
      } else if (response.data === "notexist") {
        setError("Either email or password is incorrect");
      } else {
        console.log("Unexpected response data:", response.data);
        setError("An error occurred while logging in");
      }
    } catch (error) {
      console.error("Error occurred during login:", error);
      setError("An error occurred while logging in");
    }
  };
  
  
  
  
  


  return (
    <div className='bodyLogin'>
      <div className="realLogo-container">
        <img src={devsinc_logo} alt="Company Logo" className="realLogo" />
      </div>
      <div className='container2'>
        <div className="header">
          <div className="text">Login</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          <div className="input">
            <img src={email_icon} alt="" />
            <input type="email" placeholder="Email ID" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <div className="inputs">
          <div className="input">
            <img src={password_icon} alt="" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>
        <div className="forgot-password">Forgot Password? <span>Click Here!</span></div>
        <div className={`error ${error && error.length > 0 ? 'error-red' : ''}`}>{error}</div>
        <div className="submit-container">
          <button className="submit" onClick={handleLogin}>Login</button>
        </div>
      </div>
    </div>
  )
}

export default Login;
