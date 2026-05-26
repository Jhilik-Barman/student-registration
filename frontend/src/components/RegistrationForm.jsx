import { useState } from "react";
import FormInput from "./FormInput";
import { validateFullName, validateEmail, validatePhone, validateCollegeName, validateRollNumber } from "../utils/validators";
import { registerStudent } from "../utils/api";
import styles from "./RegistrationForm.module.css";

const initialState = { fullName: "", email: "", phone: "", collegeName: "", rollNumber: "" };
const initialErrors = { fullName: "", email: "", phone: "", collegeName: "", rollNumber: "" };
const initialTouched = { fullName: false, email: false, phone: false, collegeName: false, rollNumber: false };

export default function RegistrationForm({ onRegistered }) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);
  const [touched, setTouched] = useState(initialTouched);
  const [submitting, setSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState(null);

  function validate(field, value) {
    if (field === "fullName") return validateFullName(value);
    if (field === "email") return validateEmail(value);
    if (field === "phone") return validatePhone(value);
    if (field === "collegeName") return validateCollegeName(value);
    if (field === "rollNumber") return validateRollNumber(value);
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

  async function handleSubmit(e) {
    e.preventDefault();
    const allTouched = { fullName: true, email: true, phone: true, collegeName: true, rollNumber: true };
    setTouched(allTouched);
    const newErrors = {
      fullName: validate("fullName", form.fullName),
      email: validate("email", form.email),
      phone: validate("phone", form.phone),
      collegeName: validate("collegeName", form.collegeName),
      rollNumber: validate("rollNumber", form.rollNumber),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    setSubmitting(true);
    setServerMessage(null);

    const result = await registerStudent(form);

    if (result.ok) {
      onRegistered(result.data);
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
          label="College Name"
          id="collegeName"
          type="text"
          value={form.collegeName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.collegeName ? errors.collegeName : ""}
          placeholder="e.g. IEM Kolkata"
          maxLength={150}
        />
        <FormInput
          label="Roll Number"
          id="rollNumber"
          type="text"
          value={form.rollNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.rollNumber ? errors.rollNumber : ""}
          placeholder="e.g. 10100222001"
          maxLength={20}
        />
        <FormInput
          label="Email Address"
          id="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email ? errors.email : ""}
          placeholder="yourname@email.com"
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
          hint="10-digit Indian mobile number"
          maxLength={10}
        />

        {serverMessage && (
          <div className={styles.errorMsg} role="alert">
            ❌ {serverMessage.text}
          </div>
        )}

        <button type="submit" className={styles.submitBtn} disabled={submitting}>
          {submitting ? "Registering..." : "Next: Select Course →"}
        </button>
      </form>
    </div>
  );
}