const app = require(('../app'))
const supertest = require('supertest')
const mongoose = require('mongoose')
const api = supertest(app)
const User = require('../models/user')

const initialUsers = [
    {
        username: "mysteries",
        passwordHash: "tallis",
        name: "John Reese"
    },
    {
        username: "admin",
        passwordHash: "dashwood",
        name: "Harold Finch"
    },
    {
        username: "root",
        passwordHash: "away",
        name: "Sam Groves"
    },
]

beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(initialUsers)
})

test('all users are returned', async () => {
    const response = await api.get('/api/users')
    expect(response.body).toHaveLength(initialUsers.length)
})

test('invalid user cannot be posted', async() => {
    const invalidUserName = {
        username: 'ni',
        password: 'contingency',
        name: 'Nathan Ingram'
    }
    const response = await api.post('/api/users').send(invalidUserName)
    expect(response.status).toBe(400)
})

afterAll(() => {
    mongoose.connection.close()
})