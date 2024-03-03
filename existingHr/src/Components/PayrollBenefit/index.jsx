import React from 'react';
import './styles.css'; 
import devsinc_logo from '../Assets/Devsinc_logo.png';
import { employeesData } from './index.js'; 

// Identifies the logged-in employee based on a static ID for demonstration purposes
const loggedInEmployeeId = 1;
const loggedInEmployee = employeesData.find(employee => employee.id === loggedInEmployeeId);

// Displays a static leave request form for the logged-in employee, including some details
function LeaveRequestForm({ employee }) {
  return (
    <>
      <head>
        {/* Metadata and styles for the page */}
        <link rel="stylesheet" href="styles.css" />
      </head>
      <div className="realLogo-container">
        {/* Company logo display */}
        <img src={devsinc_logo} alt="Company Logo" className="realLogo" />
      </div>
      <div className="leave-request-banner">
        {/* Banner title indicating the purpose of the form */}
        <h1>Payroll and Benefit Program</h1>
      </div>

      <div className="center-wrapper">
        <div className="content-container">
          <div className="employee-details">
            {/* Displaying employee details, with some static values for demonstration */}
            <p><strong>Employee Name:</strong> {employee.firstName} {employee.lastName}</p>
            <p><strong>Position:</strong> HR Consultant</p> {/* Static position for demo */}
            <p><strong>Current Salary Package Details:</strong> Pkr. {employee.salary} (Monthly)</p>
            <p><strong>Current Benefit Program:</strong> Family Health Insurance</p> {/* Static benefits for demo */}
          </div>
        </div>
      </div>

      <footer className="footer-border"></footer>
    </>
  );
}

// Main component that passes the logged-in employee's data to the LeaveRequestForm
const App = () => <LeaveRequestForm employee={loggedInEmployee} />;

export default App;
