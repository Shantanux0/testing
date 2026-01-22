const API_BASE_URL = "http://localhost:8080";

const AUTH_TOKEN_KEY = "skillswap_jwt_token";

export const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

interface RequestOptions extends RequestInit {
  auth?: boolean;
}

export async function apiFetch<T = unknown>(
  path: string,
  { auth = false, headers, ...options }: RequestOptions = {},
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const finalHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(headers || {}),
  };

  if (auth) {
    const token = getAuthToken();
    if (token) {
      (finalHeaders as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(url, {
    ...options,
    headers: finalHeaders,
  });

  if (!res.ok) {
    if (res.status === 401) {
      setAuthToken(null);
      window.location.href = "/signin";
      throw new Error("Session expired. Please login again.");
    }

    const text = await res.text();
    let errorMessage = text || res.statusText;
    try {
      const errorJson = JSON.parse(text);
      errorMessage = errorJson.message || errorJson.error || errorMessage;
    } catch {
      // Use text as is
    }
    throw new Error(`API ${res.status}: ${errorMessage}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

// ==================== AUTHENTICATION ====================
export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email?: string;
}

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<AuthResponse>("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (email: string, password: string) =>
    apiFetch<AuthResponse>("/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    apiFetch("/logout", {
      method: "POST",
      auth: true,
    }),

  isAuthenticated: () =>
    apiFetch<boolean>("/is-authenticated", {
      method: "GET",
      auth: true,
    }),

  sendOtp: (email: string) =>
    apiFetch("/send-otp?email=" + encodeURIComponent(email), {
      method: "POST",
    }),

  verifyOtp: (email: string, otp: string) =>
    apiFetch("/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    }),
};

// ==================== PROFILE ====================
export interface UserProfile {
  id?: number;
  email: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  profileImageUrl?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  location?: string;
  website?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  skills?: string;
  interests?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  skillsToLearn?: string;
  timezone?: string;
  hoursPerWeek?: number;
  availabilitySchedule?: string;
  learningGoal?: string;
  goalTimeline?: string;
  teachingMotivation?: string;
  teachingApproach?: string;
  preferredLearningMethod?: string;
  communicationPace?: string;
  preferredLanguage?: string;
  domainFocus?: string;
  profileCompletenessScore?: number;
  skillLevels?: SkillLevel[];
}

export interface SkillLevel {
  skillName: string;
  proficiencyLevel: string; // BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
  yearsOfExperience?: number;
  certifications?: string[];
}

export interface UserProfileUpdate {
  firstName?: string;
  lastName?: string;
  bio?: string;
  profileImageUrl?: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  location?: string;
  website?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  skills?: string;
  interests?: string;
  skillsToLearn?: string;
  timezone?: string;
  hoursPerWeek?: number;
  availabilitySchedule?: string;
  learningGoal?: string;
  goalTimeline?: string;
  teachingMotivation?: string;
  teachingApproach?: string;
  preferredLearningMethod?: string;
  communicationPace?: string;
  preferredLanguage?: string;
  domainFocus?: string;
}

export const profileApi = {
  getProfile: () =>
    apiFetch<UserProfile>("/api/profile", {
      method: "GET",
      auth: true,
    }),

  createProfile: (data: UserProfileUpdate) =>
    apiFetch<UserProfile>("/api/profile", {
      method: "POST",
      body: JSON.stringify(data),
      auth: true,
    }),

  updateProfile: (data: UserProfileUpdate) =>
    apiFetch<UserProfile>("/api/profile", {
      method: "PUT",
      body: JSON.stringify(data),
      auth: true,
    }),

  deleteProfile: () =>
    apiFetch("/api/profile", {
      method: "DELETE",
      auth: true,
    }),

  searchProfiles: (keyword: string, page = 0, size = 10, sortBy = "firstName") =>
    apiFetch<{
      content: UserProfile[];
      totalElements: number;
      totalPages: number;
      number: number;
      size: number;
    }>(`/api/profile/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}&sortBy=${sortBy}`, {
      method: "GET",
      auth: true,
    }),
};

// ==================== SKILLS ====================
export const skillsApi = {
  getSkills: () =>
    apiFetch<SkillLevel[]>("/api/profile/skills", {
      method: "GET",
      auth: true,
    }),

  addOrUpdateSkill: (skill: SkillLevel) =>
    apiFetch<SkillLevel>("/api/profile/skills", {
      method: "POST",
      body: JSON.stringify(skill),
      auth: true,
    }),

  getSkill: (skillName: string) =>
    apiFetch<SkillLevel>(`/api/profile/skills/${encodeURIComponent(skillName)}`, {
      method: "GET",
      auth: true,
    }),

  deleteSkill: (skillName: string) =>
    apiFetch(`/api/profile/skills/${encodeURIComponent(skillName)}`, {
      method: "DELETE",
      auth: true,
    }),
};

// ==================== RESUME PORTAL ====================
export interface Education {
  id?: number;
  educationLevel: string;
  institutionName: string;
  boardOrUniversity: string;
  fieldOfStudy?: string;
  passingYear: string;
  scoreDetails: string;
  proofUrl: string;
}

export interface Experience {
  id?: number;
  jobTitle: string;
  companyName: string;
  skillName: string;
  startDate: string;
  endDate?: string;
  description?: string;
  proofUrl: string;
}

export interface Certification {
  id?: number;
  skillName: string;
  certificationName: string;
  issuingOrganization?: string;
  issueDate: string;
  expirationDate?: string;
  proofUrl: string;
  credibilityScore?: number;
}

export interface CodingStat {
  id?: number;
  platformName: string; // LeetCode, Codeforces, HackerRank, etc.
  profileUrl: string;
  totalProblemsSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  proofUrl: string;
}

export const resumeApi = {
  // Education
  getEducation: () =>
    apiFetch<Education[]>("/api/resume/education", {
      method: "GET",
      auth: true,
    }),

  createEducation: (data: Education) =>
    apiFetch<Education>("/api/resume/education", {
      method: "POST",
      body: JSON.stringify(data),
      auth: true,
    }),

  updateEducation: (id: number, data: Education) =>
    apiFetch<Education>(`/api/resume/education/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      auth: true,
    }),

  deleteEducation: (id: number) =>
    apiFetch(`/api/resume/education/${id}`, {
      method: "DELETE",
      auth: true,
    }),

  // Experience
  getExperience: () =>
    apiFetch<Experience[]>("/api/resume/experience", {
      method: "GET",
      auth: true,
    }),

  createExperience: (data: Experience) =>
    apiFetch<Experience>("/api/resume/experience", {
      method: "POST",
      body: JSON.stringify(data),
      auth: true,
    }),

  updateExperience: (id: number, data: Experience) =>
    apiFetch<Experience>(`/api/resume/experience/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      auth: true,
    }),

  deleteExperience: (id: number) =>
    apiFetch(`/api/resume/experience/${id}`, {
      method: "DELETE",
      auth: true,
    }),

  // Certifications
  getCertifications: () =>
    apiFetch<Certification[]>("/api/resume/certifications", {
      method: "GET",
      auth: true,
    }),

  createCertification: (data: Certification) =>
    apiFetch<Certification>("/api/resume/certifications", {
      method: "POST",
      body: JSON.stringify(data),
      auth: true,
    }),

  updateCertification: (id: number, data: Certification) =>
    apiFetch<Certification>(`/api/resume/certifications/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      auth: true,
    }),

  deleteCertification: (id: number) =>
    apiFetch(`/api/resume/certifications/${id}`, {
      method: "DELETE",
      auth: true,
    }),

  // Coding Stats
  getCodingStats: () =>
    apiFetch<CodingStat[]>("/api/resume/coding-stats", {
      method: "GET",
      auth: true,
    }),

  createCodingStat: (data: CodingStat) =>
    apiFetch<CodingStat>("/api/resume/coding-stats", {
      method: "POST",
      body: JSON.stringify(data),
      auth: true,
    }),

  updateCodingStat: (id: number, data: CodingStat) =>
    apiFetch<CodingStat>(`/api/resume/coding-stats/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      auth: true,
    }),

  deleteCodingStat: (id: number) =>
    apiFetch(`/api/resume/coding-stats/${id}`, {
      method: "DELETE",
      auth: true,
    }),
};

// ==================== TEST PORTAL ====================
export interface GenerateTestRequest {
  skillName: string;
}

export interface Question {
  questionNumber?: number;
  question: string;
  options: string[];
  questionId?: number; // For compatibility
  questionText?: string; // For compatibility
}

export interface TestResponse {
  testId: number;
  skillName: string;
  totalQuestions: number;
  passingScore: number;
  questions: Question[];
  expiresAt: number;
  testStatus: string;
}

export interface UserAnswer {
  questionNumber: number;
  selectedAnswer: string;
  questionId?: number; // For compatibility
  selectedOption?: string; // For compatibility
}

export interface SubmitTestRequest {
  testId: number;
  answers: UserAnswer[];
}

export interface QuestionResult {
  questionId: number;
  questionText: string;
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
}

export interface TestResultResponse {
  testId: number;
  skillName: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  passingScore: number;
  passed: boolean;
  questionResults: QuestionResult[];
  completedAt: string;
}

export interface TestHistory {
  testId: number;
  skillName: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  testStatus: string;
  completedAt: string;
  testExpiresAt?: number;
}

export interface QualificationStatus {
  skillName: string;
  isQualified: boolean;
}

export const testApi = {
  generateTest: (skillName: string) =>
    apiFetch<TestResponse>("/api/test/generate", {
      method: "POST",
      body: JSON.stringify({ skillName }),
      auth: true,
    }),

  getTest: (testId: number) =>
    apiFetch<TestResponse>(`/api/test/${testId}`, {
      method: "GET",
      auth: true,
    }),

  submitTest: (testId: number, answers: UserAnswer[]) =>
    apiFetch<TestResultResponse>("/api/test/submit", {
      method: "POST",
      body: JSON.stringify({ testId, answers }),
      auth: true,
    }),

  getTestHistory: () =>
    apiFetch<TestHistory[]>("/api/test/history", {
      method: "GET",
      auth: true,
    }),

  getTestResult: (testId: number) =>
    apiFetch<TestResultResponse>(`/api/test/result/${testId}`, {
      method: "GET",
      auth: true,
    }),

  checkQualificationStatus: (skill: string) =>
    apiFetch<QualificationStatus>(`/api/test/qualification-status?skill=${encodeURIComponent(skill)}`, {
      method: "GET",
      auth: true,
    }),
};

// ==================== SESSIONS ====================
export interface Session {
  sessionId: number;
  skillName: string;
  status: string; // PENDING, ACCEPTED, REJECTED, COMPLETED, CANCELLED
  partnerId: number;
  partnerName: string;
  role: string; // TEACHER or LEARNER
  createdAt: string;
  scheduledTime?: string;
}

// ==================== MATCHING ====================
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

  // Component scores
  skillLevelGapScore: number;
  goalAlignmentScore: number;
  availabilityScore: number;
  timeCommitmentScore: number;
  learningStyleScore: number;

  // Historical scores
  theirTestScore: number;
  theirCertScore: number;
  theirReputationScore: number;
  myTestScore: number;
  myCertScore: number;
  myReputationScore: number;

  // Breakdown
  theirSkillLevel: string;
  mySkillLevel: string;
  theirGoal: string;
  myGoal: string;
  availabilityOverlapHours: number;
  compatibilityReason: string;

  // Partner info
  partnerBio?: string;
  partnerSkills?: string;
  partnerSkillsToLearn?: string;
  partnerHoursPerWeek?: number;
  partnerLearningMethod?: string;
  partnerDomainFocus?: string;
}

export const matchApi = {
  findSwapMatches: (skillToLearn: string, skillToTeach: string) =>
    apiFetch<SwapMatchDto[]>(`/api/matches/swap?skillToLearn=${encodeURIComponent(skillToLearn)}&skillToTeach=${encodeURIComponent(skillToTeach)}`, {
      method: "GET",
      auth: true,
    }),
};

export const sessionApi = {
  requestSession: (teacherId: number, skill: string) =>
    apiFetch<Session>("/api/sessions/request", {
      method: "POST",
      body: new URLSearchParams({
        teacherId: teacherId.toString(),
        skill,
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      auth: true,
    } as any),

  updateSessionStatus: (sessionId: number, status: string) =>
    apiFetch<Session>(`/api/sessions/${sessionId}/status`, {
      method: "PUT",
      body: new URLSearchParams({ status }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      auth: true,
    } as any),

  getMySessions: () =>
    apiFetch<Session[]>("/api/sessions/my-sessions", {
      method: "GET",
      auth: true,
    }),
};

export { API_BASE_URL, AUTH_TOKEN_KEY };
