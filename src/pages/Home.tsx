// src/pages/Home.tsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import JobCard from "../components/JobCard";
import api from "../utils/api";
import type { Job } from "../types/Job";
import { useState } from "react";
import JobForm from "../components/JobForm";

const Home: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  // ROLE REDIRECT
  useEffect(() => {
    if (!token) {
      navigate("/signin");
      return;
    }

    if (role === "applicant") {
      navigate("/applicantdashboard");
      return;
    }

    if (role === "employer") {
      // Stay here — show employer view
      fetchEmployerJobs();
    }
  }, [token, role, navigate]);

  const fetchEmployerJobs = async () => {
    try {
      const res = await api.get("jobs/");
      setJobs(res.data);
    } catch {
      toast.error("Failed to load your jobs");
    }
  };

  const handleJobCreated = (newJob: Job) => {
    setJobs((prev) => [newJob, ...prev]);
    toast.success("Job posted!");
  };

  const handleDeactivate = async (id: number) => {
    try {
      await api.patch(`jobs/${id}/deactivate/`);
      setJobs((prev) => prev.filter((j) => j.id !== id));
      toast.success("Job deactivated");
    } catch {
      toast.error("Failed to deactivate");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out!");
    navigate("/signin");
  };

  if (role !== "employer") return null; // Redirecting

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-700">Employer Portal</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Logout
          </button>
        </div>

        {/* Post Job Form */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-semibold text-indigo-600 mb-4">Post a New Job</h2>
          <JobForm onJobCreated={handleJobCreated} />
        </div>

        {/* Job List */}
        <h2 className="text-xl font-semibold text-indigo-600 mb-4">Your Posted Jobs</h2>
        {jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onDeactivate={handleDeactivate}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-10">No jobs posted yet.</p>
        )}
      </div>
    </div>
  );
};

export default Home;