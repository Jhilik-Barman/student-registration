import { useState } from "react";
import FormInput from "./FormInput";
import { validateFullName, validateEmail, validatePhone, validateRollNumber } from "../utils/validators";
import { registerStudent } from "../utils/api";
import styles from "./RegistrationForm.module.css";

const KOLKATA_COLLEGES = [
  "Jadavpur University",
  "Bengal Engineering and Science University (IIEST Shibpur)",
  "Kalyani Government Engineering College",
  "Jalpaiguri Government Engineering College",
  "Cooch Behar Government Engineering College",
  "Bankura Unnayani Institute of Engineering",
  "Midnapore College of Engineering and Technology",
  "Government College of Engineering and Leather Technology (GCELT)",
  "Government College of Engineering and Textile Technology Berhampore",
  "Government College of Engineering and Textile Technology Serampore",
  "Hooghly Engineering and Technology College",
  "Institute of Technology and Marine Engineering (ITME)",
  "Dr. B.C. Roy Engineering College",
  "Netaji Subhas Engineering College",
  "RCC Institute of Information Technology",
  "Heritage Institute of Technology",
  "Institute of Engineering & Management (IEM Salt Lake)",
  "Institute of Engineering & Management (IEM Ashram More)",
  "Techno India University",
  "Techno International New Town",
  "Techno International Batanagar",
  "Techno India College of Technology",
  "Narula Institute of Technology",
  "Guru Nanak Institute of Technology",
  "Meghnad Saha Institute of Technology",
  "Future Institute of Engineering and Management",
  "JIS College of Engineering",
  "JIS University",
  "Brainware University",
  "Sister Nivedita University",
  "Swami Vivekananda University",
  "University of Engineering and Management (UEM Kolkata)",
  "Calcutta Institute of Engineering and Management (CIEM)",
  "Pailan College of Management and Technology",
  "Dream Institute of Technology",
  "Abacus Institute of Engineering and Management",
  "Camellia Institute of Technology",
  "Supreme Knowledge Foundation Group of Institutions",
  "Budge Budge Institute of Technology",
  "Seacom Engineering College",
  "Bharat Technology",
  "Bengal College of Engineering and Technology (BCET Durgapur)",
  "Calcutta Institute of Technology (CIT Uluberia)",
  "Academy of Technology",
  "Regent Education and Research Foundation",
  "Asansol Engineering College",
  "Dr. Sudhir Chandra Sur Degree Engineering College",
  "Durgapur Institute of Advanced Technology and Management",
  "Global Institute of Management and Technology",
  "Haldia Institute of Technology",
  "Birbhum Institute of Engineering and Technology",
  "Murshidabad College of Engineering and Technology",
  "North Bengal Institute of Technology",
  "Siliguri Institute of Technology",
  "Dumkal Institute of Engineering and Technology",
  "Elitte Institute of Engineering and Management",
  "Mallabhum Institute of Technology",
  "Calcutta University",
  "Presidency University",
  "Rabindra Bharati University",
  "West Bengal State University",
  "Vidyasagar University",
  "Burdwan University",
  "North Bengal University",
  "Kalyani University",
  "Visva-Bharati University",
  "MAKAUT (Maulana Abul Kalam Azad University of Technology)",
  "West Bengal University of Health Sciences",
  "Aliah University",
  "Diamond Harbour Women's University",
  "Kazi Nazrul University",
  "Sidho-Kanho-Birsha University",
  "Cooch Behar Panchanan Barma University",
  "Bankura University",
  "Raiganj University",
  "Calcutta Medical College",
  "R.G. Kar Medical College",
  "NRS Medical College",
  "IPGMER (SSKM Hospital)",
  "Murshidabad Medical College",
  "Midnapore Medical College",
  "Bankura Sammilani Medical College",
  "North Bengal Medical College",
  "Burdwan Medical College",
  "Malda Medical College",
  "ESIC Medical College Joka",
  "KPC Medical College",
  "St. Xavier's College Kolkata",
  "Presidency College Kolkata",
  "Scottish Church College",
  "Bethune College",
  "Lady Brabourne College",
  "Loreto College",
  "City College Kolkata",
  "Asutosh College",
  "Maulana Azad College",
  "Vidyasagar College",
  "Surendranath College",
  "Bangabasi College",
  "The Bhawanipur Education Society College",
  "Ramakrishna Mission Residential College (Narendrapur)",
  "Chandernagore College",
  "Serampore College",
  "Hooghly Mohsin College",
  "Burdwan Raj College",
  "IIM Calcutta",
  "IISWBM Kolkata",
  "Globsyn Business School",
  "Future Business School",
  "Calcutta Business School",
  "Bengal Institute of Business Studies",
  "International Management Institute Kolkata",
  "Other",
];

