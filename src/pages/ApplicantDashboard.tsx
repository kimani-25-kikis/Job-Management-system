// src/pages/ApplicantDashboard.tsx
import React, { useEffect, useState } from "react";
import type { Job } from "../types/Job";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import SearchBar from "../components/SearchBar";
import ApplicantJobCard from "../components/ApplicantJobCard";

const ApplicantDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const jobsPerPage = 10;
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  // LOGOUT FUNCTION — CLEARS EVERYTHING
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role"); // CRITICAL

    toast.success("Logged out successfully");
    navigate("/applicantlogin");
  };

  // ROLE GUARD + AUTH + FETCH JOBS
  useEffect(() => {
    if (!token) {
      navigate("/applicantlogin");
      return;
    }

    if (role !== "applicant") {
      toast.error("Access denied. Job seekers only.");
      navigate("/");
      return;
    }

    api
      .get("all-jobs/")
      .then((res) => setJobs(res.data))
      .catch(() => toast.error("Failed to fetch jobs"));
  }, [token, role, navigate]);

  // Extract filters
  const locations = Array.from(new Set(jobs.map((job) => job.location)));
  const companies = Array.from(new Set(jobs.map((job) => job.company_name)));

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation = selectedLocation ? job.location === selectedLocation : true;
    const matchesCompany = selectedCompany ? job.company_name === selectedCompany : true;

    return matchesSearch && matchesLocation && matchesCompany;
  });

  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-700">Job Seeker Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition"
          >
            Logout
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar searchTerm={searchTerm} onSearch={setSearchTerm} />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <select
              value={selectedCompany}
              onChange={(e) => {
                setSelectedCompany(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All Companies</option>
              {companies.map((comp) => (
                <option key={comp} value={comp}>
                  {comp}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Job List */}
        <div className="space-y-6">
          {currentJobs.length > 0 ? (
            currentJobs.map((job) => (
              <ApplicantJobCard
                key={job.id}
                job={job}
                onDeactivate={() => {}}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow">
              <p className="text-gray-500 text-lg">No jobs match your search.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  currentPage === i + 1
                    ? "bg-green-600 text-white"
                    : "bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantDashboard;