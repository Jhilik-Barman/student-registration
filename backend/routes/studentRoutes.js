const express = require("express");
const { body, validationResult } = require("express-validator");
const Student = require("../models/Student");

const router = express.Router();

// Validation rules
const studentValidation = [
  body("fullName")
    .trim()
    .notEmpty().withMessage("Full name is required")
    .isLength({ min: 3, max: 100 }).withMessage("Name must be between 3 and 100 characters")
    .matches(/^[a-zA-Z\s]+$/).withMessage("Name can only contain letters and spaces"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
   .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).withMessage("Please enter a valid email address"),

  body("phone")
    .trim()
    .notEmpty().withMessage("Phone number is required")
    .matches(/^[6-9]\d{9}$/).withMessage("Enter a valid 10-digit Indian mobile number (starts with 6-9)"),
];

// POST /api/students — Register a new student
router.post("/", studentValidation, async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }

  const { fullName, email, phone } = req.body;

  try {
    // Check for duplicates
    const existingEmail = await Student.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(409).json({ success: false, message: "This Gmail address is already registered" });
    }

    const existingPhone = await Student.findOne({ phone });
    if (existingPhone) {
      return res.status(409).json({ success: false, message: "This phone number is already registered" });
    }

    const student = await Student.create({ fullName, email: email.toLowerCase(), phone });

    res.status(201).json({
      success: true,
      message: "Student registered successfully!",
      data: student,
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(409).json({ success: false, message: `This ${field} is already registered` });
    }
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
});

// GET /api/students — Get all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json({ success: true, count: students.length, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
