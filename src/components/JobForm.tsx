// src/components/JobForm.tsx
import React, { useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";

interface JobFormProps {
  onJobCreated: (job: any) => void;
}

const JobForm: React.FC<JobFormProps> = ({ onJobCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    company_name: "",
    location: "",
    salary: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("jobs/", formData);
      onJobCreated(res.data);
      setFormData({ title: "", company_name: "", location: "", salary: "", description: "" });
    } catch {
      toast.error("Failed to post job");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Job Title"
        className="w-full p-2 border rounded"
        required
      />
      <input
        name="company_name"
        value={formData.company_name}
        onChange={handleChange}
        placeholder="Company Name"
        className="w-full p-2 border rounded"
        required
      />
      <input
        name="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="Location"
        className="w-full p-2 border rounded"
        required
      />
      <input
        name="salary"
        value={formData.salary}
        onChange={handleChange}
        placeholder="Salary"
        className="w-full p-2 border rounded"
        required
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Job Description"
        className="w-full p-2 border rounded h-24"
        required
      />
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium"
      >
        Post Job
      </button>
    </form>
  );
};

export default JobForm;