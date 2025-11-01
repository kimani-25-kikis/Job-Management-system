// src/pages/ApplicantLogin.tsx
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface FormData {
  email: string;
  password: string;
}

const ApplicantLogin: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const verified = urlParams.get("verified");
    const role = urlParams.get("role");

    if (verified === "true" && role === "applicant") {
      localStorage.setItem("role", "applicant");
      toast.success("Account activated! Sign in as applicant.");
      window.history.replaceState({}, "", "/applicantlogin");
    } else if (verified === "false") {
      toast.error("Activation failed.");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setError("All fields required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Login failed");

      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);

      const savedRole = localStorage.getItem("role");

      if (savedRole === "applicant") {
        navigate("/applicantdashboard");
      } else if (savedRole === "employer") {
        navigate("/");
      } else {
        setError("Invalid role. Please activate your account.");
      }

      toast.success("Welcome back, Job Seeker!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
          Job Seeker Sign In
        </h2>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border border-green-300 rounded-lg p-3 mb-4"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full border border-green-300 rounded-lg p-3 mb-6"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-center text-sm mt-4">
          No account? <a href="/applicantsignup" className="text-green-600 hover:underline">Sign Up</a>
        </p>
      </form>
    </div>
  );
};

export default ApplicantLogin;