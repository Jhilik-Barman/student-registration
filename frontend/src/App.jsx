import { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import RegistrationForm from "./components/RegistrationForm";
import CourseSelection from "./pages/CourseSelection";
import ModeSelection from "./pages/ModeSelection";
import PaymentConfirmation from "./pages/PaymentConfirmation";
import AdminPanel from "./pages/AdminPanel";
import AdminLogin from "./pages/AdminLogin";

export default function App() {
  const [page, setPage] = useState("landing");
  const [step, setStep] = useState("register");
  const [student, setStudent] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    if (page === "adminLogin" || page === "admin") {
      const token = localStorage.getItem("adminToken");
      if (token) {
        fetch("/api/admin/verify", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setIsAdminLoggedIn(true);
              setPage("admin");
            } else {
              localStorage.removeItem("adminToken");
            }
          })
          .catch(() => localStorage.removeItem("adminToken"));
      }
    }
  }, [page]);

  function handleLogout() {
    localStorage.removeItem("adminToken");
    setIsAdminLoggedIn(false);
    setPage("landing");
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

  // Landing Page
  if (page === "landing") {
    return (
      <LandingPage
        onStudentClick={() => { setPage("student"); setStep("register"); }}
        onAdminClick={() => setPage("adminLogin")}
      />
    );
  }

  // Admin Login
  if (page === "adminLogin") {
    if (isAdminLoggedIn) {
      return <AdminPanel onLogout={handleLogout} />;
    }
    return (
      <AdminLogin onLogin={() => { setIsAdminLoggedIn(true); setPage("admin"); }} />
    );
  }

  // Admin Panel
  if (page === "admin") {
    return <AdminPanel onLogout={handleLogout} />;
  }

  // Student Flow
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