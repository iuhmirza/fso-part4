const express = require('express')
const app = express()
const cors = require('cors')
const usersRouter = require('./controllers/users')
const blogsRouter = require('./controllers/blogs')
const mongoose = require('mongoose')
const config = require('./utils/config')

mongoose.connect(config.MONGODB_URI)

app.use(cors())
app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)

module.exports = app