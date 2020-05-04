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

  test('Blogs have id-field', async () => {
    const blogs = await api.get('/api/blogs')
    //console.log(blogs.body)
    blogs.body.forEach(b => expect(b.id).toBeDefined())
    //expect(blogs[0].id).toBeDefined()
  })

  test('Enough blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    //const contents = response.body.map(r => r.content)
    expect(response.body).toHaveLength(testBlogs.length)
  })

  test('Blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('Blogs can be added', async () => {
    const newBlog = {
      title: 'Post Test Blog',
      author: 'Test Author',
      url: 'Test url',
      likes: 3
    }

    await api.post('/api/blogs').send(newBlog)

    const result = await api.get('/api/blogs')
    const blogs = result.body

    expect(blogs).toHaveLength(testBlogs.length + 1)
    expect(blogs.filter(b => b.title === 'Post Test Blog')).toHaveLength(1)

  })

  test('Default likes zero', async () => {
    const newBlog = {
      title: 'Likes Test Blog',
      author: 'Test Author',
      url: 'Test url'
    }

    await api.post('/api/blogs').send(newBlog)

    const result = await api.get('/api/blogs')
    //console.log(result.body)
    const blog = result.body.find(b => b.title === 'Likes Test Blog')
    //console.log(blog)
    expect(blog.likes).toBe(0)


  })

  test('Adding invalid blog', async () => {
    const newBlog = {
      author: 'Test Author'
    }

    await api.post('/api/blogs').send(newBlog).expect(400)
  })


})

afterAll(() => {
  mongoose.connection.close()
})