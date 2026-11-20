import { useState } from "react";
import { confirmPayment } from "../utils/api";
import styles from "./PaymentConfirmation.module.css";

function generateUPIQR(upiId, name, amount, note) {
  const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    name
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    upiString
  )}`;
}

export default function PaymentConfirmation({ student, course, mode }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [preview, setPreview] = useState(null);

  const qrUrl = generateUPIQR(
    "corporatesguide@idfcbank",
    "Corporates Guide",
    course.fee,
    `Internship Fee - ${course.name} - ${student.fullName}`
  );

  function handleFileChange(e) {
    const file = e.target.files[0];

    if (!file) return;

    setScreenshot(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  }

  async function handlePaymentDone() {
    if (!screenshot) {
      setError("Please upload your payment screenshot before submitting.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("screenshot", screenshot);

    const result = await confirmPayment(student._id, formData);

    if (result.ok) {
      setSubmitted(true);
    } else {
      setError(result.message || "Something went wrong. Please try again.");
    }

    setLoading(false);
  }

  if (submitted) {
    return (
      <div className={styles.card}>
        <div className={styles.successPage}>
          <div className={styles.successIcon}></div>

          <h1 className={styles.successTitle}>
            Screenshot Submitted
          </h1>

          <p className={styles.successSubtitle}>
            Please keep an eye on your email inbox. We will verify your registration and notify you once it is confirmed.
          </p>

          <div className={styles.successDetails}>
            <div className={styles.row}>
              <span className={styles.rowLabel}>Name</span>
              <span className={styles.rowValue}>{student.fullName}</span>
            </div>

            <div className={styles.row}>
              <span className={styles.rowLabel}>College</span>
              <span className={styles.rowValue}>{student.collegeName}</span>
            </div>

            <div className={styles.row}>
              <span className={styles.rowLabel}>Course</span>
              <span className={styles.rowValue}>{course.name}</span>
            </div>

            <div className={styles.row}>
              <span className={styles.rowLabel}>Amount Paid</span>
              <span className={styles.rowValue}>₹{course.fee}/-</span>
            </div>
          </div>

          <p className={styles.successNote}>
            Our team will verify your payment within 24 hours and send another email once it is confirmed.
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.icon}></div>

        <h1 className={styles.title}>
          Registration Complete!
        </h1>

        <p className={styles.subtitle}>
          Your internship registration has been confirmed.
        </p>
      </div>

      <div className={styles.summary}>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Name</span>
          <span className={styles.rowValue}>
            {student.fullName}
          </span>
        </div>

        <div className={styles.row}>
          <span className={styles.rowLabel}>College</span>
          <span className={styles.rowValue}>
            {student.collegeName}
          </span>
        </div>

        <div className={styles.row}>
          <span className={styles.rowLabel}>Roll No.</span>
          <span className={styles.rowValue}>
            {student.rollNumber}
          </span>
        </div>

        <div className={styles.row}>
          <span className={styles.rowLabel}>Email</span>
          <span className={styles.rowValue}>
            {student.email}
          </span>
        </div>

        <div className={styles.row}>
          <span className={styles.rowLabel}>Phone</span>
          <span className={styles.rowValue}>
            {student.phone}
          </span>
        </div>

        <div className={styles.row}>
          <span className={styles.rowLabel}>Stream</span>
          <span className={styles.rowValue}>
            {student.stream}
          </span>
        </div>

        <div className={styles.row}>
          <span className={styles.rowLabel}>Course</span>
          <span className={styles.rowValue}>
            {course.name}
          </span>
        </div>

        <div className={styles.row}>
          <span className={styles.rowLabel}>Mode</span>
          <span className={styles.rowValue}>
            {mode === "online"
              ? "💻 Online"
              : "🏢 Offline"}
          </span>
        </div>

        <div
          className={`${styles.row} ${styles.totalRow}`}
        >
          <span className={styles.rowLabel}>
            Total Fee
          </span>

          <span className={styles.rowValue}>
            ₹{course.fee}/- ({course.base}+{course.gst}%
            GST)
          </span>
        </div>
      </div>

      <div className={styles.paymentBox}>
        <h2 className={styles.paymentTitle}>
          Summer Internship Payment
        </h2>

        <div className={styles.bankBadge}>
          IDFC FIRST Bank
        </div>

        <p className={styles.scanTitle}>
          SCAN &amp; PAY
        </p>

        <div className={styles.qrWrapper}>
          <img
            src={qrUrl}
            alt="UPI QR Code"
            className={styles.qrImage}
          />
        </div>

        <p className={styles.upiId}>
          UPI ID:{" "}
          <strong>corporatesguide@idfcbank</strong>
        </p>

        <p className={styles.amount}>
          Amount: <strong>₹{course.fee}/-</strong>
        </p>

        <div className={styles.instructions}>
          <p>
            <strong>Mobile:</strong> Long-press the QR
            code to pay
          </p>

          <p>
            <strong>Desktop:</strong> Scan using any
            UPI app (GPay, PhonePe, Paytm)
          </p>
        </div>
      </div>

      <div className={styles.uploadBox}>
        <p className={styles.uploadLabel}>
          Upload Payment Screenshot
        </p>

        <p className={styles.uploadHint}>
          Take a payment success screenshot from GPay /
          PhonePe / Paytm
        </p>

        <label className={styles.fileLabel}>
          Choose Screenshot

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
        </label>

        {preview && (
          <div className={styles.previewWrapper}>
            <p className={styles.previewText}>
              Screenshot selected:
            </p>

            <img
              src={preview}
              alt="Payment screenshot preview"
              className={styles.previewImg}
            />
          </div>
        )}
      </div>

      {error && (
        <div className={styles.errorMsg}>
          {error}
        </div>
      )}

      <button
        className={styles.paidBtn}
        onClick={handlePaymentDone}
        disabled={loading || !screenshot}
      >
        {loading ? "Submitting..." : "Done"}
      </button>

    </div>
  );
}