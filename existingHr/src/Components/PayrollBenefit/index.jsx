import React from 'react';
import './styles.css'; // Import your CSS file
import devsinc_logo from '../Assets/Devsinc_logo.png';

function LeaveRequestForm() {
  return (
    <>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Leave Request Form</title>
        <link rel="stylesheet" href="styles.css" />
      </head>
      <div className="realLogo-container">
        <img src={devsinc_logo} alt="Company Logo" className="realLogo" />
      </div>
      <div className="leave-request-banner">
        <h1>Payroll and Benefit Program</h1>
      </div>

      <div className="lower-border"></div>

      <div className="center-wrapper">
        <div className="content-container">
          <div className="employee-details">
            <p><strong>Employee Name:</strong> Muhammad Ahmed Wasim</p>
            <p><strong>Position:</strong> HR Consultant</p>
            <p><strong>Current Salary Package Details:</strong> Pkr. 125,000 (Monthly)</p>
            <p><strong>Last Salary Details:</strong> Pkr. 125,000 (Received on 02-01-2024)</p>
            <p><strong>Next Salary issuance Date:</strong> 02-02-2024</p>
            <p><strong>Current Benefit Program:</strong> Family Health Insurance</p>
          </div>
        </div>
      </div>

      <footer className="footer-border"></footer>
      <script src="script.js"></script>
    </>
  );
}

export default LeaveRequestForm;
