import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./my-folders");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});
// Create a Multer instance with a destination folder for file uploads
export const upload = multer({ storage, limits: { fileSize: 1024 * 1024 } });
