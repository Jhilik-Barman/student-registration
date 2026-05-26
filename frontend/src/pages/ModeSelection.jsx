import { useState } from "react";
import styles from "./ModeSelection.module.css";

export default function ModeSelection({ student, course, onComplete }) {
  const [mode, setMode] = useState("");
  const [nocFile, setNocFile] = useState(null);
  const [nocError, setNocError] = useState("");
  const [modeError, setModeError] = useState("");
  const [uploading, setUploading] = useState(false);

  function handleModeSelect(selectedMode) {
    setMode(selectedMode);
    setModeError("");
    setNocFile(null);
    setNocError("");
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setNocError("Only PDF files are allowed");
      setNocFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setNocError("File size must be less than 5MB");
      setNocFile(null);
      return;
    }

    setNocFile(file);
    setNocError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!mode) {
      setModeError("Please select Online or Offline mode");
      return;
    }

    if (mode === "online" && !nocFile) {
      setNocError("Please upload your NOC in PDF format");
      return;
    }

    setUploading(true);

    // If online, upload NOC to backend
    if (mode === "online") {
      const formData = new FormData();
      formData.append("noc", nocFile);
      formData.append("studentId", student._id);

      try {
        const response = await fetch(`/api/students/${student._id}/noc`, {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
        if (!response.ok) {
          setNocError(result.message || "Failed to upload NOC. Please try again.");
          setUploading(false);
          return;
        }
      } catch (error) {
        setNocError("Upload failed. Please try again.");
        setUploading(false);
        return;
      }
    }

    setUploading(false);
    onComplete(mode);
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.icon}>🏫</div>
        <h1 className={styles.title}>Select Internship Mode</h1>
        <p className={styles.subtitle}>
          Hi <strong>{student.fullName}</strong>, choose how you want to attend the internship.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        {/* Mode Selection */}
        <div className={styles.group}>
          <label className={styles.label}>Internship Mode</label>
          {modeError && <p className={styles.error}>⚠ {modeError}</p>}
          <div className={styles.modeCards}>
            <div
              className={`${styles.modeCard} ${mode === "online" ? styles.selected : ""}`}
              onClick={() => handleModeSelect("online")}
            >
              <div className={styles.modeIcon}>💻</div>
              <div className={styles.modeInfo}>
                <span className={styles.modeName}>Online</span>
                <span className={styles.modeDesc}>Work from home, remote internship</span>
              </div>
              <div className={`${styles.radio} ${mode === "online" ? styles.radioSelected : ""}`} />
            </div>

            <div
              className={`${styles.modeCard} ${mode === "offline" ? styles.selected : ""}`}
              onClick={() => handleModeSelect("offline")}
            >
              <div className={styles.modeIcon}>🏢</div>
              <div className={styles.modeInfo}>
                <span className={styles.modeName}>Offline</span>
                <span className={styles.modeDesc}>In-person, visit office regularly</span>
              </div>
              <div className={`${styles.radio} ${mode === "offline" ? styles.radioSelected : ""}`} />
            </div>
          </div>
        </div>

        {/* NOC Upload — only for Online */}
        {mode === "online" && (
          <div className={styles.group}>
            <label className={styles.label}>Upload NOC (No Objection Certificate)</label>
            <p className={styles.hint}>
              Your college must provide a NOC for online internship. Upload it in PDF format (max 5MB).
            </p>
            <div className={`${styles.uploadBox} ${nocFile ? styles.uploaded : ""} ${nocError ? styles.uploadError : ""}`}>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className={styles.fileInput}
                id="nocFile"
              />
              <label htmlFor="nocFile" className={styles.uploadLabel}>
                {nocFile ? (
                  <>
                    <span className={styles.uploadIcon}>✅</span>
                    <span className={styles.fileName}>{nocFile.name}</span>
                    <span className={styles.fileSize}>({(nocFile.size / 1024).toFixed(1)} KB)</span>
                  </>
                ) : (
                  <>
                    <span className={styles.uploadIcon}>📄</span>
                    <span>Click to upload PDF</span>
                    <span className={styles.uploadHint}>PDF only, max 5MB</span>
                  </>
                )}
              </label>
            </div>
            {nocError && <p className={styles.error}>⚠ {nocError}</p>}
          </div>
        )}

        <button type="submit" className={styles.submitBtn} disabled={uploading}>
          {uploading ? "Uploading..." : "Continue to Payment →"}
        </button>
      </form>
    </div>
  );
}