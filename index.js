
const dotenv = require('dotenv')
const express = require('express')
const mongoose = require('mongoose')
const app = express()

// Import Routes
const authRoute = require('./route/auth')
const postRoute = require('./route/posts')

dotenv.config()

//Connect to DB
const url = process.env.DB_CONNECT
mongoose.connect(url, {useNewUrlParser: true},
  () => console.log(`connected to db: ${url}`))

// Middleware
app.use(express.json())

// Route Middleware
app.use('/app/user', authRoute)
app.use('/app/posts', postRoute)


app.listen(3000, () => {
  console.log('Server Up and Running')
})