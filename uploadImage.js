// server/uploadImage.js
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || 'dqgllp5kz',
  api_key: process.env.API_KEY || 632754869416825,
  api_secret: process.env.API_SECRET || 'uPuiB4FOUNBvZWcmOYvzbHSaOeA',
});

const uploadImage = (image) => {
  return new Promise((resolve, reject) => {
    if (!image) return resolve("");
    // If it's already a hosted URL (http/https), don't re-upload
    if (typeof image === 'string' && (image.startsWith('http://') || image.startsWith('https://'))) {
      return resolve(image);
    }
    cloudinary.uploader.upload(
      image,
      {
        resource_type: 'auto',
        folder: 'portfolio',
        timeout: 120000,
      },
      (error, result) => {
        if (result && result.secure_url) {
          return resolve(result.secure_url);
        }
        console.error("Cloudinary upload error:", error);
        return reject({ message: error ? error.message : "Image upload failed" });
      }
    );
  });
};

const uploadMultipleImages = async (images) => {
  if (!Array.isArray(images) || images.length === 0) return [];
  const uploads = images.map((img) => uploadImage(img));
  return Promise.all(uploads);
};

module.exports = uploadImage;
module.exports.uploadImage = uploadImage;
module.exports.uploadMultipleImages = uploadMultipleImages;
module.exports.cloudinary = cloudinary;
