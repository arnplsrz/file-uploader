const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const getRootFolder = async userId => {
  let rootFolder = await prisma.folder.findFirst({
    where: {
      userId: userId,
      parentId: null,
    },
  })

  if (!rootFolder) {
    rootFolder = await prisma.folder.create({
      data: {
        name: 'Root',
        path: '/',
        userId: userId,
      },
    })
  }

  return rootFolder
}

const getFiles = async folderId => {
  const files = await prisma.file.findMany({
    where: { folderId: folderId },
    orderBy: { createdAt: 'desc' },
  })

  return files
}

module.exports = {
  getRootFolder,
  getFiles,
}
