import { RouteObject } from 'react-router-dom'
import type { RouteNode } from './buildRouteTree'
import { normalizeFilenameToRoute } from './utils'

function createRouteElement(filePath: string) {
  return `::React.createElement(React.lazy(() => import("/${filePath}")))::`
}

export class RouteModule {
  private routes: RouteObject | undefined

  private imports: Array<string> = []

  buildRouteObject(rootNode: RouteNode) {
    this.imports = []
    this.routes = this.createRouteObject(rootNode)

    return this.routes
  }

  private createRouteObject(node: RouteNode) {
    if (node.isDirectory) {
      if (node.layoutPath) {
        return this.createLayoutRoute(node)
      }

      return this.createDirectoryRoute(node)
    }

    return this.createPageRoute(node)
  }

  private createLayoutRoute(node: RouteNode): RouteObject {
    return {
      element: node.layoutPath && createRouteElement(node.layoutPath),
      path: node.name.startsWith('__')
        ? undefined
        : normalizeFilenameToRoute(node.name),
      children: node.children
        .filter((child) => child.name !== '_layout')
        .map((child) => this.createRouteObject(child)),
    }
  }

  private createDirectoryRoute(node: RouteNode): RouteObject {
    return {
      path: node.name.startsWith('__')
        ? undefined
        : normalizeFilenameToRoute(node.name),
      children: node.children
        .filter((child) => child.name !== '_layout')
        .map((child) => this.createRouteObject(child)),
    }
  }

  private createPageRoute(node: RouteNode): RouteObject {
    const path =
      node.name === 'index'
        ? { index: true }
        : { path: normalizeFilenameToRoute(node.name) }

    return {
      ...path,
      element: createRouteElement(node.path),
    }
  }

  generate() {
    const code: Array<string> = []
    code.push("import React from 'react';")
    code.push(...this.imports)
    code.push('')

    const routesString = JSON.stringify(this.routes, null, 2)
      .replace(/\\"/g, '"') // check this
      .replace(/("::|::")/g, '')

    code.push(`export const routes = [${routesString}]\n`)

    return code.join('\n')
  }
}
