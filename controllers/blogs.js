const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
    response.json(blogs)
  } catch(error) {
    next(error)
  }
})


blogsRouter.post('', async (request, response, next) => {
  try {
    const body = request.body
    console.log(request)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if(!request.token || !decodedToken.id){
      return response.status(401).json({ error: 'Token missing or invalid' })
    }

    //console.log(decodedToken)
    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      user: user._id
    })


    const savedBlog = await blog.save()

    //console.log(user)
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)

  } catch(error) {
    next(error)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {

    const blog = await Blog.findById(request.params.id)
    //console.log(blog)
    const user = await User.findById(blog.user)
    //console.log(user)
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if(!request.token || !decodedToken.id || !(decodedToken.id === user.id)){
      return response.status(401).json({ error: 'Token missing or invalid' })
    }

    //console.log(decodedToken)

    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch(error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const newLikes = { likes: request.body.likes }
    const newBlog = await Blog.findByIdAndUpdate(request.params.id, newLikes, { new: true }).populate('user', { username: 1, name: 1, id: 1 })
    console.log(newBlog)
    response.json(newBlog)
  } catch(error) {
    next(error)
  }
})

module.exports = blogsRouter