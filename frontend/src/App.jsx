import { useState, useEffect } from "react";
import RegistrationForm from "./components/RegistrationForm";
import CourseSelection from "./pages/CourseSelection";
import ModeSelection from "./pages/ModeSelection";
import PaymentConfirmation from "./pages/PaymentConfirmation";
import AdminPanel from "./pages/AdminPanel";
import AdminLogin from "./pages/AdminLogin";

export default function App() {
  const [step, setStep] = useState("register");
  const [student, setStudent] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const isAdminRoute = window.location.pathname === "/admin";

  useEffect(() => {
    if (isAdminRoute) {
      const token = localStorage.getItem("adminToken");
      if (token) {
        // Verify token with backend
        fetch("/api/admin/verify", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) setIsAdminLoggedIn(true);
            else localStorage.removeItem("adminToken");
          })
          .catch(() => localStorage.removeItem("adminToken"));
      }
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("adminToken");
    setIsAdminLoggedIn(false);
  }

  // Admin route
  if (isAdminRoute) {
    if (!isAdminLoggedIn) {
      return <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />;
    }
    return <AdminPanel onLogout={handleLogout} />;
  }

  function handleRegistered(studentData) {
    setStudent(studentData);
    setStep("course");
  }

  function handleCourseComplete(updatedStudent) {
    setSelectedCourse(updatedStudent.course);
    setStudent(updatedStudent);
    setStep("mode");
  }

  function handleModeComplete(mode) {
    setSelectedMode(mode);
    setStep("payment");
  }

  return (
    <>
      {step === "register" && (
        <RegistrationForm onRegistered={handleRegistered} />
      )}
      {step === "course" && student && (
        <CourseSelection student={student} onComplete={handleCourseComplete} />
      )}
      {step === "mode" && student && selectedCourse && (
        <ModeSelection
          student={student}
          course={selectedCourse}
          onComplete={handleModeComplete}
        />
      )}
      {step === "payment" && student && selectedCourse && (
        <PaymentConfirmation
          student={student}
          course={selectedCourse}
          mode={selectedMode}
        />
      )}
    </>
  );
}