const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resumeName: {
      type: String,
      required: true,
    },

    resumeUrl: {
      type: String,
      required: true,
    },

    cloudinaryPublicId: {
      type: String,
      default: null,
    },

    resumeText: {
      type: String,
      default: "",
    },

    analysis: {
    type: Object,
    default: {},
    },

    versionOf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      default: null,
    },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resume", resumeSchema);