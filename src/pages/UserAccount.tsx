// import React, { useEffect, useState } from "react";
// import api from "../utils/api";
// import { useNavigate } from "react-router-dom";
// import { UserCircle } from "lucide-react";
// import toast from "react-hot-toast";
// import type { JobApplication } from "../types/Job";
// import { AxiosError } from 'axios';
// import { formatDate } from "../utils/formatDate";

// // interface JobApplication {
// //   id: number;
// //   applicant_name: string;
// //   job_title: string;
// //   status: "Pending" | "Shortlisted" | "Rejected" | "Reviewed"; // You can add more statuses if needed
// //   resume_url?: string; // Optional
// //   created_at: string;
// // }

// interface User {
//   id: number;
//   username: string;
//   email: string;
//   first_name: string;
//   last_name: string;
//   image?: string; // Optional profile picture URL
// }

// const UserAccount: React.FC = () => {
//   const [user, setUser] = useState<User>();
//   const [loading, setLoading] = useState(true);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const navigate = useNavigate();
//   const [applications, setApplications] = useState<JobApplication[]>([]);

//   useEffect(() => {
//     const fetchUser = async () => {
//       const token = localStorage.getItem("accessToken");
//       if (!token){
//         navigate("/signin");
//         return;
//       }

//       try {
//         const response = await api.get("user/");
//         setUser(response.data);
//       } catch (error) {
//         console.error("Error fetching user:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     const fetchApplications = async () => {
//       try {
//         const response = await api.get("job-applications/");
//         console.log("Applications fetched:", response.data);
//         setApplications(response.data);
//       } catch (error) {
//         console.error("Error fetching job applications:", error);
//       }
//   };

//     fetchApplications();

//     fetchUser();
//   }, []);

//   const updateApplicationStatus = async (id: number, status: string) => {
//     try {
//       const response = await api.patch(`update-application/${id}/update-status/`, { status });

//       toast.success(`Application ${status.charAt(0).toUpperCase() + status.slice(1)}!`);

//       setApplications(prev =>
//         prev.map(app => (app.id === id ? { ...app, status: response.data.status } : app))
//       );
//     } catch (err: unknown) {
//       const error = err as AxiosError<{ detail?: string }>;
//       toast.error("Failed to update application status.");
//       console.error('Error updating application status:', error);

//       if (error.response?.data?.detail) {
//         toast.error(`Failed to update: ${error.response.data.detail}`);
//       } else {
//         toast.error("Failed to update application.");
//       }
//     }
// };


//   const handleUpload = async () => {
//     if (!selectedFile) return;

//     const formData = new FormData();
//     formData.append("image", selectedFile);

//     try {
//       await api.post("user/upload-picture/", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       toast.success("Profile picture uploaded successfully!");
//       window.location.reload();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to upload profile picture.");
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (!user) return <div>No user info available.</div>;

//   return (
//     <>
//     <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6">
//       <div className="flex flex-col items-center mb-6">
//         {user.image ? (
//           <img src={user.image} alt="Profile" className="w-24 h-24 rounded-full object-cover mb-2" />
          
//         ) : (
//           <UserCircle className="w-24 h-24 text-blue-600 mb-2" />
//         )}
//         <h2 className="text-xl font-bold">{user.first_name}</h2>
//       </div>

//       <p className="text-gray-600 mb-1">@{user.username}</p>
//       <p className="text-gray-600 mb-4">{user.email}</p>

//       <input
//         type="file"
//         onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
//         className="mb-2"
//       />
//       <button
//         onClick={handleUpload}
//         className="bg-blue-600 text-white px-4 py-2 rounded"
//       >
//         Upload Picture
//       </button>
//     </div>

