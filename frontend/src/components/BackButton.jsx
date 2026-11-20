import styles from "./BackButton.module.css";

export default function BackButton({ onClick }) {
  return (
    <button type="button" className={styles.button} onClick={onClick}>
      ← Back
    </button>
  );
}