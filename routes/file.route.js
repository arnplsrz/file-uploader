const express = require("express");
const router = express.Router();

const {
  getFileDetails,
  downloadFile,
} = require("../controllers/file.controller");
const isAuthenticated = require("../middleware/auth.middleware");

router.get("/file/:id", isAuthenticated, getFileDetails);
router.get("/file/:id/download", isAuthenticated, downloadFile);

module.exports = router;
