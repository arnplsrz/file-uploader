const express = require('express')
const session = require('express-session')
const passport = require('passport')
const { PrismaClient } = require('@prisma/client')
const { PrismaSessionStore } = require('@quixo3/prisma-session-store')
require('dotenv').config()
require('./config/passport')

const indexRoutes = require('./routes/indexRoute')
const authRoutes = require('./routes/authRoute')
const uploadRoutes = require('./routes/uploadRoute')

const app = express()
const prisma = new PrismaClient()

app.set('view engine', 'ejs')
app.set('views', `${__dirname}/views`)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
  session({
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
)
app.use(passport.session())

app.use('/', indexRoutes)
app.use('/', authRoutes)
app.use('/', uploadRoutes)

app.listen(process.env.PORT)
