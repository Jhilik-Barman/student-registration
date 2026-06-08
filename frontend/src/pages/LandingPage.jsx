import styles from "./LandingPage.module.css";
import logo from "../../../logog.png";

export default function LandingPage({ onStudentClick, onAdminClick }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.overlay} />

      <div className={styles.header}>
        <div className={styles.logo}>
          <img src={logo} alt="Logo" />
        </div>
        <h1 className={styles.headerTitle}>Corporates Guide</h1>
        <p className={styles.headerSubtitle}>
          Summer Internship 2026 — Registration Portal
        </p>
      </div>

      <div className={styles.cards}>
        {/* Student Card */}
        <div className={styles.card}>
          <div className={styles.cardTop}>
            <div className={`${styles.iconBox} ${styles.iconStudent}`}>
              <span>👨‍🎓</span>
            </div>
            <div>
              <p className={`${styles.tag} ${styles.tagStudent}`}>
                PUBLIC ACCESS
              </p>
              <h2 className={styles.cardTitle}>Student Registration</h2>
            </div>
          </div>
          <p className={styles.cardDesc}>
            For students applying for Summer Internship 2026. Register with your
            college details, select your preferred course, and complete the
            payment process.
          </p>
          <button
            className={`${styles.btn} ${styles.btnStudent}`}
            onClick={onStudentClick}
          >
            Access Student Portal →
          </button>
        </div>

        {/* Admin Card */}
        <div className={styles.card}>
          <div className={styles.cardTop}>
            <div className={`${styles.iconBox} ${styles.iconAdmin}`}>
              <span>🔐</span>
            </div>
            <div>
              <p className={`${styles.tag} ${styles.tagAdmin}`}>
                RESTRICTED — AUTHORISED ONLY
              </p>
              <h2 className={styles.cardTitle}>Admin Login</h2>
            </div>
          </div>
          <p className={styles.cardDesc}>
            For authorised Corporates Guide officials only. Login using your
            registered credentials to access the admin panel and manage student
            registrations.
          </p>
          <button
            className={`${styles.btn} ${styles.btnAdmin}`}
            onClick={onAdminClick}
          >
            Access Admin Panel →
          </button>
        </div>
      </div>

      <p className={styles.footer}>
        © 2026 Corporates Guide. All rights reserved.
      </p>
    </div>
  );
}
