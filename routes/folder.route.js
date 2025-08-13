const express = require('express')
const multer = require('multer')
const crypto = require('crypto')
const path = require('path')
const router = express.Router()

const folderController = require('../controllers/folder.controller')
const isAuthenticated = require('../middleware/auth.middleware')

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    crypto.randomBytes(16, (err, raw) => {
      if (err) return cb(err)
      cb(null, `${raw.toString('hex')}${path.extname(file.originalname)}`)
    })
  },
})

const upload = multer({ storage: storage })

router.get('/folder', isAuthenticated, folderController.getFolder)
router.get('/folder/:id', isAuthenticated, folderController.getFolderById)
router.post('/folder/:id/upload', upload.single('file'), isAuthenticated, folderController.uploadFile)
router.post('/folder/:id/create', isAuthenticated, folderController.createFolder)
router.post('/folder/:id/rename', isAuthenticated, folderController.renameFolder)
router.post('/folder/:id/delete', isAuthenticated, folderController.deleteFolder)

router.use('/uploads', express.static('uploads'))

module.exports = router
