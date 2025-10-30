import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ApplicantJobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState<File | null>(null);

  /* ---------- FETCH JOB ---------- */
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`/api/all-jobs/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load job");
        const data = await res.json();
        setJob(data);
      } catch {
        toast.error("Failed to load job");
        navigate("/applicantdashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  /* ---------- APPLY ---------- */
  const handleApply = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!coverLetter.trim()) return toast.error("Cover letter is required");
  if (!resume) return toast.error("Resume is required");

  const formData = new FormData();
  formData.append("job", id!);           // ← Must be job ID (number)
  formData.append("cover_letter", coverLetter);
  formData.append("resume", resume);     // ← File object

  try {
    setApplying(true);
    const token = localStorage.getItem("accessToken");
    const res = await fetch("/api/apply/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // DO NOT set Content-Type → let browser set multipart boundary
      },
      body: formData,
    });

    const data = await res.json();
    console.log("Response:", data); // ← SEE EXACT ERROR

    if (!res.ok) {
      throw new Error(data.cover_letter?.[0] || data.resume?.[0] || data.detail || "Application failed");
    }

    toast.success("Applied successfully!");
    navigate("/applicantdashboard");
  } catch (err: any) {
    toast.error(err.message);
  } finally {
    setApplying(false);
  }
};

  /* ---------- UI ---------- */
  if (loading) return <div className="text-center p-8">Loading job…</div>;
  if (!job) return <div className="text-center p-8">Job not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back to Jobs
      </button>

      <h1 className="text-3xl font-bold text-green-700 mb-2">{job.title}</h1>
      <p className="text-lg text-gray-600 mb-4">{job.company_name}</p>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <p className="text-gray-800 whitespace-pre-wrap">{job.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div><strong>Location:</strong> {job.location || "Remote"}</div>
        <div><strong>Salary:</strong> {job.salary_range || "Not specified"}</div>
        <div><strong>Type:</strong> {job.job_type || "Full-time"}</div>
        <div><strong>Posted:</strong> {new Date(job.created_at).toLocaleDateString()}</div>
      </div>

      {/* ---------- APPLY FORM ---------- */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Apply for this Job</h2>
        <form onSubmit={handleApply} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Cover Letter</label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
              rows={5}
              placeholder="Explain why you are the best fit..."
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Upload Resume (PDF/DOCX)</label>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={(e) => setResume(e.target.files?.[0] || null)}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            disabled={applying}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
          >
            {applying ? "Submitting…" : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplicantJobDetail;