// src/pages/Home.tsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../utils/api";
import JobForm from "../components/JobForm";
import JobCard from "../components/JobCard";
import type { Job } from "../types/Job";

const Home: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (token && role === "employer") {
      api
        .get("jobs/")
        .then((res) => setJobs(res.data))
        .catch(() => toast.error("Failed to load your jobs"));
    }
  }, [token, role]);

  const handleJobCreated = (newJob: Job) => {
    setJobs((prev) => [newJob, ...prev]);
    toast.success("Job posted successfully!");
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
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    toast.success("Logged out!");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-700">Employer Portal</h1>

          {token && role === "employer" ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              Logout
            </button>
          ) : (
            <div className="flex gap-4">
              <Link
                to="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
              >
                Sign Up
              </Link>
              <Link
                to="/signin"
                className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg font-medium transition"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {token && role === "employer" ? (
          <>
            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
              <h2 className="text-xl font-semibold text-indigo-600 mb-4">Post a New Job</h2>
              <JobForm onJobCreated={handleJobCreated} />
            </div>

            <h2 className="text-xl font-semibold text-indigo-600 mb-4">Your Posted Jobs</h2>
            {jobs.length > 0 ? (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} onDeactivate={handleDeactivate} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8 bg-white rounded-xl shadow">
                No jobs posted yet.
              </p>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow">
            <h2 className="text-2xl font-bold text-indigo-700 mb-4">
              Welcome to the Employer Portal
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Post jobs and hire talent. Sign up to get started.
            </p>
            <Link
              to="/signup"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition"
            >
              Sign Up as Employer
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;