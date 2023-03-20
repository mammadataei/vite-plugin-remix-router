import {
  RouteObject,
  LazyRouteFunction,
  NonIndexRouteObject,
} from 'react-router-dom'
import type { RouteNode } from './buildRouteTree'
import { normalizeFilenameToRoute, toAbsolutePath } from './utils'

let imports: Array<string> = []

export function generateRoutesModule(rootNode: RouteNode) {
  imports = []
  const routes = createRouteObject(rootNode)

  const code: Array<string> = []
  code.push("import React from 'react';")
  code.push(...imports)
  code.push('')

  const routesString = JSON.stringify(routes, null, 2)
    .replace(/\\"/g, '"')
    .replace(/("::|::")/g, '')

  code.push(`export const routes = [${routesString}]\n`)

  return code.join('\n')
}

function createRouteObject(node: RouteNode) {
  if (node.isDirectory) {
    return createLayoutRoute(node)
  }

  return createPageRoute(node)
}

function createLayoutRoute(node: RouteNode): RouteObject {
  return {
    lazy: node.layoutPath
      ? (createLazyRoute(
          node.layoutPath,
        ) as unknown as LazyRouteFunction<NonIndexRouteObject>)
      : undefined,
    path: node.name.startsWith('__')
      ? undefined
      : normalizeFilenameToRoute(node.name),
    children: node.children.map((child) => createRouteObject(child)),
  }
}

function createPageRoute(node: RouteNode): RouteObject {
  const path =
    node.name === 'index'
      ? { index: true }
      : { path: normalizeFilenameToRoute(node.name) }

  return {
    ...path,
    lazy: createLazyRoute(
      node.path,
    ) as unknown as LazyRouteFunction<NonIndexRouteObject>,
  }
}

function createLazyRoute(filePath: string) {
  return `::() => import("/${filePath}")::`
}
