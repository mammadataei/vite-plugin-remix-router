import fs from 'fs'
import path from 'path'
import { ResolvedOptions } from './types'
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

export class RouteTree {
  private options: ResolvedOptions

  private _rootNode: RouteNode | undefined

  constructor(options: ResolvedOptions) {
    this.options = options
  }

  get root(): RouteNode {
    if (!this._rootNode) {
      return this.build()
    }

    return this._rootNode
  }

  build() {
    this._rootNode = this.createNode(this.options.pageDir)
    this._rootNode.name = '/'

    return this._rootNode
  }

  rebuild() {
    this._rootNode = undefined
    return this.build()
  }

  private createNode(filePath: string) {
    const node = new RouteNode(filePath)

    if (isDirectory(this.absolutePath(filePath))) {
      const children = this.resolveChildren(filePath)

      node.children = children.map((child) =>
        this.createNode(`${filePath}/${child}`),
      )
    }

    return node
  }

  private absolutePath(filePath: string) {
    return path.join(this.options.root, filePath)
  }

  private resolveChildren(directoryPath: string) {
    const children = fs.readdirSync(this.absolutePath(directoryPath))

    return children.filter((child) => {
      const childPath = path.join(directoryPath, child)

      if (isDirectory(childPath)) {
        return true
      }

      const extension = path.extname(childPath)
      return this.options.extensions.includes(extension.substring(1))
    })
  }
}
