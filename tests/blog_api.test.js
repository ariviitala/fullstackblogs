const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const testBlogs = require('./test_blogs')
const testUsers = require('./test_users')
const bcrypt = require('bcrypt')

const api = supertest(app)

//console.log(testBlogs)

describe('Blog routing', () => {

  beforeEach(async () => {

    //Initialize
    await Blog.deleteMany({})
    await User.deleteMany({})

    //Add users
    let newUser = null
    const saltRounds = 10

    for (let user of testUsers) {
      let hash = await bcrypt.hash(user.password, saltRounds)
      newUser = User({ username: user.username, name: user.name, passwordHash: hash })
      await newUser.save()
    }

    //console.log(userObjects[0])
    testBlogs.forEach(b => b.user = newUser._id)

    const blogObjects = testBlogs.map(b => new Blog(b))
    const promiseArray = blogObjects.map(b => b.save())
    await Promise.all(promiseArray)

    //console.log(blogObjects)
    newUser.blogs = blogObjects.map(b => b._id)
    newUser.save()

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

    const login = await api.post('/api/login').send({ username: testUsers[1].username, password: testUsers[1].password })
    //console.log(login)
    const newBlog = {
      title: 'Post Test Blog',
      author: 'Test Author',
      url: 'Test url',
      likes: 3
    }

    await api.post('/api/blogs').set('Authorization', `bearer ${login.body.token}`).send(newBlog)

    const result = await api.get('/api/blogs')
    const blogs = result.body

    expect(blogs).toHaveLength(testBlogs.length + 1)
    expect(blogs.filter(b => b.title === 'Post Test Blog')).toHaveLength(1)

  })

  test('Default likes zero', async () => {

    const login = await api.post('/api/login').send({ username: testUsers[1].username, password: testUsers[1].password })

    const newBlog = {
      title: 'Likes Test Blog',
      author: 'Test Author',
      url: 'Test url'
    }

    await api.post('/api/blogs').set('Authorization', `bearer ${login.body.token}`).send(newBlog)

    const result = await api.get('/api/blogs')
    //console.log(result.body)
    const blog = result.body.find(b => b.title === 'Likes Test Blog')
    //console.log(blog)
    expect(blog.likes).toBe(0)


  })

  test('Adding invalid blog', async () => {

    const login = await api.post('/api/login').send({ username: testUsers[1].username, password: testUsers[1].password })

    const newBlog = {
      author: 'Test Author'
    }
    await api.post('/api/blogs').set('Authorization', `bearer ${login.body.token}`).send(newBlog).expect(400)

  })

  test('Adding blog without token', async () => {
    const newBlog = {
      title: 'Token Test Blog',
      author: 'Test Author',
      url: 'Test Url'
    }

    await api.post('/api/blogs').send(newBlog).expect(401)
  })

})

afterAll(() => {
  mongoose.connection.close()
})