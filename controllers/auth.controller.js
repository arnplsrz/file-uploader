const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const passport = require('passport')

const getSignup = (req, res) => {
  if (req.user) return res.redirect('/')

  res.status(200).render('index', {
    title: 'Signup',
    content: 'pages/signup',
    user: req.user,
  })
}

const getSignin = (req, res) => {
  if (req.user) return res.redirect('/')

  res.status(200).render('index', {
    title: 'Signin',
    content: 'pages/signin',
    user: req.user,
  })
}

const getLogout = (req, res, next) => {
  if (!req.user) return res.redirect('/signin')

  req.logout(err => {
    if (err) return next(err)
    res.redirect('/')
  })
}

const postSignup = async (req, res, next) => {
  try {
    await prisma.user.create({
      data: {
        username: req.body.username,
        password: await bcrypt.hash(req.body.password, 10),
      },
    })

    return res.redirect('/')
  } catch (err) {
    next(err)
  }
}

const postSignin = async (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) return next(err)

    req.logIn(user, err => {
      if (err) return next(err)
      res.redirect('/')
    })
  })(req, res, next)
}

module.exports = {
  getSignup,
  getSignin,
  getLogout,
  postSignup,
  postSignin,
}
