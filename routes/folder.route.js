const express = require("express");
const multer = require("multer");
const router = express.Router();

const folderController = require("../controllers/folder.controller");
const isAuthenticated = require("../middleware/auth.middleware");

const upload = multer({ storage: multer.memoryStorage() });

router.get("/folder", isAuthenticated, folderController.getFolder);
router.get("/folder/:id", isAuthenticated, folderController.getFolderData);

router.post(
  "/folder/:id/upload",
  isAuthenticated,
  upload.single("file"),
  folderController.uploadFile,
);

router.post(
  "/folder/:id/create",
  isAuthenticated,
  folderController.createFolder,
);

router.post(
  "/folder/:id/rename",
  isAuthenticated,
  folderController.renameFolder,
);

router.post(
  "/folder/:id/delete",
  isAuthenticated,
  folderController.deleteFolder,
);

router.post("/folder/:id/share", isAuthenticated, folderController.shareFolder);

router.get("/share/:id", folderController.getSharedFolder);

module.exports = router;
