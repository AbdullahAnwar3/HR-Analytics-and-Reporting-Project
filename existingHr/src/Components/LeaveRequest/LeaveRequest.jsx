// import React, { useState, useEffect } from 'react';
import React from 'react';
import devsinc_logo from '../Assets/Devsinc_logo.png';
import './LeaveRequest.css';


function LeaveRequest() {
    return (
        <>
            <div className ='bodyLeave'>
                <div className="realLogo-container">
                    <img src={devsinc_logo} alt="Company Logo" className="realLogo" />
                </div>

                <div className="leave-request-banner">
                    <h1>Leave Request</h1>
                </div>

                <div className="center-wrapper">
                    <div className="content-container">
                        <form id="leaveRequestForm">
                            <div className="form-group">
                                <label htmlFor="leaveType">Leave Type</label>
                                <select id="leaveType" name="leaveType">
                                    <option value="sick">Sick Leave</option>
                                    <option value="annual">Annual Leave</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="date">Date</label>
                                <input type="date" id="date" name="date" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="about">About</label>
                                <textarea id="about" name="about" rows="4" placeholder="About..."></textarea>
                            </div>

                            <div className="form-group">
                                <label htmlFor="attachments">Attachments</label>
                                <input type="file" id="attachments" name="attachments" multiple />
                            </div>

                            <div className="form-actions">
                                <button type="button" id="cancel">Cancel</button>
                                <button type="submit" id="request">Request</button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* <footer className="site-footer">
                </footer> */}
            </div>
        </>
    );
}

export default LeaveRequest;
