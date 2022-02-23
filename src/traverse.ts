import { RouteObject } from 'react-router-dom'
import { ExtendedRouteObject } from './types'

export function traverse<
  RouteConfig,
  ModifiedRoute extends RouteObject = RouteObject,
  RouteConfigGetter = () => RouteConfig,
>(
  routes: Array<ExtendedRouteObject<RouteConfig, RouteConfigGetter>>,
  callback: (
    route: ExtendedRouteObject<RouteConfig, RouteConfigGetter>,
  ) => ModifiedRoute,
): Array<ModifiedRoute> {
  return routes.map((route) => {
    const modifiedRouteObject = callback(route)

    if (route.children) {
      modifiedRouteObject.children = traverse(route.children, callback)
    }

    return modifiedRouteObject
  })
}
