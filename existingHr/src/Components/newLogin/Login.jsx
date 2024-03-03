//importing React, some hooks for navigation etc, and axios for making HTTP requests
import React, { useState } from 'react'; 
import { useNavigate } from "react-router-dom"; 
import axios from 'axios'; 

import './Login.css'; // CSS file for styling
import devsinc_logo from '../Assets/Devsinc_logo.png'; // Company logo image
import email_icon from '../Assets/email.png'; 
import password_icon from '../Assets/password.png'; 

// This is the Login component responsible for handling user login
const Login = () => {
  
  const navigate = useNavigate(); // We are initializing the useNavigate hook for navigation
  // Defining states for email input, password input, and error message
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [error, setError] = useState(''); 

  // Function to handle login process
  const handleLogin = async () => {
    try {
      // Sending login credentials to the server for verification
      const response = await axios.post("http://localhost:8000/", { email, password });
      
      // Handling response from the server
      if (response.data === "exist") { // If login is successful
        navigate("/EmployeePortal",{state:{id:email}}) // Navigating to EmployeePortal page with user's email ID
      } else if (response.data === "notexist") { // If login credentials are incorrect
        setError("Either email or password is incorrect"); // Setting error message
      } else { // If an unexpected response is received
        console.log("Unexpected response data:", response.data); 
        setError("An error occurred while logging in"); 
      }
    } catch (error) { // If an error occurs during the login process
      console.error("Error occurred during login:", error); // Logging the error
      setError("An error occurred while logging in"); 
    }
  };
  
  // JSX structure for the Login component
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

export default Login; // Exporting the Login component as default







