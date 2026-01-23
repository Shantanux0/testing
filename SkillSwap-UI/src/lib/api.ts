import axios from "axios";

// Detect if running on localhost or network IP
const hostname = window.location.hostname;
const API_BASE_URL = `http://${hostname}:8080/api`;

export const getAuthToken = () => localStorage.getItem("token");
export const setAuthToken = (token: string | null) => {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface UserProfile {
  id: number;
  email: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  skillsToLearn: string[];
  skillsToTeach: string[];
}

export const authApi = {
  signup: (data: any) => api.post("/auth/register", data).then((res) => res.data),
  signin: (data: any) => api.post("/auth/login", data).then((res) => res.data),
  verifyOtp: (data: any) => api.post("/auth/verify-otp", data).then((res) => res.data),
  resendOtp: (email: string) => api.post(`/auth/send-otp?email=${email}`, null).then((res) => res.data),
  // Aliases for AuthContext compatibility
  register: (e: string, p: string) => api.post("/auth/register", { email: e, password: p }).then(res => res.data),
  login: (e: string, p: string) => api.post("/auth/login", { email: e, password: p }).then(res => res.data),
  logout: () => Promise.resolve(),
};

export const profileApi = {
  getMyProfile: () => api.get("/profile").then((res) => res.data),
  updateProfile: (data: any) => api.put("/profile", data).then((res) => res.data),
  deleteProfile: () => api.delete("/profile").then((res) => res.data),
  searchProfiles: (keyword: string, page = 0, size = 10) =>
    api.get(`/profile/search?keyword=${keyword}&page=${page}&size=${size}`).then(res => res.data),
  // Alias
  getProfile: () => api.get("/profile").then((res) => res.data),
};


export const resumeApi = {
  uploadResume: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/resume/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then((res) => res.data);
  },
  getResume: () => api.get("/resume").then((res) => res.data),
  parseResume: () => api.post("/resume/parse").then((res) => res.data),
};

export const testApi = {
  generateTest: (skillName: string) => api.post("/test/generate", { skillName }).then((res) => res.data),
  submitTest: (testId: number, answers: any[]) => api.post("/test/submit", { testId, answers }).then((res) => res.data),
  getTestHistory: () => api.get("/test/history").then((res) => res.data),
};

export interface SwapMatchDto {
  partnerId: number;
  partnerName: string;
  partnerEmail: string;
  profileImageUrl?: string;
  location?: string;
  timezone?: string;
  skillILearn: string;
  skillITeach: string;
  matchScore: number;
  swapType: string;
  mutualMatch: boolean;
  skillLevelGapScore?: number;
  goalAlignmentScore?: number;
  availabilityScore?: number;
  // ...
  compatibilityReason?: string;
}

export const matchApi = {
  findSwapMatches: (learn: string, teach: string) =>
    api.get(`/matches/swap?skillToLearn=${learn}&skillToTeach=${teach}`).then((res) => res.data),
  recommendTeachers: (skill: string) =>
    api.get(`/matches/recommend?skill=${skill}`).then((res) => res.data),
};

export interface Session {
  sessionId: number;
  skillName: string;
  status: string;
  partnerId: number;
  partnerName: string;
  role: "TEACHER" | "LEARNER";
  createdAt: string;
  scheduledTime?: string;
}

export const sessionApi = {
  requestSession: (teacherId: number, skillName: string) =>
    api.post(`/sessions/request?teacherId=${teacherId}&skill=${skillName}`).then((res) => res.data),
  getMySessions: () => api.get("/sessions/my-sessions").then((res) => res.data),
  updateSessionStatus: (sessionId: number, status: string) =>
    api.put(`/sessions/${sessionId}/status?status=${status}`).then((res) => res.data),
};

export interface NotificationDto {
  id: number;
  message: string;
  type: string;
  read: boolean; // mapped from isRead
  createdAt: string;
  relatedEntityId?: number;
}

export const notificationApi = {
  getMyNotifications: () => api.get("/notifications").then((res) => res.data),
  getUnreadCount: () => api.get("/notifications/unread-count").then((res) => res.data),
  markRead: (id: number) => api.put(`/notifications/${id}/read`).then((res) => res.data),
};
