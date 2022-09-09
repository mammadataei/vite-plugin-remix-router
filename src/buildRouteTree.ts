import fs from 'fs'
import path from 'path'
import { getOptions } from './options'
import { isDirectory } from './utils'

export class RouteNode {
  name: string

  path: string

  children: Array<RouteNode> = []

  constructor(filePath: string) {
    this.name = path.parse(filePath).name
    this.path = filePath
  }
}

export function buildRouteTree(): RouteNode {
  function createNode(filePath: string) {
    const node = new RouteNode(filePath)

    if (isDirectory(absolutePath(filePath))) {
      const children = resolveChildren(filePath)

      node.children = children.map((child) =>
        createNode(`${filePath}/${child}`),
      )
    }

    return node
  }

  function absolutePath(filePath: string) {
    return path.join(getOptions().root, filePath)
  }

  function resolveChildren(directoryPath: string) {
    const children = fs.readdirSync(absolutePath(directoryPath))

    return children.filter((child) => {
      const childPath = path.join(directoryPath, child)

      if (isDirectory(childPath)) {
        return true
      }

      const extension = path.extname(childPath)
      return getOptions().extensions.includes(extension.substring(1))
    })
  }

  const root = createNode(getOptions().pageDir)
  root.name = '/'

  return root
}
