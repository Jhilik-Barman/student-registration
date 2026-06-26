const mongoose = require("mongoose");

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
    collegeName: {
      type: String,
      required: [true, "College name is required"],
      trim: true,
      minlength: [3, "College name must be at least 3 characters"],
      maxlength: [150, "College name must not exceed 150 characters"],
    },
    rollNumber: {
      type: String,
      required: [true, "Roll number is required"],
      trim: true,
      minlength: [2, "Please enter a valid roll number"],
      maxlength: [20, "Roll number must not exceed 20 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      match: [indianPhoneRegex, "Please enter a valid 10-digit Indian mobile number"],
    },
    stream: { type: String, default: null },
    courseId: { type: String, default: null },
    courseName: { type: String, default: null },
    fee: { type: Number, default: null },
    mode: { type: String, enum: ["online", "offline", null], default: null },
    nocFileName: { type: String, default: null },
    nocFileData: { type: String, default: null },
    nocFileSize: { type: Number, default: null },
    paymentConfirmed: { type: Boolean, default: false },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Successful", "Rejected", "Not Submitted"],
      default: "Not Submitted",
    },
    paymentSubmittedAt: { type: Date, default: null },
    paymentReviewedAt: { type: Date, default: null },
    screenshotPath: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);