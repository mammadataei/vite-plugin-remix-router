import fs from 'fs'
import { ActionFunction, LoaderFunction, RouteObject } from 'react-router-dom'
import type { RouteNode } from './buildRouteTree'
import {
  createImportName,
  hasAction,
  hasLoader,
  normalizeFilenameToRoute,
  toAbsolutePath,
} from './utils'

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
    element: node.layoutPath && createRouteElement(node.layoutPath),
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
    loader: resolveLoader(node.path) as LoaderFunction | undefined,
    action: resolveAction(node.path) as ActionFunction | undefined,
    element: createRouteElement(node.path),
  }
}

function createRouteElement(filePath: string) {
  return `::React.createElement(React.lazy(() => import("/${filePath}")))::`
}

function resolveLoader(filePath: string) {
  const code = fs.readFileSync(toAbsolutePath(filePath), 'utf8')

  if (hasLoader(code)) {
    const importName = createImportName(filePath, 'LOADER')

    imports.push(`import { loader as ${importName} } from '/${filePath}';`)

    return `::${importName}::`
  }

  return undefined
}

function resolveAction(filePath: string) {
  const code = fs.readFileSync(toAbsolutePath(filePath), 'utf8')

  if (hasAction(code)) {
    const importName = createImportName(filePath, 'ACTION')

    imports.push(`import { action as ${importName} } from '/${filePath}';`)

    return `::${importName}::`
  }

  return undefined
}
