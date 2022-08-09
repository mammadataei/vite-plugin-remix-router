import fs from 'fs'
import path from 'path'
import { ResolvedOptions } from './types'
import { RouteObject } from 'react-router-dom'
import type { RouteNode } from './buildRouteTree'
import { isDirectory, normalizeFilenameToRoute } from './utils'
import { traverse } from './traverse'

const ROUTE_CONFIG_REGEX = /export\s(const|function)\sgetRouteConfig/

function createConfigVariableName(filePath: string) {
  return (
    filePath
      .replace(/\//g, '_')
      .replace(/\.[^/.]+$/, '')
      .replace(/^_/, '') + '_ROUTE_CONFIG'
  )
}

function createRouteElement(filePath: string) {
  return `::React.createElement(React.lazy(() => import("/${filePath}")))::`
}

export class RouteModule {
  private options: ResolvedOptions

  private routes: RouteObject | undefined

  private imports: Array<string> = []

  constructor(options: ResolvedOptions) {
    this.options = options
  }

  private absolutePath(filePath: string) {
    return path.join(this.options.root, filePath)
  }

  buildRouteObject(rootNode: RouteNode) {
    this.imports = []
    this.routes = this.createRouteObject(rootNode)

    return this.routes
  }

  private createRouteObject(node: RouteNode) {
    if (isDirectory(this.absolutePath(node.path))) {
      return this.createLayoutRoute(node)
    }

    return this.createPageRoute(node)
  }

  private createLayoutRoute(node: RouteNode): RouteObject {
    const layout = node.children.find((child) => child.name === '_layout')

    const element = layout ? { element: createRouteElement(layout.path) } : {}
    const config = layout ? this.resolveRouteConfig(layout.path) : {}

    return {
      ...element,
      path: normalizeFilenameToRoute(node.name),
      ...config,
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
      ...this.resolveRouteConfig(node.path),
    }
  }

  private resolveRouteConfig(filePath: string) {
    const code = fs.readFileSync(this.absolutePath(filePath), 'utf8')

    if (ROUTE_CONFIG_REGEX.test(code)) {
      const variableName = createConfigVariableName(filePath)

      this.imports.push(
        `import { getRouteConfig as ${variableName} } from '/${filePath}';`,
      )

      return { getRouteConfig: `::${variableName}::` }
    }

    return {}
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

    code.push(`export ${traverse.toString()}`)
    return code.join('\n')
  }
}
