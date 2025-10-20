const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const supabase = require("../config/supabase");

const { getFileById } = require("../database/queries");

const getFileDetails = async (req, res, next) => {
  try {
    const fileId = req.params.id;

    const file = await getFileById(fileId);

    if (!file) {
      req.flash("error", "File not found.");
      return res.redirect("/folder");
    }

    res.render("index", {
      title: file.name,
      content: "pages/file",
      file: file,
      message: req.flash(),
      user: req.user,
    });
  } catch (err) {
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
      req.flash("error", "File not found.");
      return res.redirect("/folder");
    }

    // Generate signed URL for download from Supabase
    const {
      data: { signedUrl },
      error,
    } = await supabase.storage.from("images").createSignedUrl(file.path, 60, {
      download: true,
    });

    if (error) {
      req.flash("error", error.message);
      return res.redirect(`/file/${fileId}`);
    }

    // Redirect to signed URL for direct download
    res.redirect(signedUrl);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getFileDetails,
  downloadFile,
};
