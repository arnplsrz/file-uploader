const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const supabase = require("../config/supabase");

const { getFileById } = require("../database/queries");

const getFileDetails = async (req, res, next) => {
  try {
    const fileId = req.params.id;

    const file = await getFileById(fileId);

    if (!file) {
      return res.status(404).send("File not found.");
    }

    res.render("index", {
      title: file.name,
      content: "pages/file",
      file: file,
      user: req.user,
    });
  } catch (err) {
    console.error("Error in getFileDetails:", err);
    next(err);
  }
};

const downloadFile = async (req, res, next) => {
  try {
    const fileId = req.params.id;

    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return res.status(404).send("File not found.");
    }

    // Generate signed URL for download from Supabase
    const {
      data: { signedUrl },
      error,
    } = await supabase.storage.from("images").createSignedUrl(file.path, 60, {
      download: true,
    });

    if (error) {
      throw new Error(`Supabase signed URL error: ${error.message}`);
    }

    // Redirect to signed URL for direct download
    res.redirect(signedUrl);
  } catch (err) {
    console.error("Error in downloadFile:", err);
    next(err);
  }
};

module.exports = {
  getFileDetails,
  downloadFile,
};
