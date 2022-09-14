import { RouteModule } from './RouteModule'
import { buildRouteTree, RouteNode } from './buildRouteTree'
import { setOptions } from './options'

setOptions({
  root: process.cwd(),
  extensions: ['tsx', 'jsx'],
  pageDir: 'example/src/pages',
})

const routeModuleGenerator = new RouteModule()

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
  routeNode.isDirectory = true
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

it('should use same name module as element for directories', () => {
  const routeNode = new RouteNode('example/src/pages/users/$user')
  routeNode.layoutPath = 'example/src/pages/users/$user.tsx'
  routeNode.isDirectory = true
  routeNode.children = [
    new RouteNode('example/src/pages/users/$user/index.tsx'),
    new RouteNode('example/src/pages/users/$user/profile.tsx'),
    new RouteNode('example/src/pages/users/$user/settings.tsx'),
  ]

  const { children, ...route } =
    routeModuleGenerator.buildRouteObject(routeNode)

  expect(children).toHaveLength(3)
  expect(route).toEqual({
    path: ':user',
    element:
      '::React.createElement(React.lazy(() => import("/example/src/pages/users/$user.tsx")))::',
  })
})

it('should match routes snapshot', () => {
  const routeTree = buildRouteTree()
  const routes = routeModuleGenerator.buildRouteObject(routeTree)
  expect(routes).toMatchSnapshot()
})

it('should match route modules snapshot', () => {
  const routeTree = buildRouteTree()
  routeModuleGenerator.buildRouteObject(routeTree)
  const routesModule = routeModuleGenerator.generate()
  expect(routesModule).toMatchSnapshot()
})
