const bcrypt = require('bcrypt')
const { disabled } = require('../app')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.json(users)
})

usersRouter.post('/', async (request, response) => {
    const {username, password, name} = request.body

    if(username.length < 3) return response.status(400).json({error: 'username too short'})
    if(password.length < 3) return response.status(400).json({error: 'password too short'})
    
    const duplicateUser = await User.find({"username": username})
    if(duplicateUser.length>0) {
        return response.status(400).json({
            error: 'username is not unique'
        })
    }
    
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

module.exports = usersRouter