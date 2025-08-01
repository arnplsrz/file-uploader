const express = require('express')
const router = express.Router()
const auth = require('../controllers/auth')

router.get('/signup', auth.getSignup)
router.get('/signin', auth.getSignin)
router.get('/logout', auth.getLogout)

router.post('/signup', auth.postSignup)
router.post('/signin', auth.postSignin)

module.exports = router
