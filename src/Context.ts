import path from 'path'
import { normalizePath, ViteDevServer } from 'vite'
import { Options, ResolvedOptions, UserOptions } from './types'
import { RouteTree } from './RouteTree'
import { RouteModule } from './RouteModule'
import { RESOLVED_VIRTUAL_MODULE_ID } from './constants'

const defaultOptions: Options = {
  pageDir: 'src/pages',
  extensions: ['tsx', 'jsx'],
}

export class Context {
  private readonly options: ResolvedOptions

  private server: ViteDevServer | undefined

  private routeTree: RouteTree

  private routeModule: RouteModule

  constructor(root: string, userOptions?: UserOptions) {
    this.options = {
      root: root ?? normalizePath(process.cwd()),
      ...defaultOptions,
      ...userOptions,
    }

    this.routeTree = new RouteTree(this.options)
    this.routeModule = new RouteModule(this.options)

    this.routeTree.build()
    this.routeModule.buildRouteObject(this.routeTree.root)
  }

  configureServer(server: ViteDevServer) {
    this.server = server

    this.server.watcher.on('unlink', (filePath) => {
      if (!this.isTarget(filePath)) return

      this.routeTree.rebuild()
      this.routeModule.buildRouteObject(this.routeTree.root)
      this.invalidateRoutesModule()
      this.reloadServer()
    })

    this.server.watcher.on('add', (filePath) => {
      if (!this.isTarget(filePath)) return

      this.routeTree.rebuild()
      this.routeModule.buildRouteObject(this.routeTree.root)
      this.invalidateRoutesModule()
      this.reloadServer()
    })

    this.server.watcher.on('change', (filePath) => {
      if (!this.isTarget(filePath)) return

      this.routeModule.buildRouteObject(this.routeTree.root)
      this.invalidateRoutesModule()
      this.reloadServer()
    })
  }

  resolveRoutesModule() {
    return this.routeModule.generate()
  }

  private isTarget(filePath: string) {
    return (
      filePath.startsWith(path.resolve(this.options.pageDir)) &&
      this.options.extensions.some((ext) => filePath.endsWith(ext))
    )
  }

  private invalidateRoutesModule() {
    if (!this.server) return

    const { moduleGraph } = this.server
    const module = moduleGraph.getModuleById(RESOLVED_VIRTUAL_MODULE_ID)

    if (module) {
      moduleGraph.invalidateModule(module)
    }
  }

  private reloadServer() {
    this.server?.ws.send({
      type: 'full-reload',
    })
  }
}
