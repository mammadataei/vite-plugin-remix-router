import { RouteObject } from 'react-router-dom'
import { traverse } from './traverse'

it('should traverse routes and call callback on each route object', () => {
  interface RouteConfig {
    name?: string
    auth?: boolean
  }

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
