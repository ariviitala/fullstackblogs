const listHelpper = require('../utils/list_helpper')
const testBlogs = require('./test_blogs')

describe('Most blogs', () => {

  test('One blog', () => {
    const result = listHelpper.mostBlogs([testBlogs[0]])
    return expect(result).toEqual({ author: 'Michael Chan', blogs: 1 })

  })

  test('All blogs', () => {
    const result = listHelpper.mostBlogs(testBlogs)
    return expect(result).toEqual({ author: 'Robert C. Martin',blogs: 3 })
  })
})

describe('Most likes', () => {

  test('One blog', () => {
    const result = listHelpper.mostLikes([testBlogs[0]])
    return expect(result).toEqual({ author: 'Michael Chan', likes: 7 })

  })

  test('All blogs', () => {
    const result = listHelpper.mostLikes(testBlogs)
    return expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 17 })
  })
})

