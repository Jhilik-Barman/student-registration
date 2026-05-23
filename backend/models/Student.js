const mongoose = require("mongoose");

// Indian mobile number validation:
// - Must start with 6, 7, 8, or 9
// - Must be exactly 10 digits
// - No leading 0 or +91 prefix expected (clean 10-digit)
const indianPhoneRegex = /^[6-9]\d{9}$/;

const studentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [100, "Name must not exceed 100 characters"],
      match: [/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      // Only @gmail.com emails allowed
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      match: [indianPhoneRegex, "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);
