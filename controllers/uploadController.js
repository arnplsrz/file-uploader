const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const postUpload = async (req, res, next) => {
  console.log(req.body, req.file)

  try {
    await prisma.file.create({
      data: {
        name: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype,
        userId: req.user.id,
      },
    })

    return res.redirect('/')
  } catch (err) {
    next(err)
  }

  res.status(200).render('index', {
    title: 'Upload',
    content: 'pages/homepage',
    user: req.user,
  })
}

module.exports = {
  postUpload,
}
