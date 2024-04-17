import {Link} from 'react-router-dom';
import {useState} from 'react';

import '../styles/homepage.css';
import 'animate.css';

// Importing user option images to be used in user option section of the webpage
import account_icon from './Images/Home/collection/account.png'
import dashboard_icon from './Images/Home/collection/dashboard.png'
import records_icon from './Images/Home/collection/records.png'
import signup_icon from './Images/Home/collection/signup.png'
import leave_icon from './Images/Home/collection/leave.png'
import feedback_icon from './Images/Home/collection/feedback.png'
import courses_icon from './Images/Home//collection/courses.png'
import faqs_icon from './Images/Home/collection/faqs.png'

import analytics_icon from './Images/Home/cover/analytics-green.png'

//Importing Shared Components
import NavMenu from "./SharedComponents/navMenu";
import CustomFooter from './SharedComponents/customFooter';

const Admin = (prop)=>{

    let time = new Date().toLocaleTimeString();
    const [displayTime, setDisplay] = useState(time);
    const updateDisplayTime = () => {
        time = new Date().toLocaleTimeString();
        setDisplay(time);
    }

    setInterval(updateDisplayTime, 1000);

    return (   
        <div className="homepage">
            {/* Main Nav Bar */}
            <NavMenu isAdmin={true} isHome={true} pagePath="/"/>

            {/* Cover Section */}
            <div className="cover-wrapper">
                    <img src={analytics_icon} alt="HR Cover"/>
                    <div className="digital-clock">{displayTime}</div>
            </div>

            {/* Admin Options */}
            <section className="scrolling-wrapper animate__animated animate__fadeInUp">
                <div className="tile-emp">
                    <img src={account_icon} alt="My Account"/>
                    <Link to="/account" className="form_btn">My Account</Link>
                </div>
                <div className="tile-admin">
                    <img src={dashboard_icon} alt="HR Analytics"/>
                    <Link to="/analytics" className="form_btn">HR Analytics</Link>
                </div>
                <div className="tile-admin">
                    <img src={records_icon} alt="Employee Records"/>
                    <Link to="/record-manage" className="form_btn">Employee Records</Link>
                </div>
                <div className="tile-admin">
                    <img src={signup_icon} alt="Add Employee"/>
                    <Link to="/create-account" className="form_btn">Add Employee</Link>
                </div>
                <div className="tile-admin">
                    <img src={leave_icon} alt="Leave Requests"/>
                    <Link to="/leave-manage" className="form_btn">Leave Requests</Link>
                </div>
                <div className="tile-admin">
                    <img src={feedback_icon} alt="Generate Survey"/>
                    <Link to="/surveys" className="form_btn">Generate Survey</Link>
                </div>
                <div className="tile-admin">
                    <img src={courses_icon} alt="Courses"/>
                    <Link to="/courses-manage" className="form_btn">Courses</Link>
                </div>
                <div className="tile-admin">
                    <img src={faqs_icon} alt="FAQS"/>
                    <Link to="/faqs-manage" className="form_btn">FAQS</Link>
                </div>
            </section>

            <CustomFooter/>

        </div>
    )
}

export default Admin

