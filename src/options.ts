import { normalizePath } from 'vite'
import { Options, ResolvedOptions, UserOptions } from './types'

const defaultOptions: Options = {
  routesDirectory: 'src/routes',
  extensions: ['tsx', 'jsx'],
}

let resolvedOptions: ResolvedOptions | null = null

export function resolveOptions(root: string, userOptions?: UserOptions) {
  return {
    root: root ?? normalizePath(process.cwd()),
    ...defaultOptions,
    ...userOptions,
  }
}

export function setOptions(options: ResolvedOptions) {
  resolvedOptions = options
}

export function getOptions() {
  if (resolvedOptions === null) {
    throw new Error('Something went wrong. Unable to resolve "UserOptions".')
  }

  return resolvedOptions
}
