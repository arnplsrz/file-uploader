const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')

router.get('/signup', authController.getSignup)
router.get('/signin', authController.getSignin)
router.get('/logout', authController.getLogout)

router.post('/signup', authController.postSignup)
router.post('/signin', authController.postSignin)

module.exports = router
