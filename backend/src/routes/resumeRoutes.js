const express = require("express");

const {
  uploadResume,
  getMyResumes,
  getResumeById,
  deleteResume,
  matchJobDescription,
  rewriteText,
  getVersionHistory,
  getPanelReview,
  generateFixedResume,
} = require("../controllers/resumeController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadResume
);

router.get("/", protect, getMyResumes);

router.get("/:id", protect, getResumeById);

router.delete("/:id", protect, deleteResume);

router.post("/:id/match", protect, matchJobDescription);

router.post("/:id/rewrite", protect, rewriteText);

router.get("/:id/versions", protect, getVersionHistory);

router.post("/:id/panel-review", protect, getPanelReview);

router.post("/:id/fix", protect, generateFixedResume);

module.exports = router;