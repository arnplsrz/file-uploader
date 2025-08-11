const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const db = require('../database/queries')

const getFolder = async (req, res) => {
  const rootFolder = await db.getRootFolder(req.user.id)
  const files = await db.getFiles(rootFolder.id)

  res.render('index', {
    title: 'Folder',
    content: 'pages/folder',
    files: files,
    user: req.user,
  })
}

const postFolder = async (req, res, next) => {
  try {
    const rootFolder = await db.getRootFolder(req.user.id)

    await prisma.file.create({
      data: {
        name: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype,
        path: `/uploads/${req.file.filename}`,
        folderId: rootFolder.id,
      },
    })

    return res.redirect('/folder')
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getFolder,
  postFolder,
}
