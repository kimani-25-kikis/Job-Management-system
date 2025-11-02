// src/pages/ActivationHandler.tsx
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ActivationHandler: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const success = params.get("success") === "true";
    const role = params.get("role") as "employer" | "applicant" | null;
    const message = params.get("message");

    if (success && role) {
      // Save role
      localStorage.setItem("role", role);

      // Show success
      toast.success(message || `Account activated! Sign in as ${role}.`);

      // Redirect to correct login
      const loginPath = role === "employer" ? "/signin" : "/applicantlogin";
      navigate(loginPath, { replace: true });
    } else {
      // Show error
      toast.error(message || "Activation failed. Please try again.");

      // Redirect to correct signup
      const signupPath = role === "employer" ? "/signup" : "/applicantsignup";
      navigate(signupPath, { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg font-medium text-gray-700">Activating your account...</p>
      </div>
    </div>
  );
};

export default ActivationHandler;