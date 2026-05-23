import { useState } from "react";
import FormInput from "./FormInput";
import { validateFullName, validateEmail, validatePhone } from "../utils/validators";
import { registerStudent } from "../utils/api";
import styles from "./RegistrationForm.module.css";

const initialState = { fullName: "", email: "", phone: "" };
const initialErrors = { fullName: "", email: "", phone: "" };
const initialTouched = { fullName: false, email: false, phone: false };

export default function RegistrationForm() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);
  const [touched, setTouched] = useState(initialTouched);
  const [submitting, setSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState(null); // { type: 'success'|'error', text: '' }

  function validate(field, value) {
    if (field === "fullName") return validateFullName(value);
    if (field === "email") return validateEmail(value);
    if (field === "phone") return validatePhone(value);
    return "";
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
    }
    setServerMessage(null);
  }

  function handleBlur(e) {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  }

  function isFormValid() {
    return (
      !validateFullName(form.fullName) &&
      !validateEmail(form.email) &&
      !validatePhone(form.phone)
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Touch all fields on submit
    const allTouched = { fullName: true, email: true, phone: true };
    setTouched(allTouched);
    const newErrors = {
      fullName: validate("fullName", form.fullName),
      email: validate("email", form.email),
      phone: validate("phone", form.phone),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) return;

    setSubmitting(true);
    setServerMessage(null);

    const result = await registerStudent(form);

    if (result.ok) {
      setServerMessage({ type: "success", text: result.message || "Registration successful!" });
      setForm(initialState);
      setErrors(initialErrors);
      setTouched(initialTouched);
    } else {
      const msg =
        result.errors?.map((e) => e.message).join(", ") ||
        result.message ||
        "Something went wrong. Please try again.";
      setServerMessage({ type: "error", text: msg });
    }

    setSubmitting(false);
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.icon}>🎓</div>
        <h1 className={styles.title}>Student Registration</h1>
        <p className={styles.subtitle}>Fill in the details below to register</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className={styles.form}>
        <FormInput
          label="Full Name"
          id="fullName"
          type="text"
          value={form.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.fullName ? errors.fullName : ""}
          placeholder="e.g. Rahul Kumar Sharma"
          hint="Enter your full name as per official records"
          maxLength={100}
        />

        <FormInput
          label="Gmail Address"
          id="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email ? errors.email : ""}
          placeholder="yourname@gmail.com"
          hint="Only @gmail.com addresses are accepted"
        />

        <FormInput
          label="Mobile Number"
          id="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.phone ? errors.phone : ""}
          placeholder="e.g. 9876543210"
          hint="10-digit Indian mobile number (starts with 6, 7, 8, or 9)"
          maxLength={10}
        />

        {serverMessage && (
          <div
            className={`${styles.serverMsg} ${
              serverMessage.type === "success" ? styles.successMsg : styles.errorMsg
            }`}
            role="alert"
          >
            {serverMessage.type === "success" ? "✅ " : "❌ "}
            {serverMessage.text}
          </div>
        )}

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={submitting}
        >
          {submitting ? "Registering..." : "Register Student"}
        </button>
      </form>
    </div>
  );
}
