// src/pages/signup.jsx
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmpassword: string;
}

const Signup: React.FC = () => {
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

  // ← ADD THIS useEffect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const verified = urlParams.get("verified");
    const role = urlParams.get("role");

    if (verified === "true" && role === "employer") {
      localStorage.setItem("role", "employer");
      toast.success("Account activated! Please sign in as employer.");
      window.history.replaceState({}, "", "/signup");
    } else if (verified === "false") {
      toast.error("Activation failed. Please try again.");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      const res = await fetch("/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role: "employer",
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

      localStorage.setItem("role", "employer"); // ← Keep this too

      setTimeout(() => navigate("/signin"), 2000);
    } catch (err) {
      console.error("Signup error:", err);
      setError("Failed to connect to server. Is backend running?");
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
    <div className="flex items-center justify-center min-h-screen bg-blue-50 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">
          Employer Signup
        </h2>
        <Link to="/applicantsignup" className="inline-block bg-blue-600 text-white px-4 py-1 rounded mb-3">
          Continue as Job Seeker
        </Link>

        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-2 rounded mb-4">{success}</div>}

        <input
          className="w-full border border-blue-300 rounded-lg p-3 mb-4"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border border-blue-300 rounded-lg p-3 mb-4"
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border border-blue-300 rounded-lg p-3 mb-4"
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          className="w-full border border-blue-300 rounded-lg p-3 mb-6"
          name="confirmpassword"
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmpassword}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading || loadingVerification}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg disabled:opacity-50"
        >
          {getButtonText()}
        </button>

        <p className="text-center text-sm mt-4">
          Already have an account? <a href="/signin" className="text-blue-600 hover:underline">Sign In</a>
        </p>
      </form>
    </div>
  );
};

export default Signup;