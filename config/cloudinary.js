const cloudinary = require("cloudinary").v2;
const {
  cloudinaryCloud,
  cloudinaryApiKey,
  cloudinaryApiSecret,
} = require("./env");

cloudinary.config({
  cloud_name: cloudinaryCloud,
  api_key: cloudinaryApiKey,
  api_secret: cloudinaryApiSecret,
});

async function uploadToCloudinary(buffer, filename) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "image",
          folder: "events",
          public_id: filename,
          allowed_formats: ["jpg", "jpeg", "png"],
          transformation: [{ width: 800, height: 600, crop: "limit" }],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      )
      .end(buffer);
  });
}

module.exports = { uploadToCloudinary };
