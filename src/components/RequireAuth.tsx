// src/components/RequireAuth.tsx
import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface RequireAuthProps {
  allowedRoles: string[];
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ allowedRoles }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!token) {
      toast.error("Please sign in to continue.");
      navigate("/signin");
      return;
    }

    if (!role || !allowedRoles.includes(role)) {
      toast.error("Access denied.");
      if (role === "applicant") {
        navigate("/applicantdashboard");
      } else {
        navigate("/signin");
      }
      return;
    }
  }, [token, role, allowedRoles, navigate]);

  if (!token || !role || !allowedRoles.includes(role)) {
    return null;
  }

  return <Outlet />;
};