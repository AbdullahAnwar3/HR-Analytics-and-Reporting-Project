// import React from "react";
// import { useLocation } from 'react-router-dom';

// function EmployeePortal() {
//     const location = useLocation();

//     return (
//         <div className="homepage">
//             <h1>Hello {location.state.id} and welcome to the home</h1>
//         </div>
//     );
// }

// export default EmployeePortal;



import React from 'react';
import { useLocation } from 'react-router-dom';
import './EmployeePortal.css';
import devsinc_logo from '../Assets/Devsinc_logo.png'

function EmployeePortal() {
  const location = useLocation();
  return (
    <>
        <div className ='bodyEmployee'>   
            <div className="logContainer">
                <img src={devsinc_logo} alt="Company Logo" className="logeCont" />
            </div> 
            <div className="admin-portal">
            <div className="header2">
                <h1 style={{ color: 'white' }}>Employee Portal</h1>
            </div>
            <nav className="menu-bar">
                <button className="menu-button">Apply for leave</button>
                <button className="menu-button">Feedback</button>
                <button className="menu-button">Courses</button>
                <button className="menu-button">Chat</button>
                <button className="menu-button">Payroll Info</button>
            </nav>
            </div>
            <div className="welcome-message">
                <span role="img" aria-label="rocket">🚀</span> Hey {location.state.id}! Welcome to Your Space! Apply for leave, give feedback, learn, or chat – all in a day's work
            </div>            
        </div> 
    </>
  );
}

export default EmployeePortal;
