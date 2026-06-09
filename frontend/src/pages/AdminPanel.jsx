import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import styles from "./AdminPanel.module.css";

export default function AdminPanel({ onLogout }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    try {
      const res = await fetch("/api/students");
      const data = await res.json();
      if (data.success) {
        setStudents(data.data);
      } else {
        setError("Failed to load students");
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

  // ── filtered আগে define করা হচ্ছে ──
  const filtered = students.filter((s) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "online" && s.mode === "online") ||
      (filter === "offline" && s.mode === "offline");

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
                <th>NOC</th>
                <th>Details</th>
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
                    {s.nocFileName ? (
                      <button className={styles.nocBtn} onClick={() => handleViewNOC(s._id)}>
                         View
                      </button>
                    ) : "—"}
                  </td>
                  <td>
                    <button className={styles.detailBtn} onClick={() => setSelectedStudent(s)}>
                      👁 View
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
          </div>
        </div>
      )}
    </div>
  );
}