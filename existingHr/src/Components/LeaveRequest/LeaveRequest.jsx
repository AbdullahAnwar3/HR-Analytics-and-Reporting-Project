import React, { useState } from 'react';
import devsinc_logo from '../Assets/Devsinc_logo.png';
import './LeaveRequest.css';
import { leaveRequestsData } from './index.js';

function LeaveRequest() {
    // State for managing leave requests and form inputs
    const [requests, setRequests] = useState(leaveRequestsData);
    const [leaveType, setLeaveType] = useState('');
    const [date, setDate] = useState('');
    const [about, setAbout] = useState('');

    // Adding a new leave request
    const handleRequest = (e) => {
        e.preventDefault();
        const newRequest = { employeeId: requests.length + 1, leaveType, date, message: about, fileAttachment: 'dummy-file.jpg' };
        setRequests([...requests, newRequest]);
        // Resetting form fields
        setLeaveType('');
        setDate('');
        setAbout('');
    };

    return (
        <>
            <div className="bodyLeave">
                <div className="realLogo-container">
                    <img src={devsinc_logo} alt="Company Logo" className="realLogo" />
                </div>

                <div className="leave-request-banner">
                    <h1>Leave Request</h1>
                </div>

                <div className="center-wrapper">
                    <div className="content-container">
                        <form onSubmit={handleRequest}>
                            {/* Leave request form fields */}
                            <div className="form-group">
                                <label htmlFor="leaveType">Leave Type</label>
                                <select id="leaveType" value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                                    <option value="sick">Sick Leave</option>
                                    <option value="annual">Annual Leave</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="date">Date</label>
                                <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="about">About</label>
                                <textarea id="about" rows="4" placeholder="About..." value={about} onChange={(e) => setAbout(e.target.value)}></textarea>
                            </div>

                            <div className="form-actions">
                                <button type="button" id="cancel">Cancel</button>
                                <button type="submit" id="request">Request</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LeaveRequest;
