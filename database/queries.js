const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { formatBytes, formatDate } = require("../utils/formatters");

const getRootFolder = async (userId) => {
  let rootFolder = await prisma.folder.findFirst({
    where: {
      userId: userId,
      parentId: null,
    },
  });

  if (!rootFolder) {
    rootFolder = await prisma.folder.create({
      data: {
        name: "Root",
        path: "/",
        userId: userId,
      },
    });
  }

  return rootFolder;
};

const getSubfolders = async (folderId, sortField, sortOrder, search) => {
  try {
    const folders = await prisma.folder.findMany({
      where: { parentId: folderId, name: { contains: search } },
      orderBy: { [sortField]: sortOrder },
    });

    return folders.map((folder) => ({
      ...folder,
      updatedAt: formatDate(folder.updatedAt),
    }));
  } catch (err) {
    console.error("Error fetching subfolders:", err);
    throw err;
  }
};

const getFiles = async (folderId, sortField, sortOrder, search) => {
  try {
    let sort = sortField === "type" ? "name" : sortField;

    const files = await prisma.file.findMany({
      where: { folderId: folderId, name: { contains: search } },
      orderBy: { [sort]: sortOrder },
    });

    return files.map((file) => ({
      ...file,
      size: formatBytes(file.size),
      updatedAt: formatDate(file.updatedAt),
    }));
  } catch (err) {
    console.error("Error fetching files:", err);
    throw err;
  }
};

const getFileById = async (fileId) => {
  try {
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) return null;

    return {
      ...file,
      size: formatBytes(file.size),
      createdAt: formatDate(file.createdAt),
      updatedAt: formatDate(file.updatedAt),
    };
  } catch (err) {
    console.error("Error fetching file:", err);
    throw err;
  }
};

module.exports = {
  getRootFolder,
  getFiles,
  getSubfolders,
  getFileById,
};
