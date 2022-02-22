import { RouteNode, RouteTree } from './RouteTree'
import { expect } from 'vitest'

const routeTree = new RouteTree({
  root: process.cwd(),
  extensions: ['tsx', 'jsx'],
  pageDir: 'example/src/pages',
})

routeTree.build()

it('should scan the pages directory and generate the routeTree', () => {
  expect(routeTree.root).toBeInstanceOf(RouteNode)
  expect(routeTree.root.name).toEqual('/')
  expect(routeTree.root.path).toEqual('example/src/pages')
})

it('should generate children nodes of the root', () => {
  expect(routeTree.root.children).toHaveLength(6)

  const children = routeTree.root.children.map((child) => child.name)
  expect(children).toEqual([
    '[...all]',
    '_layout',
    'about',
    'index',
    'posts',
    'users',
  ])
})

it('should recursively generate children nodes for each directory', () => {
  const directories = routeTree.root.children.filter(
    (child) => child.children.length > 0,
  )

  expect(directories).toHaveLength(2)
  const [posts, users] = directories

  expect(posts.name).toEqual('posts')
  expect(posts.children).toHaveLength(2)

  const postsChildren = posts.children.map((child) => child.name)
  expect(postsChildren).toEqual(['[slug]', 'index'])

  expect(users.name).toEqual('users')
  expect(users.children).toHaveLength(3)

  const usersChildren = users.children.map((child) => child.name)
  expect(usersChildren).toEqual(['[user]', '_layout', 'index'])
})

it('should exclude files which are not in the extensions list', () => {
  const ignored = routeTree.root.children.find(
    (child) => child.name === 'ignored',
  )
  expect(ignored).toBeUndefined()

  const posts = routeTree.root.children.find((child) => child.name === 'posts')

  const ignoredJson = posts?.children.find((child) => child.name === 'ignored')
  expect(ignoredJson).toBeUndefined()
})

it('should be able to rebuild the routeTree', () => {
  const oldTree = routeTree.root
  expect(oldTree).not.toBe(routeTree.rebuild())
})

it('should match snapshot', () => {
  expect(routeTree.root).toMatchSnapshot()
})
