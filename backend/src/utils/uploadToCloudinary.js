const cloudinary = require("../config/cloudinary");

/**
 * Uploads a file buffer (from multer memory storage) to Cloudinary
 * as a raw resource (used for PDFs), and returns the upload result.
 */
const uploadBufferToCloudinary = (buffer, originalName) => {
  return new Promise((resolve, reject) => {
    const safeName = originalName
      .replace(/\.pdf$/i, "")
      .replace(/[^a-zA-Z0-9-_]/g, "_");

    const publicId = `${Date.now()}-${safeName}`;

    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: "resumes",
        public_id: publicId,
        format: "pdf",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });
};

module.exports = uploadBufferToCloudinary;