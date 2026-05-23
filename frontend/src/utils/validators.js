// Validate full name — letters and spaces only, 3–100 chars
export function validateFullName(name) {
  if (!name.trim()) return "Full name is required";
  if (name.trim().length < 3) return "Name must be at least 3 characters";
  if (name.trim().length > 100) return "Name must not exceed 100 characters";
  if (!/^[a-zA-Z\s]+$/.test(name)) return "Name can only contain letters and spaces";
  return "";
}

// Validate Gmail only
export function validateEmail(email) {
  if (!email.trim()) return "Email is required";
  if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email.trim())) {
    return "Only Gmail addresses are allowed (must end with @gmail.com)";
  }
  return "";
}

// Validate Indian mobile number — 10 digits starting with 6/7/8/9
export function validatePhone(phone) {
  const cleaned = phone.replace(/\s+/g, "");
  if (!cleaned) return "Phone number is required";
  if (!/^[6-9]\d{9}$/.test(cleaned)) {
    return "Enter a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9)";
  }
  return "";
}
