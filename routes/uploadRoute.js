const express = require('express')
const multer = require('multer')
const router = express.Router()
const upload = multer({ dest: 'uploads/' })
const uploadController = require('../controllers/uploadController')

router.post('/upload', upload.single('file'), uploadController.postUpload)

module.exports = router
