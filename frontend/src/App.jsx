import { useState } from "react";
import RegistrationForm from "./components/RegistrationForm";
import CourseSelection from "./pages/CourseSelection";
import ModeSelection from "./pages/ModeSelection";
import PaymentConfirmation from "./pages/PaymentConfirmation";

export default function App() {
  const [step, setStep] = useState("register");
  const [student, setStudent] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);

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