const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "text/csv",
    "application/csv"
  ];
  
  if (allowedTypes.includes(file.mimetype) || 
      file.originalname.match(/\.(pdf|docx|txt|csv)$/i)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOCX, TXT, and CSV files are allowed"), false);
  }
};

const uploadDocument = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter,
});

module.exports = uploadDocument;
