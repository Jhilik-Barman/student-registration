import styles from "./PaymentConfirmation.module.css";

export default function PaymentConfirmation({ student, course }) {
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
        <div className={`${styles.row} ${styles.totalRow}`}>
          <span className={styles.rowLabel}>Total Fee</span>
          <span className={styles.rowValue}>₹{course.fee}/- ({course.base}+{course.gst}% GST)</span>
        </div>
      </div>

      <div className={styles.paymentBox}>
        <h2 className={styles.paymentTitle}>💳 Summer Internship Payment</h2>
        <p className={styles.paymentInstr}>Please complete the payment using UPI:</p>
        <ul className={styles.paymentList}>
          <li><strong>Mobile users:</strong> Long-press the QR code to pay</li>
          <li><strong>Desktop users:</strong> Scan the QR using any UPI app</li>
        </ul>
        <div className={styles.qrPlaceholder}>
          <span>📱 QR Code</span>
          <p>Add your UPI QR code image here</p>
        </div>
        <p className={styles.amount}>Amount to Pay: <strong>₹{course.fee}/-</strong></p>
      </div>

      <button className={styles.restartBtn} onClick={() => window.location.reload()}>
        Register Another Student
      </button>
    </div>
  );
}