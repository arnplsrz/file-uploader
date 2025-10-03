const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const supabase = require("../config/supabase");

const {
  getRootFolder,
  getFilesByFolderId,
  getSubfoldersByFolderId,
} = require("../database/queries");

const getFolder = async (req, res, next) => {
  try {
    const rootFolder = await getRootFolder(req.user.id);

    if (!rootFolder) {
      throw new Error("Root folder not found for the user.");
    }

    return res.redirect(`/folder/${rootFolder.id}`);
  } catch (err) {
    next(err);
  }
};

const uploadFile = async (req, res, next) => {
  try {
    const folderId = req.params.id;

    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    if (!folder) {
      return res.status(404).send("Folder not found.");
    }

    if (!req.file) {
      return res
        .status(400)
        .send("File upload failed: Invalid file type or size.");
    }

    // Upload file to Supabase Storage
    const file = req.file;
    const fileName = `${Date.now()}-${file.originalname}`;
    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, file.buffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.mimetype,
      });

    if (error) {
      throw new Error(`Supabase upload error: ${error.message}`);
    }

    await prisma.file.create({
      data: {
        name: file.originalname,
        size: file.size,
        type: file.mimetype,
        path: fileName,
        folderId: folder.id,
      },
    });

    return res.redirect(`/folder/${folderId}`);
  } catch (err) {
    next(err);
  }
};

const createFolder = async (req, res, next) => {
  try {
    const { folderName } = req.body;
    const parentId = req.params.id;

    const parentFolder = await prisma.folder.findUnique({
      where: { id: parentId },
    });

    if (!parentFolder) {
      return res.status(404).send("Parent folder not found.");
    }

    const newFolder = await prisma.folder.create({
      data: {
        name: folderName,
        path: `${parentFolder.path}/${folderName}`,
        userId: req.user.id,
        parentId: parentFolder.id,
      },
    });

    return res.redirect(`/folder/${newFolder.id}`);
  } catch (err) {
    next(err);
  }
};

const getBreadcrumbs = async (folderId) => {
  const breadcrumbs = [];
  let current = await prisma.folder.findUnique({ where: { id: folderId } });
  while (current) {
    breadcrumbs.unshift({ id: current.id, name: current.name });
    if (current.parentId) {
      current = await prisma.folder.findUnique({
        where: { id: current.parentId },
      });
    } else {
      break;
    }
  }
  return breadcrumbs;
};

const getFolderData = async (req, res, next) => {
  try {
    const folderId = req.params.id;

    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    if (!folder) {
      console.error(`Folder with ID ${folderId} not found.`);
      return res.status(404).send("Folder not found.");
    }

    const folders = await getSubfoldersByFolderId(folderId);
    const files = await getFilesByFolderId(folderId);
    const breadcrumbs = await getBreadcrumbs(folderId);

    res.render("index", {
      title: folder.name,
      content: "pages/folder",
      folder: folder,
      folders: folders,
      files: files,
      breadcrumbs: breadcrumbs,
      user: req.user,
    });
  } catch (err) {
    console.error("Error in getFolderById:", err);
    next(err);
  }
};

const renameFolder = async (req, res, next) => {
  try {
    const folderId = req.params.id;
    const { newName } = req.body;

    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    if (!folder) {
      return res.status(404).send("Folder not found.");
    }

    if (folder.userId !== req.user.id) {
      return res.status(403).send("Access denied.");
    }

    await prisma.folder.update({
      where: { id: folderId },
      data: { name: newName },
    });

    return res.redirect(`/folder/${folderId}`);
  } catch (err) {
    next(err);
  }
};

const deleteFolder = async (req, res, next) => {
  try {
    const folderId = req.params.id;

    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
    });

    if (!folder) {
      return res.status(404).send("Folder not found.");
    }

    await prisma.folder.delete({
      where: { id: folderId },
    });

    return res.redirect(`/folder/${folder.parentId || ""}`);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getFolder,
  uploadFile,
  createFolder,
  getFolderData,
  renameFolder,
  deleteFolder,
};
