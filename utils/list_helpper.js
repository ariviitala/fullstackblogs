const dummy = (blogs) => {
  return blogs ? 1 : 1
}

const totalLikes = (blogs) => {
  const reducer = (total, blog) => {
    return total + blog.likes
  }
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const maxLikes = Math.max(...blogs.map(b => b.likes))
  return blogs.find(b => b.likes === maxLikes)
}

const mostBlogs = (blogs) => {
  //probably a n^2 algorithm but look at that functionality though
  const authorBlogs = blogs.map(b => ({ author: b.author, blogs: blogs.filter(bl => bl.author === b.author).length }))
  const maxBlogs = authorBlogs.reduce((a, b) => Math.max(a, b.blogs), 0)
  return authorBlogs.find(b => b.blogs === maxBlogs)
}

const mostLikes = (blogs) => {

  const authorLikes = blogs.map(b => ({ author: b.author, likes: totalLikes(blogs.filter(bl => bl.author === b.author)) }))
  const maxLikes = authorLikes.reduce((a, b) => Math.max(a, b.likes), 0)
  return authorLikes.find(b => b.likes === maxLikes)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}