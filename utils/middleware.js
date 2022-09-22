const User = require("../models/user")
const jwt = require('jsonwebtoken')

const tokenExtractor = async (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token = authorization.substring(7)
    }
    next()
}

const userExtractor = async (request, response, next) => {
    if (request.token) {
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        request.user = await User.findById(decodedToken.id)
    }
    next()
}

module.exports = { tokenExtractor, userExtractor }