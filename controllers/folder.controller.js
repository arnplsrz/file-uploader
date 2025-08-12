const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const db = require('../database/queries')

const getFolder = async (req, res, next) => {
  try {
    const rootFolder = await db.getRootFolder(req.user.id)

    if (!rootFolder) {
      throw new Error('Root folder not found for the user.')
    }

    return res.redirect(`/folder/${rootFolder.id}`)
  } catch (err) {
    next(err)
  }
}

const uploadFile = async (req, res, next) => {
  try {
    const folderId = req.params.id

    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
    })

    if (!folder) {
      return res.status(404).send('Folder not found.')
    }

    await prisma.file.create({
      data: {
        name: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype,
        path: `/uploads/${req.file.filename}`,
        folderId: folder.id,
      },
    })

    return res.redirect(`/folder/${folderId}`)
  } catch (err) {
    next(err)
  }
}

const createFolder = async (req, res, next) => {
  try {
    const { folderName } = req.body
    const parentId = req.params.id

    const parentFolder = await prisma.folder.findUnique({
      where: { id: parentId },
    })

    if (!parentFolder) {
      return res.status(404).send('Parent folder not found.')
    }

    const newFolder = await prisma.folder.create({
      data: {
        name: folderName,
        path: `${parentFolder.path}/${folderName}`,
        userId: req.user.id,
        parentId: parentFolder.id,
      },
    })

    return res.redirect(`/folder/${newFolder.id}`)
  } catch (err) {
    next(err)
  }
}

const getFolderById = async (req, res, next) => {
  try {
    const folderId = req.params.id

    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
    })

    if (!folder) {
      console.error(`Folder with ID ${folderId} not found.`)
      return res.status(404).send('Folder not found.')
    }

    const folders = await prisma.folder.findMany({
      where: { parentId: folderId },
    })

    const files = await prisma.file.findMany({
      where: { folderId: folderId },
    })

    res.render('index', {
      title: folder.name,
      content: 'pages/folder',
      folder: folder,
      folders: folders,
      files: files,
      user: req.user,
    })
  } catch (err) {
    console.error('Error in getFolderById:', err)
    next(err)
  }
}

module.exports = {
  getFolder,
  uploadFile,
  createFolder,
  getFolderById,
}
