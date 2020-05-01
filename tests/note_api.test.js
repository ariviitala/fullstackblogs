const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const testBlogs = require('./test_blogs')

const api = supertest(app)

describe('Blog routing', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})

    testBlogs.forEach(async (blog) => {
      let blogObject = new Blog(blog)
      await blogObject.save()
      //console.log('saved')
    })
    //console.log('doned')
  })

  test('Two blogs are returned', async () => {
    const response = await api.get('api/blogs')
    console.log('The response' + response.contents)
    //const contents = response.body.map(r => r.content)
    expect(response.body).toHaveLength(testBlogs.length)
  })

  test('Blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })



/*   test('Blogs have id-field', async () => {
    await api
    .get('/api/blogs')
    .
  }) */

  afterAll(() => {
    mongoose.connection.close()
  })
})