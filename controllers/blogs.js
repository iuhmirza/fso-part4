const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name:1})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body

    if(!body.url || !body.title) {return response.status(400).end()}

    if(!request.user) {
        return response.status(401).json({error: 'invalid or missing token'})
    }

    const user = request.user

    if(!body.likes) body.likes = 0
    const blog = new Blog({
        ...body,
        user: user._id
    })
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {

    if(!request.user) {
        return response.status(401).json({error: 'invalid or missing token'})
    }

    const tokenId = request.user._id.toString()
    const blog = await Blog.findById(request.params.id)
    const blogId = blog.user.toString()
    
    if(blogId === tokenId) {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } else {
        response.status(401).json({error: 'invalid token'})
    }
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
        likes: body.likes
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog)
})

module.exports = blogsRouter