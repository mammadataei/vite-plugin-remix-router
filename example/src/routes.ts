import { RouteObject, useRoutes } from 'react-router-dom'
import { routes, traverse } from 'virtual:routes'

interface RouteConfig {
  name?: string
  auth?: boolean
}

export function Routes() {
  return useRoutes(
    traverse<RouteConfig, RouteConfig & RouteObject>(routes, (route) => {
      const { getRouteConfig, ...routeObject } = route

      return {
        ...routeObject,
        ...getRouteConfig?.(),
      }
    }),
  )
}
