import path from 'path'
import { UserOptions } from './types'
import { Plugin, ViteDevServer } from 'vite'
import { buildRouteTree, RouteNode } from './buildRouteTree'
import { RESOLVED_VIRTUAL_MODULE_ID, VIRTUAL_MODULE_ID } from './constants'
import { getOptions, resolveOptions, setOptions } from './options'
import { generateRoutesModule } from './generateRoutesModule'

export default function Plugin(userOptions?: UserOptions): Plugin {
  let routeTree: RouteNode

  return {
    name: 'vite-plugin-remix-router',
    enforce: 'pre',

    configResolved({ root }) {
      setOptions(resolveOptions(root, userOptions))
      routeTree = buildRouteTree()
    },

    configureServer(server) {
      server.watcher.on('unlink', (filePath) => {
        if (!isRouteFile(filePath)) {
          return
        }

        routeTree = buildRouteTree()
        reloadServer(server)
      })

      server.watcher.on('add', (filePath) => {
        if (!isRouteFile(filePath)) {
          return
        }

        routeTree = buildRouteTree()
        reloadServer(server)
      })

      server.watcher.on('change', (filePath) => {
        if (!isRouteFile(filePath)) {
          return
        }

        reloadServer(server)
      })
    },

    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID
      }

      return null
    },

    load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        return generateRoutesModule(routeTree)
      }

      return null
    },
  }
}

function isRouteFile(filePath: string) {
  return (
    filePath.startsWith(path.resolve(getOptions().routesDirectory)) &&
    getOptions().extensions.some((ext) => filePath.endsWith(ext))
  )
}

function reloadServer(server: ViteDevServer) {
  const { moduleGraph } = server
  const module = moduleGraph.getModuleById(RESOLVED_VIRTUAL_MODULE_ID)

  if (module) {
    moduleGraph.invalidateModule(module)
  }

  server.ws.send({
    type: 'full-reload',
  })
}
