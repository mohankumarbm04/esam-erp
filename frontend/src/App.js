// App.js
import ParentDashboard from "./pages/parent/Dashboard";
import ChildAttendance from "./pages/parent/ChildAttendance";
import ChildMarks from "./pages/parent/ChildMarks";
import ChildReports from "./pages/parent/ChildReports";
import StudentDashboard from "./pages/student/Dashboard";
import StudentAttendance from "./pages/student/MyAttendance";
import StudentMarks from "./pages/student/MyMarks";
import StudentTranscript from "./pages/student/Transcript";
import StudentDocuments from "./pages/student/Documents";
import TeacherMyClasses from "./pages/teacher/MyClasses";
import TeacherMarkAttendance from "./pages/teacher/MarkAttendance";
import TeacherEnterMarks from "./pages/teacher/EnterMarks";
import TeacherStudents from "./pages/teacher/Students";
import HODTeachers from "./pages/hod/Teachers";
import HODStudents from "./pages/hod/Students";
import HODAttendance from "./pages/hod/Attendance";
import HODReports from "./pages/hod/Reports";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/auth/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import Departments from "./pages/admin/Departments";
import Teachers from "./pages/admin/Teachers";
import Students from "./pages/admin/Students";
import Subjects from "./pages/admin/Subjects";
import Attendance from "./pages/admin/Attendance";
import Reports from "./pages/admin/Reports";
import HODDashboard from "./pages/hod/Dashboard";
import TeacherDashboard from "./pages/teacher/Dashboard";
import "./App.css";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Admin Dashboard Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Management Routes */}
          <Route
            path="/admin/departments"
            element={
              <ProtectedRoute>
                <Departments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/teachers"
            element={
              <ProtectedRoute>
                <Teachers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/students"
            element={
              <ProtectedRoute>
                <Students />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/subjects"
            element={
              <ProtectedRoute>
                <Subjects />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/attendance"
            element={
              <ProtectedRoute>
                <Attendance />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />

          {/* HOD Dashboard Route */}
          <Route
            path="/hod/dashboard"
            element={
              <ProtectedRoute>
                <HODDashboard />
              </ProtectedRoute>
            }
          />

          {/* HOD Management Routes */}
          <Route
            path="/hod/teachers"
            element={
              <ProtectedRoute>
                <HODTeachers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/hod/students"
            element={
              <ProtectedRoute>
                <HODStudents />
              </ProtectedRoute>
            }
          />

          <Route
            path="/hod/attendance"
            element={
              <ProtectedRoute>
                <HODAttendance />
              </ProtectedRoute>
            }
          />

          <Route
            path="/hod/reports"
            element={
              <ProtectedRoute>
                <HODReports />
              </ProtectedRoute>
            }
          />

          {/* Teacher Dashboard Route */}
          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />

          {/* Teacher Management Routes */}
          <Route
            path="/teacher/classes"
            element={
              <ProtectedRoute>
                <TeacherMyClasses />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacher/attendance"
            element={
              <ProtectedRoute>
                <TeacherMarkAttendance />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacher/marks"
            element={
              <ProtectedRoute>
                <TeacherEnterMarks />
              </ProtectedRoute>
            }
          />

          <Route
            path="/teacher/students"
            element={
              <ProtectedRoute>
                <TeacherStudents />
              </ProtectedRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/attendance"
            element={
              <ProtectedRoute>
                <StudentAttendance />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/marks"
            element={
              <ProtectedRoute>
                <StudentMarks />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/transcript"
            element={
              <ProtectedRoute>
                <StudentTranscript />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/documents"
            element={
              <ProtectedRoute>
                <StudentDocuments />
              </ProtectedRoute>
            }
          />

          {/* Parent Routes */}
          <Route
            path="/parent/dashboard"
            element={
              <ProtectedRoute>
                <ParentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/parent/attendance"
            element={
              <ProtectedRoute>
                <ChildAttendance />
              </ProtectedRoute>
            }
          />

          <Route
            path="/parent/marks"
            element={
              <ProtectedRoute>
                <ChildMarks />
              </ProtectedRoute>
            }
          />

          <Route
            path="/parent/reports"
            element={
              <ProtectedRoute>
                <ChildReports />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
