const express = require("express");
const { body, validationResult } = require("express-validator");
const Student = require("../models/Student");
const upload = require("../config/gridfs");

const router = express.Router();

const studentValidation = [
  body("fullName")
    .trim()
    .notEmpty().withMessage("Full name is required")
    .isLength({ min: 3, max: 100 }).withMessage("Name must be between 3 and 100 characters")
    .matches(/^[a-zA-Z\s]+$/).withMessage("Name can only contain letters and spaces"),

  body("collegeName")
    .trim()
    .notEmpty().withMessage("College name is required")
    .isLength({ min: 3, max: 150 }).withMessage("College name must be between 3 and 150 characters"),

  body("rollNumber")
    .trim()
    .notEmpty().withMessage("Roll number is required")
    .isLength({ min: 2, max: 20 }).withMessage("Please enter a valid roll number"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).withMessage("Please enter a valid email address"),

  body("phone")
    .trim()
    .notEmpty().withMessage("Phone number is required")
    .matches(/^[6-9]\d{9}$/).withMessage("Enter a valid 10-digit Indian mobile number"),
];

// POST /api/students — Register
router.post("/", studentValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }

  const { fullName, collegeName, rollNumber, email, phone } = req.body;

  try {
    const existingEmail = await Student.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(409).json({ success: false, message: "This email address is already registered" });
    }

    const existingPhone = await Student.findOne({ phone });
    if (existingPhone) {
      return res.status(409).json({ success: false, message: "This phone number is already registered" });
    }

    const student = await Student.create({
      fullName,
      collegeName,
      rollNumber,
      email: email.toLowerCase(),
      phone,
    });

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

// PUT /api/students/:id/course — Save course selection
router.put("/:id/course", async (req, res) => {
  const { stream, courseId, courseName, fee } = req.body;

  if (!stream || !courseId || !courseName || !fee) {
    return res.status(400).json({ success: false, message: "All course fields are required" });
  }

  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { stream, courseId, courseName, fee },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.json({ success: true, message: "Course selected successfully!", data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error. Please try again." });
  }
});

// POST /api/students/:id/noc — Upload NOC PDF to MongoDB as Base64
router.post("/:id/noc", upload.single("noc"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload a PDF file" });
    }

    // Convert buffer to Base64 and save to MongoDB
    const base64Data = req.file.buffer.toString("base64");

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        nocFileName: req.file.originalname,
        nocFileData: base64Data,
        nocFileSize: req.file.size,
        mode: "online",
      },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.json({
      success: true,
      message: "NOC uploaded successfully!",
      data: { fileName: req.file.originalname },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Upload failed. Please try again." });
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