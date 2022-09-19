import { buildRouteTree, RouteNode } from './buildRouteTree'
import { expect } from 'vitest'
import { setOptions } from './options'

setOptions({
  root: process.cwd(),
  extensions: ['tsx', 'jsx'],
  pageDir: 'example/src/pages',
})

const root = buildRouteTree()

it('should scan the pages directory and generate the routeTree', () => {
  expect(root).toBeInstanceOf(RouteNode)
  expect(root.name).toEqual('/')
  expect(root.path).toEqual('example/src/pages')
})

it('should generate children nodes of the root', () => {
  expect(root.children).toHaveLength(5)

  const children = root.children.map((child) => child.name)
  expect(children).toEqual(['$', '__auth', '__panel', 'about', 'index'])
})

it('should recursively generate children nodes for each directory', () => {
  const directories = root.children.filter((child) => child.children.length > 0)

  expect(directories).toHaveLength(2)
  const [auth, panel] = directories

  expect(auth.name).toEqual('__auth')
  expect(auth.children).toHaveLength(1)
  expect(auth.children.map((child) => child.name)).toEqual(['login'])

  expect(panel.name).toEqual('__panel')
  expect(panel.children).toHaveLength(2)
  expect(panel.children.map((child) => child.name)).toEqual(['posts', 'users'])
})

it('should exclude files which are not in the extensions list', () => {
  const ignored = root.children.find((child) => child.name === 'ignored')
  expect(ignored).toBeUndefined()

  const posts = root.children.find((child) => child.name === 'posts')

  const ignoredJson = posts?.children.find((child) => child.name === 'ignored')
  expect(ignoredJson).toBeUndefined()
})

it('should match snapshot', () => {
  expect(root).toMatchSnapshot()
})
