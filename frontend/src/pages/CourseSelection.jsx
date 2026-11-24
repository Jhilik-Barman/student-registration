import { useState } from "react";
import BackButton from "../components/BackButton";
import {
  ALL_STREAMS,
  EXECUTIVE_INSTITUTE_COLLEGE,
  EXECUTIVE_INSTITUTE_COURSE,
  EXECUTIVE_INSTITUTE_STREAMS,
  getCoursesForStream,
  getGroupLabel,
} from "../utils/courseData";
import { validateStream, validateCourse } from "../utils/validators";
import { selectCourse } from "../utils/api";
import styles from "./CourseSelection.module.css";

export default function CourseSelection({ student, onComplete, onBack }) {
  const [stream, setStream] = useState(student.stream || "");
  const [selectedCourse, setSelectedCourse] = useState(student.course || null);
  const [errors, setErrors] = useState({ stream: "", course: "" });
  const [submitting, setSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState(null);

  const executiveInstitute = student.collegeName === EXECUTIVE_INSTITUTE_COLLEGE;
  const streams = executiveInstitute ? EXECUTIVE_INSTITUTE_STREAMS : ALL_STREAMS;
  const courses = executiveInstitute
    ? (EXECUTIVE_INSTITUTE_STREAMS.includes(stream) ? [EXECUTIVE_INSTITUTE_COURSE] : [])
    : getCoursesForStream(stream);
  const groupLabel = executiveInstitute ? "Engineering" : getGroupLabel(stream);

  function handleStreamChange(e) {
    setStream(e.target.value);
    setSelectedCourse(null);
    setErrors({ stream: "", course: "" });
    setServerMessage(null);
  }

  function handleCourseSelect(course) {
    setSelectedCourse(course);
    setErrors((prev) => ({ ...prev, course: "" }));
    setServerMessage(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const streamErr = validateStream(stream);
    const courseErr = validateCourse(selectedCourse);
    setErrors({ stream: streamErr, course: courseErr });
    if (streamErr || courseErr) return;

    setSubmitting(true);
    const result = await selectCourse(student._id, {
      stream,
      courseId: selectedCourse.id,
      courseName: selectedCourse.name,
      fee: selectedCourse.fee,
    });

    if (result.ok) {
      onComplete({ ...student, stream, course: selectedCourse });
    } else {
      setServerMessage(result.message || "Something went wrong. Please try again.");
    }
    setSubmitting(false);
  }

  return (
    <div className={styles.card}>
      <BackButton onClick={onBack} />
      <div className={styles.header}>
        <div className={styles.icon}>📚</div>
        <h1 className={styles.title}>Select Your Internship Topic</h1>
        <p className={styles.subtitle}>
          Welcome, <strong>{student.fullName}</strong>! Please choose your stream and internship topic.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        <div className={styles.group}>
          <label className={styles.label} htmlFor="stream">Stream / Department</label>
          <select
            id="stream"
            className={`${styles.select} ${errors.stream ? styles.hasError : ""}`}
            value={stream}
            onChange={handleStreamChange}
          >
            <option value="">-- Select your stream --</option>
            {streams.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.stream && <p className={styles.error}>⚠ {errors.stream}</p>}
        </div>

        {stream && courses.length > 0 && (
          <div className={styles.group}>
            <label className={styles.label}>
              Internship Topics for <span className={styles.groupBadge}>{groupLabel}</span>
            </label>
            {errors.course && <p className={styles.error}>⚠ {errors.course}</p>}
            <div className={styles.courseList}>
              {courses.map((course) => (
                <div
                  key={course.id}
                  className={`${styles.courseCard} ${selectedCourse?.id === course.id ? styles.selected : ""}`}
                  onClick={() => handleCourseSelect(course)}
                >
                  <div className={styles.courseInfo}>
                    <span className={styles.courseName}>{course.name}</span>
                    <span className={styles.courseFee}>
                      ₹{course.fee}/-
                      {course.gst > 0 && (
                        <span className={styles.feeBreakup}> ({course.base}+{course.gst}% GST)</span>
                      )}
                    </span>
                  </div>
                  <div className={`${styles.radio} ${selectedCourse?.id === course.id ? styles.radioSelected : ""}`} />
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedCourse && (
          <div className={styles.feeSummary}>
            <div className={styles.feeRow}>
              <span>Course</span>
              <span>{selectedCourse.name}</span>
            </div>
            {selectedCourse.gst > 0 && (
              <>
                <div className={styles.feeRow}>
                  <span>Base Fee</span>
                  <span>₹{selectedCourse.base}/-</span>
                </div>
                <div className={styles.feeRow}>
                  <span>GST ({selectedCourse.gst}%)</span>
                  <span>₹{selectedCourse.fee - selectedCourse.base}/-</span>
                </div>
              </>
            )}
            <div className={`${styles.feeRow} ${styles.feeTotal}`}>
              <span>Total Fee</span>
              <span>₹{selectedCourse.fee}/-</span>
            </div>
          </div>
        )}

        {serverMessage && (
          <div className={styles.errorMsg} role="alert">❌ {serverMessage}</div>
        )}

        <button type="submit" className={styles.submitBtn} disabled={submitting || !selectedCourse}>
          {submitting ? "Saving..." : "Confirm Course Selection →"}
        </button>
      </form>
    </div>
  );
}