import { RouteModule } from './RouteModule'
import { buildRouteTree, RouteNode } from './buildRouteTree'

const options = {
  root: process.cwd(),
  extensions: ['tsx', 'jsx'],
  pageDir: 'example/src/pages',
}

const routeModuleGenerator = new RouteModule(options)

it('should convert RouteNode to RouteObject', () => {
  const routeNode = new RouteNode('example/src/pages/about.tsx')
  const route = routeModuleGenerator.buildRouteObject(routeNode)

  expect(route).toEqual({
    path: 'about',
    element: `::React.createElement(React.lazy(() => import("/${routeNode.path}")))::`,
  })
})

it('should convert directory RouteNode to RouteObject', () => {
  const routeNode = new RouteNode('example/src/pages/posts')
  routeNode.children = [
    new RouteNode('example/src/pages/posts/$slug.tsx'),
    new RouteNode('example/src/pages/posts/index.tsx'),
  ]

  const { children, ...route } =
    routeModuleGenerator.buildRouteObject(routeNode)

  expect(route).toEqual({
    path: 'posts',
  })
  expect(children).toHaveLength(2)
})

it('should convert dynamic paths to route parameters', () => {
  const routeNode = new RouteNode('example/src/pages/posts/$slug.tsx')
  const route = routeModuleGenerator.buildRouteObject(routeNode)

  expect(route.path).toEqual(':slug')
  expect(route.children).toBeUndefined()
  expect(route.element).toEqual(
    `::React.createElement(React.lazy(() => import("/${routeNode.path}")))::`,
  )
})

it('should convert $ routes to splat route', () => {
  const routeNode = new RouteNode('example/src/pages/$.tsx')
  const route = routeModuleGenerator.buildRouteObject(routeNode)

  expect(route).toEqual({
    path: '*',
    element: `::React.createElement(React.lazy(() => import("/${routeNode.path}")))::`,
  })
})

it('should create index route for RouteNodes with name `index`', () => {
  const routeNode = new RouteNode('example/src/pages/users/index.tsx')
  const route = routeModuleGenerator.buildRouteObject(routeNode)

  expect(route).toEqual({
    index: true,
    element: `::React.createElement(React.lazy(() => import("/${routeNode.path}")))::`,
  })
})

it('should user `_layout` as element for directories', () => {
  const routeNode = new RouteNode('example/src/pages/users')
  routeNode.children = [
    new RouteNode('example/src/pages/users/_layout.tsx'),
    new RouteNode('example/src/pages/users/index.tsx'),
  ]

  const { children, ...route } =
    routeModuleGenerator.buildRouteObject(routeNode)

  expect(children).toHaveLength(1)
  expect(route).toEqual({
    path: 'users',
    element: `::React.createElement(React.lazy(() => import("/${routeNode.path}/_layout.tsx")))::`,
  })
})

it('should match routes snapshot', () => {
  const routeTree = buildRouteTree(options)
  const routes = routeModuleGenerator.buildRouteObject(routeTree)
  expect(routes).toMatchSnapshot()
})

it('should match route modules snapshot', () => {
  const routeTree = buildRouteTree(options)
  routeModuleGenerator.buildRouteObject(routeTree)
  const routesModule = routeModuleGenerator.generate()
  expect(routesModule).toMatchSnapshot()
})
