import { useState } from "react";
import { confirmPayment } from "../utils/api";
import styles from "./PaymentConfirmation.module.css";

function generateUPIQR(upiId, name, amount, note) {
  const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;
}

export default function PaymentConfirmation({ student, course, mode }) {
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const qrUrl = generateUPIQR(
    "corporatesguide@idfcbank",
    "Corporates Guide",
    course.fee,
    `Internship Fee - ${course.name} - ${student.fullName}`
  );

  const upiDeepLink = `upi://pay?pa=corporatesguide@idfcbank&pn=${encodeURIComponent("Corporates Guide")}&am=${course.fee}&cu=INR&tn=${encodeURIComponent(`Internship Fee - ${course.name}`)}`;

  async function handlePaymentDone() {
    setLoading(true);
    setError("");
    const result = await confirmPayment(student._id);
    if (result.ok) {
      setPaid(true);
    } else {
      setError(result.message || "Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  if (paid) {
    return (
      <div className={styles.card}>
        <div className={styles.successPage}>
          <div className={styles.successIcon}>✅</div>
          <h1 className={styles.successTitle}>Payment Confirmed!</h1>
          <p className={styles.successSubtitle}>
            A confirmation email has been sent to <strong>{student.email}</strong>
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
            📧 Please check your email inbox for the confirmation details.
          </p>
          <button className={styles.restartBtn} onClick={() => window.location.reload()}>
            Register Another Student
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.icon}>🎉</div>
        <h1 className={styles.title}>Registration Complete!</h1>
        <p className={styles.subtitle}>Your internship registration has been confirmed.</p>
      </div>

      <div className={styles.summary}>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Name</span>
          <span className={styles.rowValue}>{student.fullName}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>College</span>
          <span className={styles.rowValue}>{student.collegeName}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Roll No.</span>
          <span className={styles.rowValue}>{student.rollNumber}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Email</span>
          <span className={styles.rowValue}>{student.email}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Phone</span>
          <span className={styles.rowValue}>{student.phone}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Stream</span>
          <span className={styles.rowValue}>{student.stream}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Course</span>
          <span className={styles.rowValue}>{course.name}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Mode</span>
          <span className={styles.rowValue}>{mode === "online" ? "💻 Online" : "🏢 Offline"}</span>
        </div>
        <div className={`${styles.row} ${styles.totalRow}`}>
          <span className={styles.rowLabel}>Total Fee</span>
          <span className={styles.rowValue}>₹{course.fee}/- ({course.base}+{course.gst}% GST)</span>
        </div>
      </div>

      <div className={styles.paymentBox}>
        <h2 className={styles.paymentTitle}>💳 Summer Internship Payment</h2>
        <div className={styles.bankBadge}>IDFC FIRST Bank</div>
        <p className={styles.scanTitle}>SCAN &amp; PAY</p>
        <div className={styles.qrWrapper}>
          <img src={qrUrl} alt="UPI QR Code" className={styles.qrImage} />
        </div>
        <p className={styles.upiId}>UPI ID: <strong>corporatesguide@idfcbank</strong></p>
        <p className={styles.amount}>Amount: <strong>₹{course.fee}/-</strong></p>
        <div className={styles.instructions}>
          <p>📱 <strong>Mobile:</strong> Long-press the QR code to pay</p>
          <p>🖥️ <strong>Desktop:</strong> Scan using any UPI app (GPay, PhonePe, Paytm)</p>
        </div>
        <a href={upiDeepLink} className={styles.payBtn}>
          Pay ₹{course.fee}/- Now
        </a>
      </div>

      {error && (
        <div className={styles.errorMsg}>❌ {error}</div>
      )}

      <button
        className={styles.paidBtn}
        onClick={handlePaymentDone}
        disabled={loading}
      >
        {loading ? "Sending confirmation..." : "✅ I Have Paid — Send Confirmation Email"}
      </button>

      <button className={styles.restartBtn} onClick={() => window.location.reload()}>
        Register Another Student
      </button>
    </div>
  );
}