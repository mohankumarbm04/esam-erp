// frontend/src/services/api.js
import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://esam-erp.onrender.com/api"
    : "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// ==================== AUTH APIs ====================
export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (userData) => api.post("/auth/register", userData),
  getMe: () => api.get("/auth/me"),
};

// ==================== ADMIN APIs ====================
export const adminAPI = {
  // Dashboard stats
  getStats: () => api.get("/dashboard/stats"),

  // Departments
  getDepartments: () => api.get("/departments"),
  getDepartment: (id) => api.get(`/departments/${id}`),
  createDepartment: (data) => api.post("/departments", data),
  updateDepartment: (id, data) => api.put(`/departments/${id}`, data),
  deleteDepartment: (id) => api.delete(`/departments/${id}`),

  // Teachers
  getTeachers: () => api.get("/teachers"),
  getTeacher: (id) => api.get(`/teachers/${id}`),
  createTeacher: (data) => api.post("/teachers", data),
  updateTeacher: (id, data) => api.put(`/teachers/${id}`, data),
  deleteTeacher: (id) => api.delete(`/teachers/${id}`),

  // Students
  getStudents: () => api.get("/students"),
  getStudent: (id) => api.get(`/students/${id}`),
  createStudent: (data) => api.post("/students", data),
  updateStudent: (id, data) => api.put(`/students/${id}`, data),
  deleteStudent: (id) => api.delete(`/students/${id}`),

  // Subjects
  getSubjects: () => api.get("/subjects"),
  getSubject: (id) => api.get(`/subjects/${id}`),
  createSubject: (data) => api.post("/subjects", data),
  updateSubject: (id, data) => api.put(`/subjects/${id}`, data),
  deleteSubject: (id) => api.delete(`/subjects/${id}`),
};

// ==================== HOD APIs ====================
export const hodAPI = {
  getDepartment: () => api.get("/hod/department"),
  getStats: () => api.get("/hod/stats"),
  getTeachers: () => api.get("/hod/teachers"),
  getStudents: () => api.get("/hod/students"),
  getAttendance: (semester) => api.get(`/hod/attendance?semester=${semester}`),
  getReports: (type, semester) =>
    api.get(`/hod/reports?type=${type}&semester=${semester}`),
};

// ==================== TEACHER APIs ====================
export const teacherAPI = {
  getDashboard: () => api.get("/teacher/dashboard"),
  getClasses: () => api.get("/teacher/classes"),
  getClassStudents: (classId) =>
    api.get(`/teacher/classes/${classId}/students`),
  markAttendance: (data) => api.post("/teacher/attendance", data),
  getAttendance: (classId, date) =>
    api.get(`/teacher/attendance/${classId}?date=${date}`),
  enterMarks: (data) => api.post("/teacher/marks", data),
  getMarks: (classId, examType) =>
    api.get(`/teacher/marks/${classId}?type=${examType}`),
  getStudents: () => api.get("/teacher/students"),
};

// ==================== STUDENT APIs ====================
export const studentAPI = {
  getProfile: () => api.get("/student/profile"),
  getAttendance: (semester) =>
    api.get(`/student/attendance?semester=${semester}`),
  getMarks: (semester) => api.get(`/student/marks?semester=${semester}`),
  getTranscript: () => api.get("/student/transcript"),
  getDocuments: () => api.get("/student/documents"),
  uploadDocument: (formData) =>
    api.post("/student/documents", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteDocument: (id) => api.delete(`/student/documents/${id}`),
};

// ==================== PARENT APIs ====================
export const parentAPI = {
  getChildren: () => api.get("/parent/children"),
  getChildAttendance: (childId, semester) =>
    api.get(`/parent/children/${childId}/attendance?semester=${semester}`),
  getChildMarks: (childId, semester) =>
    api.get(`/parent/children/${childId}/marks?semester=${semester}`),
  getChildReports: (childId) => api.get(`/parent/children/${childId}/reports`),
};

export default api;
