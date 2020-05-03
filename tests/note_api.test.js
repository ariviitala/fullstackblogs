const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const testBlogs = require('./test_blogs')

const api = supertest(app)

//console.log(testBlogs)

describe('Blog routing', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = testBlogs.map(b => new Blog(b))
    const promiseArray = blogObjects.map(b => b.save())
    await Promise.all(promiseArray)
  })

  test('Two blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    //console.log('The response' + response.contents)
    //const contents = response.body.map(r => r.content)
    expect(response.body).toHaveLength(testBlogs.length)
  })

  test('Blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  /* test('Blogs have id-field', async () => {
    const blogs = await api.get('/api/blogs').body

    blogs.forEach(b => expect(b.id).toBeDefined())
    //expect(blogs[0].id).toBeDefined()
  }) */


})

afterAll(() => {
  mongoose.connection.close()
})