const listHelper = require('../utils/list_helpper')

test('Dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})