import {Link} from 'react-router-dom';

import '../styles/homepage.css';
import 'animate.css';

// Importing user option images to be used in user option section of the webpage
import account_icon from './Images/Home/collection/account.png'
import survey_icon from './Images/Home/collection/feedback.png'
import leave_icon from './Images/Home/collection/leave.png'
import courses_icon from './Images/Home//collection/courses.png'
import faqs_icon from './Images/Home/collection/faqs.png'

//Importing Shared Components
import NavMenu from "./SharedComponents/navMenu";
import CustomFooter from './SharedComponents/customFooter';

const Employee = (prop)=>{
    return (   
        <div className="homepage">
            {/* Main Nav Bar */}
            <NavMenu isHome={true} pagePath="/employee"/>

            {/* Cover Section */}
            <div className="cover"></div>

            {/* Employee Options */}
            <section className="scrolling-wrapper animate__animated animate__fadeInUp">
            <div className="tile-emp">
                    <img src={account_icon} alt="My Account"/>
                    <Link to="/employee" className="form_btn">My Account</Link>
                </div>
                <div className="tile-emp">
                    <img src={survey_icon} alt="Surveys"/>
                    <Link to="/employee" className="form_btn">Surveys</Link>
                </div>
                <div className="tile-emp">
                    <img src={leave_icon} alt="Request Leave"/>
                    <Link to="/employee" className="form_btn">Request Leave</Link>
                </div>
                <div className="tile-emp">
                    <img src={courses_icon} alt="Courses"/>
                    <Link to="/courses" className="form_btn">Courses</Link>
                </div>
                <div className="tile-emp">
                    <img src={faqs_icon} alt="FAQS"/>
                    <Link to="/faqs" className="form_btn">FAQS</Link>
                </div>
            </section>

            <CustomFooter/>

        </div>
    )

}

export default Employee

