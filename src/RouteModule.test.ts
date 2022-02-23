import { RouteModule } from './RouteModule'
import { RouteNode, RouteTree } from './RouteTree'

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
    getRouteConfig: '::example_src_pages_about_ROUTE_CONFIG::',
  })
})

it('should convert directory RouteNode to RouteObject', () => {
  const routeNode = new RouteNode('example/src/pages/posts')
  routeNode.children = [
    new RouteNode('example/src/pages/posts/[slug].tsx'),
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
  const routeNode = new RouteNode('example/src/pages/posts/[slug].tsx')
  const route = routeModuleGenerator.buildRouteObject(routeNode)

  expect(route.path).toEqual(':slug')
  expect(route.children).toBeUndefined()
  expect(route.element).toEqual(
    `::React.createElement(React.lazy(() => import("/${routeNode.path}")))::`,
  )
})

it('should convert [...all] routes to `no-match` route', () => {
  const routeNode = new RouteNode('example/src/pages/[...all].tsx')
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
    getRouteConfig: '::example_src_pages_users__layout_ROUTE_CONFIG::',
  })
})

it('should add import for page getRouteConfig if exists', () => {
  const routeNode = new RouteNode('example/src/pages/about.tsx')
  routeModuleGenerator.buildRouteObject(routeNode)
  const routeModule = routeModuleGenerator.generate()

  expect(routeModule).toMatchInlineSnapshot(`
    "import React from 'react';
    import { getRouteConfig as example_src_pages_about_ROUTE_CONFIG } from '/example/src/pages/about.tsx';
    
    export const routes = [{
      \\"path\\": \\"about\\",
      \\"element\\": React.createElement(React.lazy(() => import(\\"/example/src/pages/about.tsx\\"))),
      \\"getRouteConfig\\": example_src_pages_about_ROUTE_CONFIG
    }]
    
    export function traverse(routes, callback) {
      return routes.map((route) => {
        const modifiedRouteObject = callback(route);
        if (route.children) {
          modifiedRouteObject.children = traverse(route.children, callback);
        }
        return modifiedRouteObject;
      });
    }"
  `)
})

it('should add import for `_layout` getRouteConfig if exists', () => {
  const routeNode = new RouteNode('example/src/pages/users')
  routeNode.children = [
    new RouteNode('example/src/pages/users/_layout.tsx'),
    new RouteNode('example/src/pages/users/index.tsx'),
  ]

  routeModuleGenerator.buildRouteObject(routeNode)
  const routeModule = routeModuleGenerator.generate()

  expect(routeModule).toMatchInlineSnapshot(`
    "import React from 'react';
    import { getRouteConfig as example_src_pages_users__layout_ROUTE_CONFIG } from '/example/src/pages/users/_layout.tsx';
    
    export const routes = [{
      \\"element\\": React.createElement(React.lazy(() => import(\\"/example/src/pages/users/_layout.tsx\\"))),
      \\"path\\": \\"users\\",
      \\"getRouteConfig\\": example_src_pages_users__layout_ROUTE_CONFIG,
      \\"children\\": [
        {
          \\"index\\": true,
          \\"element\\": React.createElement(React.lazy(() => import(\\"/example/src/pages/users/index.tsx\\")))
        }
      ]
    }]
    
    export function traverse(routes, callback) {
      return routes.map((route) => {
        const modifiedRouteObject = callback(route);
        if (route.children) {
          modifiedRouteObject.children = traverse(route.children, callback);
        }
        return modifiedRouteObject;
      });
    }"
  `)
})

it('should generate routes module', () => {
  const routeNode = new RouteNode('example/src/pages/about.tsx')
  routeModuleGenerator.buildRouteObject(routeNode)
  const routeModule = routeModuleGenerator.generate()

  expect(routeModule).toMatchInlineSnapshot(`
    "import React from 'react';
    import { getRouteConfig as example_src_pages_about_ROUTE_CONFIG } from '/example/src/pages/about.tsx';
    
    export const routes = [{
      \\"path\\": \\"about\\",
      \\"element\\": React.createElement(React.lazy(() => import(\\"/example/src/pages/about.tsx\\"))),
      \\"getRouteConfig\\": example_src_pages_about_ROUTE_CONFIG
    }]
    
    export function traverse(routes, callback) {
      return routes.map((route) => {
        const modifiedRouteObject = callback(route);
        if (route.children) {
          modifiedRouteObject.children = traverse(route.children, callback);
        }
        return modifiedRouteObject;
      });
    }"
  `)
})

it('should match routes snapshot', () => {
  const routeTree = new RouteTree(options).build()
  const routes = routeModuleGenerator.buildRouteObject(routeTree)
  expect(routes).toMatchSnapshot()
})

it('should match route modules snapshot', () => {
  const routeTree = new RouteTree(options).build()
  routeModuleGenerator.buildRouteObject(routeTree)
  const routesModule = routeModuleGenerator.generate()
  expect(routesModule).toMatchSnapshot()
})
