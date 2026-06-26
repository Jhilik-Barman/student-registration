const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Student = require("../models/Student");
const {
  sendRegistrationReceivedEmail,
  sendPaymentSuccessfulEmail,
  sendPaymentRejectedEmail,
} = require("../utils/sendEmail");
const { verifyAdmin } = require("./adminRoutes");

// Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config for screenshot
const screenshotStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `screenshot_${req.params.id}_${Date.now()}${ext}`);
  },
});

const uploadScreenshot = multer({
  storage: screenshotStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed."));
  },
});

// Multer config for NOC — stores in memory as base64
const uploadNOC = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed."));
  },
});

// GET /api/students — Get all students (for AdminPanel)
router.get("/", verifyAdmin, async (req, res) => {
  try {
    const students = await Student.find().sort({ paymentSubmittedAt: -1, createdAt: -1 });
    res.json({ success: true, data: students });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/students/:id/noc — View NOC file (for AdminPanel)
router.get("/:id/noc", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student || !student.nocFileData) {
      return res.status(404).json({ success: false, message: "NOC file not found." });
    }
    const buffer = Buffer.from(student.nocFileData, "base64");
    res.set("Content-Type", "application/pdf");
    res.set("Content-Disposition", `inline; filename="${student.nocFileName}"`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/students — Register a new student
router.post("/", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    // Return as { ok: true, data: student } so frontend result.data works
    res.status(201).json({ ok: true, data: student });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// PUT /api/students/:id/course — Select course
router.put("/:id/course", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ ok: false, message: "Student not found." });
    res.json({ ok: true, student });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// POST /api/students/:id/noc — Upload NOC PDF (for ModeSelection)
router.post("/:id/noc", uploadNOC.single("noc"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, message: "NOC file is required." });
    }
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ ok: false, message: "Student not found." });
    }
    student.nocFileName = req.file.originalname;
    student.nocFileData = req.file.buffer.toString("base64");
    student.nocFileSize = req.file.size;
    await student.save();
    res.json({ ok: true, message: "NOC uploaded successfully." });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// POST /api/students/:id/payment-confirm — Upload screenshot & submit payment for review
router.post("/:id/payment-confirm", uploadScreenshot.single("screenshot"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ ok: false, message: "Payment screenshot is required." });
    }
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ ok: false, message: "Student not found." });
    }
    student.screenshotPath = req.file.filename;
    student.paymentStatus = "Pending";
    student.paymentSubmittedAt = new Date();
    student.paymentConfirmed = false;
    student.paymentReviewedAt = null;
    await student.save();
    await sendRegistrationReceivedEmail(student);
    res.json({ ok: true, message: "Payment submitted and confirmation email sent.", data: student });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// GET /api/students/:id/screenshot — View payment screenshot (admin only)
router.get("/:id/screenshot", verifyAdmin, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student || !student.screenshotPath) {
      return res.status(404).json({ success: false, message: "Screenshot not found." });
    }
    const filePath = path.join(uploadDir, student.screenshotPath);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "Screenshot file missing." });
    }
    res.sendFile(filePath);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/students/:id/payment-status — Admin approves or rejects payment
router.put("/:id/payment-status", verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Successful", "Rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be Successful or Rejected." });
    }
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found." });
    }
    student.paymentStatus = status;
    student.paymentReviewedAt = new Date();
    student.paymentConfirmed = status === "Successful";
    await student.save();
    if (status === "Successful") {
      await sendPaymentSuccessfulEmail(student);
    } else {
      await sendPaymentRejectedEmail(student);
    }
    res.json({ success: true, message: `Payment ${status.toLowerCase()} and email sent.`, data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;