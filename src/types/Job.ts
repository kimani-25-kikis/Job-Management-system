// src/types/Job.ts

// Job Owner (for employer view)
export interface JobOwner {
  id: number;
  username: string;
  email: string;
}

// User (for applications)
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name?: string;
  image?: string;
}

// Job (full interface)
export interface Job {
  id: number;
  title: string;
  description: string;
  company_name: string;
  location: string;
  salary: number | string; // Accept both number & string from backend
  status: "active" | "inactive";
  is_active?: boolean; // Optional from backend
  created_at: string;
  updated_at: string;
  job_owner: JobOwner | number; // Accept object OR ID
}

// Job Application
export interface JobApplication {
  id: number;
  cover_letter: string;
  resume: string;
  status: string;
  created_at: string;
  job: Job;
  user: User;
}