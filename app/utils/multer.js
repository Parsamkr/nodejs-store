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
    const filePath = createRoute(req);
    cb(null, filePath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = String(new Date().getTime() + ext);
    req.body.fileName = fileName;
    cb(null, fileName);
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

const maxSize = 1 * 1000 * 1000;

const uploadFile = multer({
  storage,
  fileFilter,
  limits: { fileSize: maxSize },
});

module.exports = { uploadFile };
