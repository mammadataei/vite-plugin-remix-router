import fs from 'fs'
import path from 'path'
import { getOptions } from './options'
import { isDirectory } from './utils'

export class RouteNode {
  name: string

  path: string

  children: Array<RouteNode> = []

  isDirectory?: boolean

  layoutPath?: string

  constructor(filePath: string) {
    this.name = path.parse(filePath).name
    this.path = filePath
  }
}

export function buildRouteTree(): RouteNode {
  const root = createNode(getOptions().routesDirectory)
  root.isDirectory = true
  root.name = '/'

  return root
}

function createNode(filePath: string) {
  const node = new RouteNode(filePath)

  if (isDirectory(absolutePath(filePath))) {
    node.isDirectory = true
    node.layoutPath = getLayoutPath(filePath)

    const children = resolveChildren(absolutePath(filePath))
    node.children = children.map((child) => createNode(`${filePath}/${child}`))
  }

  return node
}

function absolutePath(filePath: string) {
  return path.join(getOptions().root, filePath)
}

function getLayoutPath(directoryPath: string) {
  return getOptions()
    .extensions.map((extension) => `${directoryPath}.${extension}`)
    .find((filePath) => fs.existsSync(absolutePath(filePath)))
}

function resolveChildren(directoryPath: string) {
  const children = fs.readdirSync(directoryPath)

  return children.filter((child) => {
    const childPath = path.join(directoryPath, child)

    if (isDirectory(childPath)) {
      return true
    }

    if (isLayout(childPath)) {
      return false
    }

    const extension = path.extname(childPath)
    return getOptions().extensions.includes(extension.substring(1))
  })
}

function isLayout(filePath: string) {
  return fs.existsSync(filePath.split('.').slice(0, -1).join('.'))
}
