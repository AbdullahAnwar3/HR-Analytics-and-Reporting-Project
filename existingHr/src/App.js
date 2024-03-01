// import './App.css'
import React from 'react';
import Login from "./Components/newLogin/Login"
import Dashboard from './Components/Dashboard';
import LeaveRequest from './Components/LeaveRequest/LeaveRequest';
import EmployeePortal from './Components/EmployeePortal/EmployeePortal'
import PayrollBenefit from './Components/PayrollBenefit';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
/* import { useState } from 'react'; */

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/EmployeePortal" element={<EmployeePortal />} /> 
          <Route path="/LeaveRequest" element={<LeaveRequest />} /> 
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/PayrollBenefit" element={<PayrollBenefit />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;





