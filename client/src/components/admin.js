import {Link} from 'react-router-dom';

import '../styles/homepage.css';
import 'animate.css';

// Importing user option images to be used in user option section of the webpage
import dashboard_icon from './Images/Home/collection/dashboard.png'
import records_icon from './Images/Home/collection/records.png'
import signup_icon from './Images/Home/collection/signup.png'
import attendance_icon from './Images/Home/collection/attendance.png'
import leave_icon from './Images/Home/collection/leave.png'
import feedback_icon from './Images/Home/collection/feedback.png'
import courses_icon from './Images/Home//collection/courses.png'
import faqs_icon from './Images/Home/collection/faqs.png'

//Importing Shared Components
import NavMenu from "./SharedComponents/navMenu";
import CustomFooter from './SharedComponents/customFooter';

const Admin = (prop)=>{

    return (   
        <div className="homepage">
            {/* Main Nav Bar */}
            <NavMenu isAdmin={true} isHome={true} pagePath="/"/>

            {/* Cover Section */}
            <div className="cover"></div>

            {/* Admin Options */}
            <section className="scrolling-wrapper animate__animated animate__fadeInUp">
                <div className="tile-admin">
                    <img src={dashboard_icon} alt="HR Analytics"/>
                    <Link to="/" className="form_btn">HR Analytics</Link>
                </div>
                <div className="tile-admin">
                    <img src={records_icon} alt="Employee Records"/>
                    <Link to="/" className="form_btn">Employee Records</Link>
                </div>
                <div className="tile-admin">
                    <img src={signup_icon} alt="Add Employee"/>
                    <Link to="/create-account" className="form_btn">Add Employee</Link>
                </div>
                <div className="tile-admin">
                    <img src={attendance_icon} alt="Employee Attendance"/>
                    <Link to="/" className="form_btn">Employee Attendance</Link>
                </div>
                <div className="tile-admin">
                    <img src={leave_icon} alt="Leave Requests"/>
                    <Link to="/" className="form_btn">Leave Requests</Link>
                </div>
                <div className="tile-admin">
                    <img src={feedback_icon} alt="Generate Survey"/>
                    <Link to="/" className="form_btn">Generate Survey</Link>
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

