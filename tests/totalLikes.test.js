const listHelper = require('../utils/list_helpper')
const testBlogs = require('./test_blogs')

describe('total likes', () => {

  test('of one blog', () => {
    const singleBlog = [testBlogs[0]]

    const result = listHelper.totalLikes(singleBlog)
    expect(result).toBe(7)
  })

  test('no blogs', () => {
    const noBlogs = []

    const result = listHelper.totalLikes(noBlogs)
    expect(result).toBe(0)
  })

  test('multipe blogs', () => {
    const result = listHelper.totalLikes(testBlogs)
    expect(result).toBe(36)
  })
})