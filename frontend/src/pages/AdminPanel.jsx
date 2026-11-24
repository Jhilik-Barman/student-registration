import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { getAdminStudents, updatePaymentStatus } from "../utils/api";
import styles from "./AdminPanel.module.css";

export default function AdminPanel({ onLogout }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [screenshotError, setScreenshotError] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setError("Admin authentication required.");
      onLogout();
      return;
    }
    try {
      const data = await getAdminStudents(token);
      if (data.success) {
        setStudents(data.data);
      } else {
        setError(data.message || "Failed to load students");
        if (data.status === 401) {
          onLogout();
        }
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleViewNOC(studentId) {
    window.open(`/api/students/${studentId}/noc`, "_blank");
  }

  async function handleViewScreenshot(studentId) {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setScreenshotError("Admin authentication required.");
      onLogout();
      return;
    }

    setScreenshotError(null);
    const screenshotWindow = window.open("", "_blank");
    if (!screenshotWindow) {
      setScreenshotError("Please allow pop-ups to view the payment screenshot.");
      return;
    }

    try {
      const response = await fetch(`/api/students/${studentId}/screenshot`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        screenshotWindow.close();
        setScreenshotError("Unable to load screenshot. Please refresh and try again.");
        if (response.status === 401) onLogout();
        return;
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      screenshotWindow.location.href = url;
    } catch (err) {
      screenshotWindow.close();
      setScreenshotError("Unable to load screenshot. Please try again.");
    }
  }

  async function handlePaymentAction(studentId, status) {
    setActionLoading(true);
    setScreenshotError(null);
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setError("Admin authentication required.");
      onLogout();
      return;
    }

    try {
      const response = await updatePaymentStatus(studentId, status, token);
      if (response.success) {
        setStudents((prev) => prev.map((student) => student._id === studentId ? response.data : student));
        if (selectedStudent?._id === studentId) {
          setSelectedStudent(response.data);
        }
      } else {
        setScreenshotError(response.message || "Unable to update payment status.");
        if (response.status === 401) {
          onLogout();
        }
      }
    } catch (err) {
      setScreenshotError("Server error. Please try again.");
    } finally {
      setActionLoading(false);
    }
  }

  // ── filtered আগে define করা হচ্ছে ──
  const filtered = students.filter((s) => {
    const studentMode = typeof s.mode === "string" ? s.mode.trim().toLowerCase() : "";
    const matchesFilter =
      filter === "all" ||
      (filter === "online" && studentMode === "online") ||
      (filter === "offline" && studentMode === "offline");

    const matchesSearch =
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search) ||
      (s.rollNumber && s.rollNumber.toLowerCase().includes(search.toLowerCase())) ||
      (s.collegeName && s.collegeName.toLowerCase().includes(search.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  // ── filtered এর পরে define করা হচ্ছে ──
  function handleDownloadExcel() {
    const rows = filtered.map((s, i) => ({
      "#": i + 1,
      "Full Name": s.fullName,
      "College": s.collegeName,
      "Roll Number": s.rollNumber || "—",
      "Email": s.email,
      "Phone": s.phone,
      "Stream": s.stream || "—",
      "Course": s.courseName || "—",
      "Fee (₹)": s.fee || "—",
      "Mode": s.mode || "—",
      "NOC Uploaded": s.nocFileName ? "Yes" : "No",
      "Registered At": new Date(s.createdAt).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);

    const colWidths = Object.keys(rows[0] || {}).map((key) => ({
      wch: Math.max(key.length, ...rows.map((r) => String(r[key] ?? "").length)) + 2,
    }));
    worksheet["!cols"] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const fileName = `students_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>🎓 Admin Panel</h1>
          <p className={styles.subtitle}>Total Students: <strong>{students.length}</strong></p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className={styles.excelBtn}
            onClick={handleDownloadExcel}
            disabled={filtered.length === 0}
          >
            Download Excel{filtered.length !== students.length ? ` (${filtered.length})` : ""}
          </button>
          <button className={styles.refreshBtn} onClick={fetchStudents}> Refresh</button>
          <button className={styles.logoutBtn} onClick={onLogout}> Logout</button>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.controls}>
        <input
          className={styles.search}
          type="text"
          placeholder="Search by name, email, phone, roll no, college..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className={styles.filters}>
          {["all", "online", "offline"].map((f) => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.activeFilter : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : f === "online" ? "💻 Online" : "🏢 Offline"}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading && <div className={styles.loading}>Loading students...</div>}
      {error && <div className={styles.error}>{error}</div>}
      {screenshotError && <div className={styles.error} role="alert">{screenshotError}</div>}

      {!loading && !error && filtered.length === 0 && (
        <div className={styles.empty}>No students found.</div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>College</th>
                <th>Roll No.</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Stream</th>
                <th>Course</th>
                <th>Fee</th>
                <th>Mode</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s._id}>
                  <td>{i + 1}</td>
                  <td className={styles.nameCell}>{s.fullName}</td>
                  <td>{s.collegeName}</td>
                  <td>{s.rollNumber}</td>
                  <td>{s.email}</td>
                  <td>{s.phone}</td>
                  <td>{s.stream || "—"}</td>
                  <td>{s.courseName || "—"}</td>
                  <td>{s.fee ? `₹${s.fee}` : "—"}</td>
                  <td>
                    {s.mode ? (
                      <span className={`${styles.modeBadge} ${s.mode === "online" ? styles.online : styles.offline}`}>
                        {s.mode === "online" ? "💻 Online" : "🏢 Offline"}
                      </span>
                    ) : "—"}
                  </td>
                  <td>
                    <span className={`${styles.paymentBadge} ${s.paymentStatus === "Successful" ? styles.success : s.paymentStatus === "Rejected" ? styles.rejected : s.paymentStatus === "Pending" ? styles.pending : styles.notSubmitted}`}>
                      {s.paymentStatus || "Not Submitted"}
                    </span>
                  </td>
                  <td className={styles.actionCell}>
                    {s.screenshotPath ? (
                      <button className={styles.screenshotBtn} onClick={() => handleViewScreenshot(s._id)}>
                        View Screenshot
                      </button>
                    ) : "—"}
                    <button className={styles.detailBtn} onClick={() => setSelectedStudent(s)}>
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className={styles.overlay} onClick={() => setSelectedStudent(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedStudent(null)}>✕</button>
            <h2 className={styles.modalTitle}>Student Details</h2>
            <div className={styles.modalRows}>
              {[
                ["Full Name", selectedStudent.fullName],
                ["College", selectedStudent.collegeName],
                ["Roll Number", selectedStudent.rollNumber],
                ["Email", selectedStudent.email],
                ["Phone", selectedStudent.phone],
                ["Stream", selectedStudent.stream || "—"],
                ["Course", selectedStudent.courseName || "—"],
                ["Fee", selectedStudent.fee ? `₹${selectedStudent.fee}/-` : "—"],
                ["Mode", selectedStudent.mode || "—"],
                ["Payment Status", selectedStudent.paymentStatus || "Not Submitted"],
                ["Payment Submitted", selectedStudent.paymentSubmittedAt ? new Date(selectedStudent.paymentSubmittedAt).toLocaleString() : "—"],
                ["Reviewed At", selectedStudent.paymentReviewedAt ? new Date(selectedStudent.paymentReviewedAt).toLocaleString() : "—"],
                ["NOC File", selectedStudent.nocFileName || "Not uploaded"],
                ["Registered", new Date(selectedStudent.createdAt).toLocaleString()],
              ].map(([label, value]) => (
                <div key={label} className={styles.modalRow}>
                  <span className={styles.modalLabel}>{label}</span>
                  <span className={styles.modalValue}>{value}</span>
                </div>
              ))}
            </div>
            {selectedStudent.nocFileName && (
              <button className={styles.downloadBtn} onClick={() => handleViewNOC(selectedStudent._id)}>
                 View / Download NOC
              </button>
            )}

            {selectedStudent.screenshotPath && (
              <button className={styles.screenshotBtn} onClick={() => handleViewScreenshot(selectedStudent._id)}>
                View Payment Screenshot
              </button>
            )}

            <div className={styles.modalActions}>
              <button
                className={styles.approveBtn}
                disabled={actionLoading || selectedStudent.paymentStatus === "Successful"}
                onClick={() => handlePaymentAction(selectedStudent._id, "Successful")}
              >
                Approve
              </button>
              <button
                className={styles.rejectBtn}
                disabled={actionLoading || selectedStudent.paymentStatus === "Rejected"}
                onClick={() => handlePaymentAction(selectedStudent._id, "Rejected")}
              >
                Reject
              </button>
            </div>
            {screenshotError && <div className={styles.error}>{screenshotError}</div>}
          </div>
        </div>
      )}
    </div>
  );
}