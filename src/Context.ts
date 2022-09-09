import path from 'path'
import { ViteDevServer } from 'vite'
import { buildRouteTree, RouteNode } from './buildRouteTree'
import { RouteModule } from './RouteModule'
import { RESOLVED_VIRTUAL_MODULE_ID } from './constants'
import { getOptions } from './options'

export class Context {
  private server: ViteDevServer | undefined

  private routeTree: RouteNode

  private routeModule: RouteModule

  constructor() {
    this.routeModule = new RouteModule()

    this.routeTree = buildRouteTree()
    this.routeModule.buildRouteObject(this.routeTree)
  }

  configureServer(server: ViteDevServer) {
    this.server = server

    this.server.watcher.on('unlink', (filePath) => {
      if (!this.isTarget(filePath)) return

      this.routeTree = buildRouteTree()
      this.routeModule.buildRouteObject(this.routeTree)
      this.invalidateRoutesModule()
      this.reloadServer()
    })

    this.server.watcher.on('add', (filePath) => {
      if (!this.isTarget(filePath)) return

      this.routeTree = buildRouteTree()
      this.routeModule.buildRouteObject(this.routeTree)
      this.invalidateRoutesModule()
      this.reloadServer()
    })

    this.server.watcher.on('change', (filePath) => {
      if (!this.isTarget(filePath)) return

      this.routeModule.buildRouteObject(this.routeTree)
      this.invalidateRoutesModule()
      this.reloadServer()
    })
  }

  resolveRoutesModule() {
    return this.routeModule.generate()
  }

  private isTarget(filePath: string) {
    return (
      filePath.startsWith(path.resolve(getOptions().pageDir)) &&
      getOptions().extensions.some((ext) => filePath.endsWith(ext))
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
