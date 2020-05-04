const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
//const Blog = require('../models/blog')
//const testBlogs = require('./test_blogs')
const User = require('../models/user')

const api = supertest(app)

describe('Blog routing', () => {

  beforeEach(async () => {
    await User.deleteMany({})
  })
  /* beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = testBlogs.map(b => new Blog(b))
    const promiseArray = blogObjects.map(b => b.save())
    await Promise.all(promiseArray)
  }) */

  test('Can add user', async () => {
    const newUser = {
      username: 'kalle',
      name: 'Kalle Kallenpoika',
      password: 'salasana'
    }

    const user = await api.post('/api/users').send(newUser).expect(200)
    expect(User.findById(user.id)).toBeDefined()
  })

  test('Too short name', async () => {
    const badUser = {
      username: 'ka',
      name: 'Kalle',
      password: 'salasana'
    }
    //await api.post('/api/users').send(badUser).expect(400)

  })

  test('Too short password', async () => {
    const badUser = {
      username: 'kal',
      name: 'Kalle',
      password: 'sa'
    }
    await api.post('/api/users').send(badUser).expect(400)

  })


})

afterAll(() => {
  mongoose.connection.close()
})