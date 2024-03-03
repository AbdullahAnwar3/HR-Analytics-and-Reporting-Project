// importing React library, routes, and different components/pages of our web application
import React from 'react'; 
import Login from "./Components/newLogin/Login"; 
import LeaveRequest from './Components/LeaveRequest/LeaveRequest'; 
import EmployeePortal from './Components/EmployeePortal/EmployeePortal'; 
import PayrollBenefit from './Components/PayrollBenefit'; 

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 

// This is the main component of our application
function App() {
  return (
    // Root HTML element with className "App"
    <div className="App">
      {/* We set up the routing for different components using BrowserRouter */}
      <Router>
        {/* Routes component defines the routes for different URLs */}
        <Routes>
          <Route path="/EmployeePortal" element={<EmployeePortal />} />
          <Route path="/LeaveRequest" element={<LeaveRequest />} />
          <Route path="/PayrollBenefit" element={<PayrollBenefit />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App; 