//     <div className="max-w-7xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6">
//   <h3 className="text-xl font-semibold mb-4">Job Applications</h3>
//   {applications.length === 0 ? (
//     <p className="text-gray-600">No applications yet.</p>
//   ) : (
//     <table className="min-w-full text-left border">
//       <thead>
//         <tr className="bg-gray-100">
//           <th className="py-2 px-4 border">#</th>
//           <th className="py-2 px-4 border">Applicant</th>
//           <th className="py-2 px-4 border">Job Title</th>
//           <th className="py-2 px-4 border">Resume</th>
//           <th className="py-2 px-4 border">Status</th>
//           <th className="py-2 px-4 border">Submitted</th>
//           <th className="py-2 px-4 border">Actions</th>
//         </tr>
//       </thead>
//       <tbody>
//   {applications.map((app, index) => (
//     <tr key={app.id} className="border-t">
//       <td className="py-2 px-4 border">{index + 1}</td> {/* Row number */}
//       <td className="py-2 px-4 border">{app.user.first_name}</td>
//       <td className="py-2 px-4 border">{app.job.title}</td>
//       <td className="py-2 px-4 border">
//         <a href={app.resume} target="_blank" rel="noopener noreferrer">View Resume</a>
//       </td>
//       <td className="py-2 px-4 border">{app.status}</td>
//       <td className="py-2 px-4 border">{formatDate(app.created_at)}</td>
//       <td className="py-2 px-4 space-x-2 flex flex-row">
//         <button onClick={() => updateApplicationStatus(app.id, "pending")} className="text-sm bg-blue-500 hover:bg-blue-700 transition text-white px-1 py-1 rounded">Pending</button>
//         <button onClick={() => updateApplicationStatus(app.id, "reviewed")} className="text-sm bg-yellow-600 hover:bg-yellow-700 transition text-white px-1 py-1 rounded">Reviewing</button>
//         <button onClick={() => updateApplicationStatus(app.id, "interview")} className="text-sm bg-amber-800 hover:bg-amber-900 transition text-white px-1 py-1 rounded">Interview</button>
//         <button onClick={() => updateApplicationStatus(app.id, "rejected")} className="text-sm bg-red-600 hover:bg-red-700 transition text-white px-1 py-1 rounded">Rejected</button>
//         <button onClick={() => updateApplicationStatus(app.id, "accepted")} className="text-sm bg-green-600 hover:bg-green-700 transition text-white px-1 py-1 rounded">Accepted</button>
//       </td>
//     </tr>
//   ))}
//   {/* Footer Row with Total */}
//   <tr className="border-t font-semibold">
//     <td className="py-2 px-4 text-xl font-bold border" colSpan={7}>
//       Total Applications: {applications.length}
//     </td>
//   </tr>
// </tbody>

//     </table>
//   )}
// </div>

//     </>
    
//   );
// };

// export default UserAccount;
import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { UserCircle } from "lucide-react";
import toast from "react-hot-toast";
import { formatDate } from "../utils/formatDate";

interface JobApplication {
  id: number;
  user: { first_name: string; email: string };
  job: { title: string };
  resume: string;
  status: string;
  created_at: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  image?: string;
}

const UserAccount: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const navigate = useNavigate();

  // Fetch profile + applications
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        const [userRes, appsRes] = await Promise.all([
          api.get("user/"),
          api.get("job-applications/"),
        ]);
        setUser(userRes.data);
        setApplications(appsRes.data);
      } catch (err) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  // Update status
  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await api.patch(`update-application/${id}/update-status/`, { status });
      setApplications(prev =>
        prev.map(app => (app.id === id ? { ...app, status: res.data.status } : app))
      );
      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  // Upload picture
  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      await api.post("user/upload-picture/", formData);
      toast.success("Picture uploaded!");
      window.location.reload();
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (!user) return <div className="text-center p-8">No user data</div>;

  return (
    <>
      {/* PROFILE CARD */}
      <div className="max-w-md mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6">
        <div className="flex flex-col items-center mb-6">
          {user.image ? (
            <img
              src={user.image}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-blue-100"
            />
          ) : (
            <UserCircle className="w-28 h-28 text-blue-600" />
          )}
          <h2 className="text-2xl font-bold mt-3">{user.first_name} {user.last_name}</h2>
          <p className="text-gray-600">@{user.username}</p>
          <p className="text-gray-700">{user.email}</p>
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          className="mb-3 w-full"
        />
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload Picture"}
        </button>
      </div>

      {/* APPLICATIONS TABLE */}
      <div className="max-w-7xl mx-auto mt-12 bg-white shadow-lg rounded-2xl p-6">
        <h3 className="text-2xl font-bold mb-6 text-blue-700">Job Applications</h3>
        {applications.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No applications yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead className="bg-blue-50">
                <tr>
                  <th className="py-3 px-4 text-left">#</th>
                  <th className="py-3 px-4 text-left">Applicant</th>
                  <th className="py-3 px-4 text-left">Job</th>
                  <th className="py-3 px-4 text-left">Resume</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, i) => (
                  <tr key={app.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">{i + 1}</td>
                    <td className="py-3 px-4">{app.user.first_name}</td>
                    <td className="py-3 px-4">{app.job.title}</td>
                    <td className="py-3 px-4">
                      <a href={app.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        View
                      </a>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-sm font-medium ${
                        app.status === "accepted" ? "bg-green-100 text-green-800" :
                        app.status === "rejected" ? "bg-red-100 text-red-800" :
                        app.status === "interview" ? "bg-purple-100 text-purple-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">{formatDate(app.created_at)}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1 flex-wrap">
                        {["pending", "reviewed", "interview", "accepted", "rejected"].map(s => (
                          <button
                            key={s}
                            onClick={() => updateStatus(app.id, s)}
                            className={`text-xs px-2 py-1 rounded transition ${
                              app.status === s
                                ? "bg-gray-600 text-white"
                                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 text-right font-bold text-lg">
              Total: {applications.length}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserAccount;