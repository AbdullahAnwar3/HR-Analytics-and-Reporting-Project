import React, { useState } from 'react';
import './Login.css'
import devsinc_logo from '../Assets/Devsinc_logo.png'
import user_icon from '../Assets/person.png'
import email_icon from '../Assets/email.png'
import password_icon from '../Assets/password.png'


export const Login = () => {

  const [action, setAction] = useState("Login as HR Admin");

  return (
    <>   
        <div className="realLogo-container">
            <img src={devsinc_logo} alt="Company Logo" className="realLogo" />
        </div>    
        <div className = 'container2'>
            <div className="header">
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                {action === "Login as HR Admin"?<div></div>:<div className="input">
                    <img src={user_icon} alt="" />
                    <input type="text" placeholder = "Name"/>
                </div>}

            </div>
            <div className="inputs">
                <div className="input">
                    <img src={email_icon} alt="" />
                    <input type="email" placeholder = "Email ID"/>
                </div>
            </div>    
            <div className="inputs">
                <div className="input">
                    <img src={password_icon} alt="" />
                    <input type="password" placeholder = "Password"/>
                </div>
            </div>
            <div className="forgot-password">Forgot Password? <span>Click Here!</span></div>  
            <div className="submit-container"> 
                <div className={action === "Login as Employee"?"submit gray":"submit"} onClick = {() =>{setAction("Login as HR Admin")}}>Login as HR Admin</div>
                <div className={action === "Login as HR Admin"?"submit gray":"submit"} onClick = {() =>{setAction("Login as Employee")}}>Login as Employee</div>            
            </div>            
        </div>
    </>
  )
}