const initialState = { fullName: "", email: "", phone: "", collegeName: "", rollNumber: "" };
const initialErrors = { fullName: "", email: "", phone: "", collegeName: "", rollNumber: "" };
const initialTouched = { fullName: false, email: false, phone: false, collegeName: false, rollNumber: false };

export default function RegistrationForm({ onRegistered }) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState(initialErrors);
  const [touched, setTouched] = useState(initialTouched);
  const [submitting, setSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState(null);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showOtherInput, setShowOtherInput] = useState(false);

  const filteredColleges = search
    ? KOLKATA_COLLEGES.filter((c) => c.toLowerCase().includes(search.toLowerCase()))
    : KOLKATA_COLLEGES;

  function validate(field, value) {
    if (field === "fullName") return validateFullName(value);
    if (field === "email") return validateEmail(value);
    if (field === "phone") return validatePhone(value);
    if (field === "collegeName") return value.trim() ? "" : "Please select your college";
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

  function handleCollegeSelect(college) {
    if (college === "Other") {
      setShowOtherInput(true);
      setForm((prev) => ({ ...prev, collegeName: "" }));
      setSearch("Other - Please specify below");
    } else {
      setShowOtherInput(false);
      setForm((prev) => ({ ...prev, collegeName: college }));
      setSearch(college);
      setErrors((prev) => ({ ...prev, collegeName: "" }));
    }
    setShowDropdown(false);
    setTouched((prev) => ({ ...prev, collegeName: true }));
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
        <div className={styles.icon}></div>
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

        {/* College Autocomplete */}
        <div className={styles.group}>
          <label className={styles.label}>College Name</label>
          <div className={styles.autocomplete}>
            <input
              type="text"
              className={`${styles.searchInput} ${touched.collegeName && errors.collegeName ? styles.hasError : ""}`}
              placeholder="Click or type to search college..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowDropdown(true);
                setForm((prev) => ({ ...prev, collegeName: "" }));
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 300)}
              autoComplete="off"
            />
            {showDropdown && (
              <ul className={styles.dropdownList}>
                {filteredColleges.length > 0 ? (
                  filteredColleges.map((college) => (
                    <li
                      key={college}
                      className={styles.dropdownItem}
                      onMouseDown={() => handleCollegeSelect(college)}
                    >
                      {college}
                    </li>
                  ))
                ) : (
                  <li className={styles.dropdownEmpty}>No college found</li>
                )}
              </ul>
            )}
          </div>
          {touched.collegeName && errors.collegeName && (
            <p className={styles.errorText}> {errors.collegeName}</p>
          )}
          {form.collegeName && !errors.collegeName && (
            <p className={styles.selectedCollege}> {form.collegeName}</p>
          )}
        </div>

        {showOtherInput && (
          <FormInput
            label="Enter Your College Name"
            id="collegeName"
            type="text"
            value={form.collegeName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.collegeName ? errors.collegeName : ""}
            placeholder="Type your college name"
            maxLength={150}
          />
        )}

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