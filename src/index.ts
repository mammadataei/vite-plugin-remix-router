import { Plugin } from 'vite'
import { Context } from './Context'
import { UserOptions } from './types'
import { RESOLVED_VIRTUAL_MODULE_ID, VIRTUAL_MODULE_ID } from './constants'

export type { ExtendedRouteObject } from './types'
export type { traverse } from './traverse'

export default function Plugin(userOptions?: UserOptions): Plugin {
  let context: Context

  return {
    name: 'vite-plugin-remix-router',
    enforce: 'pre',

    configResolved({ root }) {
      context = new Context(root, userOptions)
    },

    configureServer(server) {
      context.configureServer(server)
    },

    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID
      }

      return null
    },

    load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        return context.resolveRoutesModule()
      }

      return null
    },
  }
}
