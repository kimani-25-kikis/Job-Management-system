// src/pages/ApplicantSignup.tsx
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmpassword: string;
}

const ApplicantSignup: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingVerification, setLoadingVerification] = useState(false);
  const navigate = useNavigate();

  // Check for activation redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const verified = urlParams.get("verified");
    const role = urlParams.get("role");

    if (verified === "true" && role === "applicant") {
      localStorage.setItem("role", "applicant");
      toast.success("Account activated! Please sign in as applicant.");
      // Clean URL
      window.history.replaceState({}, "", "/applicantsignup");
    } else if (verified === "false") {
      toast.error("Activation failed. Please try again.");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, password, confirmpassword } = formData;

    if (!name || !email || !password || !confirmpassword) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmpassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await fetch("/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role: "applicant",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Registration failed.");
        return;
      }

      setSuccess("Check your email to activate your account!");
      setLoadingVerification(true);
      toast.success("Verification email sent!");

      // Only set role after successful signup
      localStorage.setItem("role", "applicant");

      setTimeout(() => navigate("/applicantlogin"), 2000);
    } catch (err) {
      console.error("Signup error:", err);
      setError("Failed to connect to server. Is Django running?");
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (loading) return "Please wait...";
    if (loadingVerification) return "Sending email...";
    return "Create Account";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
          Job Seeker Signup
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">
            {success}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-green-700 mb-1">
            Full Name
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full border border-green-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-green-700 mb-1">
            Email
          </label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full border border-green-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-green-700 mb-1">
            Password
          </label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full border border-green-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-green-700 mb-1">
            Confirm Password
          </label>
          <input
            name="confirmpassword"
            type="password"
            value={formData.confirmpassword}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full border border-green-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || loadingVerification}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
        >
          {getButtonText()}
        </button>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <a
            href="/applicantlogin"
            className="text-green-600 hover:underline font-medium"
          >
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
};

export default ApplicantSignup;