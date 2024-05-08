const multer = require("multer");
const path = require("path");
const fs = require("fs");
const createHttpError = require("http-errors");
function createRoute(req) {
  const date = new Date();
  const year = date.getFullYear().toString();
  const month = date.getMonth().toString();
  const day = date.getDate().toString();
  const directory = path.join(
    __dirname,
    "..",
    "..",
    "public",
    "uploads",
    "blogs",
    year,
    month,
    day
  );
  req.body.fileUploadPath = path.join("uploads", "blogs", year, month, day);
  fs.mkdirSync(directory, { recursive: true });
  return directory;
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file?.originalname) {
      const filePath = createRoute(req);
      return cb(null, filePath);
    }
    cb(null, null);
  },
  filename: (req, file, cb) => {
    if (file?.originalname) {
      const ext = path.extname(file.originalname);
      const fileName = String(new Date().getTime() + ext);
      req.body.fileName = fileName;
      return cb(null, fileName);
    }
    cb(null, null);
  },
});

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimetypes = [".jpeg", ".jpg", ".webp", ".png", ".gif"];
  if (mimetypes.includes(ext)) {
    return cb(null, true);
  }
  return cb(createHttpError.BadRequest("image format is incorrect"));
}

function VideoFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimetypes = [".mp4", ".mpg", ".mkv", ".avr"];
  if (mimetypes.includes(ext)) {
    return cb(null, true);
  }
  return cb(createHttpError.BadRequest("video format is incorrect"));
}

const pictureMaxSize = 1 * 1000 * 1000;
const videoMaxSize = 1000 * 1000 * 1000;

const uploadFile = multer({
  storage,
  fileFilter,
  limits: { fileSize: pictureMaxSize },
});

const uploadVideo = multer({
  storage,
  VideoFilter,
  limits: { fileSize: videoMaxSize },
});

module.exports = { uploadFile, uploadVideo };
