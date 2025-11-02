// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

import JobList from "./pages/JobList";
import CreateJob from "./pages/CreateJob";
import EditJob from "./pages/EditJob";
import JobDetail from "./pages/JobDetail";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Navbar from "./components/NavBar";
import ApplicantNavbar from "./components/ApplicantNavbar";
import UserAccount from "./pages/UserAccount";
import ApplicantLogin from "./pages/ApplicantLogin";
import ApplicantSignup from "./pages/ApplicantSignup";
import ApplicantDashboard from "./pages/ApplicantDashboard";
import ApplicantJobDetail from "./pages/ApplicantJobDetail";
import JobApplication from "./pages/JobApplication";
import ApplicantProfile from "./pages/ApplicantProfile";
import ActivationHandler from "./pages/ActivationHandler";

const AppContent: React.FC = () => {
  const location = useLocation();
  const hideNavbar = [
    "/signup",
    "/signin",
    "/applicantlogin",
    "/applicantsignup",
    "/activate"
  ].includes(location.pathname);

  const role = localStorage.getItem("role");

  return (
    <div className="min-h-screen bg-gray-100">
      {!hideNavbar && (
        role === "applicant" ? <ApplicantNavbar /> : <Navbar />
      )}

      <Routes>
        {/* START HERE */}
        <Route path="/" element={<Signin />} />

        {/* EMPLOYER DASHBOARD */}
        <Route path="/jobs" element={<JobList />} />
        <Route path="/create" element={<CreateJob />} />
        <Route path="/edit/:id" element={<EditJob />} />
        <Route path="/job/:id" element={<JobDetail />} />
        <Route path="/account" element={<UserAccount />} />

        {/* AUTH */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/activate" element={<ActivationHandler />} />

        {/* APPLICANT */}
        <Route path="/applicantlogin" element={<ApplicantLogin />} />
        <Route path="/applicantsignup" element={<ApplicantSignup />} />
        <Route path="/applicantdashboard" element={<ApplicantDashboard />} />
        <Route path="/applicantjobdetail/:id" element={<ApplicantJobDetail />} />
        <Route path="/application" element={<JobApplication />} />
        <Route path="/applicantprofile" element={<ApplicantProfile />} />
      </Routes>

      <Toaster position="top-right" />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;