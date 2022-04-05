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

    if (modifiedRouteObject.children) {
      modifiedRouteObject.children = traverse(
        modifiedRouteObject.children,
        callback,
      )
    }

    return modifiedRouteObject
  })
}
