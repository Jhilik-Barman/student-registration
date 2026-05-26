export function validateFullName(name) {
  if (!name.trim()) return "Full name is required";
  if (name.trim().length < 3) return "Name must be at least 3 characters";
  if (name.trim().length > 100) return "Name must not exceed 100 characters";
  if (!/^[a-zA-Z\s]+$/.test(name)) return "Name can only contain letters and spaces";
  return "";
}

export function validateEmail(email) {
  if (!email.trim()) return "Email is required";
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())) {
    return "Please enter a valid email address";
  }
  return "";
}

export function validatePhone(phone) {
  const cleaned = phone.replace(/\s+/g, "");
  if (!cleaned) return "Phone number is required";
  if (!/^[6-9]\d{9}$/.test(cleaned)) {
    return "Enter a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9)";
  }
  return "";
}

export function validateCollegeName(college) {
  if (!college.trim()) return "College name is required";
  if (college.trim().length < 3) return "College name must be at least 3 characters";
  return "";
}

export function validateRollNumber(roll) {
  if (!roll.trim()) return "Roll number is required";
  if (roll.trim().length < 2) return "Please enter a valid roll number";
  return "";
}

export function validateStream(stream) {
  if (!stream) return "Please select your stream/department";
  return "";
}

export function validateCourse(course) {
  if (!course) return "Please select an internship topic";
  return "";
}