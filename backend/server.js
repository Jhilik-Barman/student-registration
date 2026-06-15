const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();
const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const { router: adminRoutes } = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Serve uploaded screenshots as static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/students", studentRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Student Registration API is running" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});