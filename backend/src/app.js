const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const path = require("path");

const app = express();

// CORS: agar CLIENT_URL env me set hai, sirf usi origin ko allow karo.
// Agar set nahi hai (local dev), sab origins allow rahenge.
const corsOptions = process.env.CLIENT_URL
  ? { origin: process.env.CLIENT_URL, credentials: true }
  : {};

app.use(cors(corsOptions));

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AI Resume Analyzer API is Running 🚀",
  });
});

// Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/resume", resumeRoutes);

// Static Folder
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

module.exports = app;