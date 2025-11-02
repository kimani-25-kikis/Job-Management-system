// src/components/JobForm.tsx
import React, { useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import type { Job } from "../types/Job";

interface JobFormProps {
  onJobCreated: (job: Job) => void;
}

const JobForm: React.FC<JobFormProps> = ({ onJobCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    company_name: "",
    location: "",
    salary: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("jobs/", formData);
      onJobCreated(res.data);
      toast.success("Job posted successfully!");
      
      // Reset form
      setFormData({
        title: "",
        company_name: "",
        location: "",
        salary: "",
        description: "",
      });
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Failed to post job";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Job Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Senior React Developer"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
          Company Name
        </label>
        <input
          id="company_name"
          name="company_name"
          type="text"
          value={formData.company_name}
          onChange={handleChange}
          placeholder="e.g. Tech Corp Ltd"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          required
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Nairobi, Kenya"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
            Salary (KES)
          </label>
          <input
            id="salary"
            name="salary"
            type="text"
            value={formData.salary}
            onChange={handleChange}
            placeholder="e.g. 150,000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Job Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the role, requirements, and responsibilities..."
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
          required
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Posting Job...
          </>
        ) : (
          "Post Job"
        )}
      </button>
    </form>
  );
};

export default JobForm;