import { RouteObject } from 'react-router-dom'
import { traverse } from './traverse'

interface RouteConfig {
  name?: string
  auth?: boolean
}

it('should traverse routes and call callback on each route object', () => {
  const routes = [
    {
      path: '/',
      children: [
        {
          path: '/about',
          getRouteConfig: (): RouteConfig => ({ name: 'about' }),
        },
        {
          path: 'users',
          getRouteConfig: (): RouteConfig => ({ auth: true }),
          children: [
            {
              path: 'user',
              children: [
                {
                  path: 'profile',
                  getRouteConfig: (): RouteConfig => ({ name: 'profile' }),
                },
              ],
            },
          ],
        },
      ],
    },
  ]

  const result = traverse<RouteConfig, RouteConfig & RouteObject>(
    routes,
    (route) => {
      const { getRouteConfig, ...routeObject } = route

      return {
        ...routeObject,
        ...getRouteConfig?.(),
      }
    },
  )

  expect(result).toEqual([
    {
      path: '/',
      children: [
        { name: 'about', path: '/about' },
        {
          path: 'users',
          auth: true,
          children: [
            {
              path: 'user',
              children: [{ name: 'profile', path: 'profile' }],
            },
          ],
        },
      ],
    },
  ])
})

it('should be possible to wrap route with multiple children', () => {
  const routes = [
    {
      path: '/',
      children: [
        {
          path: 'user',
          getRouteConfig: (): RouteConfig => ({ auth: true }),
          children: [{ path: 'account' }, { path: 'profile' }],
        },
      ],
    },
  ]

  const result = traverse<RouteConfig, RouteConfig & RouteObject>(
    routes,
    (route) => {
      const { getRouteConfig, ...routeObject } = route

      const routeConfig = getRouteConfig?.()

      if (routeConfig?.auth) {
        return {
          element: 'Middleware',
          children: [routeObject],
        }
      }
      return routeObject
    },
  )

  expect(result).toEqual([
    {
      path: '/',
      children: [
        {
          element: 'Middleware',
          children: [
            {
              path: 'user',
              children: [{ path: 'account' }, { path: 'profile' }],
            },
          ],
        },
      ],
    },
  ])
})
