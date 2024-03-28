import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';

import Login from './components/login';
import Admin from './components/admin';
import Employee from './components/employee';
import CoursesManage from './components/courseManagement';
import CoursesBoard from './components/courseBoard';
import FaqsManage from './components/faqsManagement';
import FaqsBoard from './components/faqsBoard';
import Signup from './components/signup';

// For accessing global state for logged in users
import { useAuthorize } from './context/hook/useAuthorization';

function App() {

  const {userAccount} = useAuthorize();

  return (
    <BrowserRouter>
        <Routes>

          {/* Routes for 'admin' and 'employee' homepages */}
          <Route path="/" element={userAccount && userAccount.occupation === 'admin' ? <Admin/> : <Navigate to="/login"/>}/>
          <Route path="/employee" element={userAccount && userAccount.occupation === 'employee' ? <Employee/> : <Navigate to="/login"/>}/>

          {/* <Route path="/" element={<Admin/>}/>
          <Route path="/employee" element={<Employee/>}/> */}

          {/* Route for login page */}
          <Route path="/login" element={!userAccount ? <Login/> : <Navigate to={userAccount.occupation === 'admin' ? "/" : "/employee"}/>}/> 

          {/* Routes for 'admin' usecases */}
          <Route path="/courses-manage" element={userAccount && userAccount.occupation === 'admin' ? <CoursesManage/> : <Navigate to="/login"/>}/>
          <Route path="/faqs-manage" element={userAccount && userAccount.occupation === 'admin' ? <FaqsManage/> : <Navigate to="/login"/>}/>
          <Route path="/create-account" element={userAccount && userAccount.occupation === 'admin' ? <Signup/> : <Navigate to="/login"/>}/>

          {/* Routes for 'employee' usecases */} 
          <Route path="/courses" element={userAccount && userAccount.occupation === 'employee' ? <CoursesBoard/> : <Navigate to="/login"/>}/> 
          <Route path="/faqs" element={userAccount && userAccount.occupation === 'employee' ? <FaqsBoard/> : <Navigate to="/login"/>}/> 

             
        </Routes>
      </BrowserRouter>
  )
}

export default App;
