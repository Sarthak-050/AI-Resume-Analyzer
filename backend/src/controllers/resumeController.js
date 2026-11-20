const {
  analyzeResume,
  matchResumeWithJD,
  rewriteResumeText,
  runHiringPanel,
  generateStructuredResume,
} = require("../services/aiService");
const pdfParse = require("pdf-parse");
const cloudinary = require("../config/cloudinary");
const uploadBufferToCloudinary = require("../utils/uploadToCloudinary");

const Resume = require("../models/Resume");

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF file",
      });
    }

    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    const analysis = await analyzeResume(resumeText);
    const analysisObject = JSON.parse(analysis);

    if (analysisObject.isResume === false) {
      return res.status(400).json({
        success: false,
        message: "This doesn't look like a resume. Please upload a valid resume/CV PDF.",
      });
    }

    const cloudinaryResult = await uploadBufferToCloudinary(
      req.file.buffer,
      req.file.originalname
    );

    let versionOf = null;

    if (req.body.versionOf) {
      const baseResume = await Resume.findById(req.body.versionOf);

      if (baseResume && baseResume.user.toString() === req.user._id.toString()) {
        versionOf = baseResume.versionOf || baseResume._id;
      }
    }

    const resume = await Resume.create({
      user: req.user._id,
      resumeName: req.file.originalname,
      resumeUrl: cloudinaryResult.secure_url,
      cloudinaryPublicId: cloudinaryResult.public_id,
      resumeText,
      analysis: analysisObject,
      versionOf,
    });

    res.status(201).json({
      success: true,
      message: "Resume Uploaded Successfully",
      resume,
    });

  } catch (error) {
    console.error("Upload Resume Error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    console.error("Get My Resumes Error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      resume,
    });

  } catch (error) {
    console.error("Get Resume By Id Error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (resume.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(resume.cloudinaryPublicId, {
          resource_type: "raw",
        });
      } catch (cloudErr) {
        console.error("Cloudinary delete error:", cloudErr.message);
      }
    }

    await resume.deleteOne();

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });

  } catch (error) {
    console.error("Delete Resume Error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const matchJobDescription = async (req, res) => {
  try {
    const { jobDescription } = req.body;

    if (!jobDescription || jobDescription.trim().length < 30) {
      return res.status(400).json({
        success: false,
        message: "Please paste a valid job description (min. 30 characters)",
      });
    }

    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await matchResumeWithJD(resume.resumeText, jobDescription);
    const matchObject = JSON.parse(result);

    res.status(200).json({
      success: true,
      match: matchObject,
    });

  } catch (error) {
    console.error("Match Job Description Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Could not compare resume with job description",
    });
  }
};

const rewriteText = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Please provide text to rewrite (min. 5 characters)",
      });
    }

    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await rewriteResumeText(text, resume.resumeText);
    const rewriteObject = JSON.parse(result);

    res.status(200).json({
      success: true,
      rewrites: rewriteObject.rewrites || [],
    });

  } catch (error) {
    console.error("Rewrite Text Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Could not rewrite this text",
    });
  }
};

const getVersionHistory = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const rootId = resume.versionOf || resume._id;

    const versions = await Resume.find({
      user: req.user._id,
      $or: [{ _id: rootId }, { versionOf: rootId }],
    })
      .select("resumeName analysis.atsScore createdAt")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      versions,
    });

  } catch (error) {
    console.error("Get Version History Error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPanelReview = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await runHiringPanel(resume.resumeText);

    res.status(200).json({
      success: true,
      ...result,
    });

  } catch (error) {
    console.error("Get Panel Review Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Could not run the hiring panel review",
    });
  }
};

const generateFixedResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const structuredResume = await generateStructuredResume(resume.resumeText);

    res.status(200).json({
      success: true,
      structuredResume,
    });

  } catch (error) {
    console.error("Generate Fixed Resume Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Could not generate a fixed version of this resume",
    });
  }
};

module.exports = {
  uploadResume,
  getMyResumes,
  getResumeById,
  deleteResume,
  matchJobDescription,
  rewriteText,
  getVersionHistory,
  getPanelReview,
  generateFixedResume,
};