const app = require('../app')
const supertest = require('supertest')
const mongoose = require('mongoose')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }
]

beforeEach(async () =>{
    await Blog.deleteMany({})
    
    const blogObjects = initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('verify unique identifier is called id', async () => {
    const blogs = await Blog.find({})
    expect(blogs[0].id).toBeDefined()
})

test('a valid blog can be added', async () => {
    const newBlog = {
        "title": "It's not paranoia if they're really out to get you",
        "author": "Harold Finch",
        "url": "https://www.imdb.com/title/tt4540234/characters/nm0256237",
        "likes": 5
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const blogs = (await Blog.find({})).map(blog => blog.toJSON())
    expect(blogs).toHaveLength(initialBlogs.length+1)

    const urls = blogs.map(blog => blog.url)
    expect(urls).toContain('https://www.imdb.com/title/tt4540234/characters/nm0256237')

})

test('a blog with no likes has 0 likes', async () => {
    const newBlog = {
        "title": "Everybody lies",
        "author": "Gregory House",
        "url": "https://en.wikipedia.org/wiki/Pilot_(House).com",
    }

    const savedBlog = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
        
    expect(savedBlog.body.likes).toEqual(0)

    
})

test('blog with no title or url gives 404', async () => {
    const noTitle = {
        "author": "Gregory House",
        "url": "https://en.wikipedia.org/wiki/Everybody_Dies_(House)",
    }

    await api
        .post('/api/blogs')
        .send(noTitle)
        .expect(400)
        
    const noUrl = {
        "title": "Everybody dies",
        "author": "Gregory House",
    }

    await api
        .post('/api/blogs')
        .send(noUrl)
        .expect(400)
})

test('remove a given blog post', async () => {
    const blogToDelete = initialBlogs[0]

    await api
        .delete(`/api/blogs/${blogToDelete._id}`)
        .expect(204)

    const blogs = await Blog.find({})
    expect(blogs).toHaveLength(initialBlogs.length - 1)

    const url = blogs.map(blog => blog.url)
    expect(url).not.toContain(blogToDelete.url)
})

test('update likes on a given blog post', async () => {
    const blogToUpdate = initialBlogs[0]

    const newLikes = {
        likes: 100
    }

    const updatedBlog = await api
        .put(`/api/blogs/${blogToUpdate._id}`)
        .send(newLikes)
        
    expect(updatedBlog.body.likes).toEqual(100)

})

afterAll(() => {
    mongoose.connection.close()
})