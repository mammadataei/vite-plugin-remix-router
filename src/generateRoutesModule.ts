import fs from 'fs'
import { ActionFunction, LoaderFunction, RouteObject } from 'react-router-dom'
import type { RouteNode } from './buildRouteTree'
import {
  createImportName,
  hasAction,
  hasErrorBoundary,
  hasErrorElement,
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
  const code = fs.readFileSync(toAbsolutePath(node.path), 'utf8')

  const path =
    node.name === 'index'
      ? { index: true }
      : { path: normalizeFilenameToRoute(node.name) }

  return {
    ...path,
    loader: resolveLoader(node.path, code) as LoaderFunction | undefined,
    action: resolveAction(node.path, code) as ActionFunction | undefined,
    errorElement: resolveErrorElement(node.path, code),
    element: createRouteElement(node.path),
  }
}

function createRouteElement(filePath: string) {
  return `::React.createElement(React.lazy(() => import("/${filePath}")))::`
}

function resolveLoader(filePath: string, code: string) {
  if (hasLoader(code)) {
    const importName = createImportName(filePath, 'LOADER')

    imports.push(`import { loader as ${importName} } from '/${filePath}';`)

    return `::${importName}::`
  }

  return undefined
}

function resolveAction(filePath: string, code: string) {
  if (hasAction(code)) {
    const importName = createImportName(filePath, 'ACTION')

    imports.push(`import { action as ${importName} } from '/${filePath}';`)

    return `::${importName}::`
  }

  return undefined
}

function resolveErrorElement(filePath: string, code: string) {
  if (hasErrorElement(code)) {
    const importName = createImportName(filePath, 'ERROR_ELEMENT').toUpperCase()

    imports.push(
      `import { ErrorElement as ${importName} } from '/${filePath}';`,
    )

    return `::React.createElement(${importName})::`
  }

  if (hasErrorBoundary(code)) {
    const importName = createImportName(filePath, 'ERROR_ELEMENT').toUpperCase()

    imports.push(
      `import { ErrorBoundary as ${importName} } from '/${filePath}';`,
    )

    return `::React.createElement(${importName})::`
  }

  return undefined
}
