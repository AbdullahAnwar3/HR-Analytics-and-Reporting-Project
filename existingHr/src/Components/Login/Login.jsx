import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './Login.css';
import devsinc_logo from '../Assets/Devsinc_logo.png';
import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';
import { employeesData } from '../../data';

export const Login = () => {
  const navigate = useNavigate();
  const [action, setAction] = useState("Login");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const user = employeesData.find(user => user.email === email && user.password === password);
    if (user && action === "Login") {
      navigate('/EmployeePortal');
    } else if (user && action === "Sign Up") {
      // Handling sign up
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <>   
        <div className ='bodyLogin'>
            <div className="realLogo-container">
                <img src={devsinc_logo} alt="Company Logo" className="realLogo" />
            </div>    
            <div className = 'container2'>
                <div className="header">
                    <div className="text">{action}</div>
                    <div className="underline"></div>
                </div>
                <div className="inputs">
                    {action === "Login"?<div></div>:<div className="input">
                        <img src={user_icon} alt="" />
                        <input type="text" placeholder = "Name"/>
                    </div>}
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
                    <button className="submit" onClick={handleLogin}>{action}</button>
                    <div className={action === "Login"?"submit gray":"submit"} onClick = {() =>{setAction("Sign Up")}}>Sign Up</div>            
                </div>  
            </div>
        </div>
    </>
  )
}









// import React, { useState } from 'react';
// import './Login.css';
// import devsinc_logo from '../Assets/Devsinc_logo.png';
// import email_icon from '../Assets/email.png';
// import password_icon from '../Assets/password.png';

// export const Login = ({ onLogin }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLoginClick = () => {
//     // Call the onLogin function passed from parent component (App)
//     onLogin({ email, password });
//   };

//   return (
//     <>   
//         <div className ='bodyLogin'>
//             <div className="realLogo-container">
//                 <img src={devsinc_logo} alt="Company Logo" className="realLogo" />
//             </div>    
//             <div className = 'container2'>
//                 <div className="header">
//                     <div className="text">Login</div>
//                     <div className="underline"></div>
//                 </div>
//                 <div className="inputs">
//                     <div className="input">
//                         <img src={email_icon} alt="" />
//                         <input type="email" placeholder="Email ID" value={email} onChange={(e) => setEmail(e.target.value)} />
//                     </div>
//                 </div>    
//                 <div className="inputs">
//                     <div className="input">
//                         <img src={password_icon} alt="" />
//                         <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
//                     </div>
//                 </div>
//                 <div className="forgot-password">Forgot Password? <span>Click Here!</span></div>  
//                 <div className="submit-container"> 
//                     <div className="submit" onClick={handleLoginClick}>Login</div>
//                 </div>            
//             </div>
//         </div>
//     </>
//   )
// }


