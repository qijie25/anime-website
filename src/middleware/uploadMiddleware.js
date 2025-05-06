const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: "dfcd70ihi",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile_pictures",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });

const animeStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "anime_images",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});
const animeUpload = multer({ storage: animeStorage });

module.exports = upload;
module.exports = animeUpload;
