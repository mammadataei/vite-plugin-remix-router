import fs from 'fs'
import path from 'path'
import { getOptions } from './options'

const ROUTE_LOADER_REGEX = /(export\s)?(async\s)?(const|function)\sloader/

export function isDirectory(filePath: string) {
  return fs.statSync(filePath).isDirectory()
}

export function isCatchAllRoute(s: string) {
  return s === '$'
}

export function isDynamicRoute(s: string) {
  return s.startsWith('$')
}

export function parameterizeDynamicRoute(s: string) {
  return s.replace(/^\$(.+)$/, (_, p) => `:${p}`)
}

export function normalizeFilenameToRoute(filename: string) {
  const MATCH_ALL_ROUTE = '*'

  if (isCatchAllRoute(filename)) {
    return MATCH_ALL_ROUTE
  }

  if (isDynamicRoute(filename)) {
    return parameterizeDynamicRoute(filename)
  }

  return filename
}

export function toAbsolutePath(filePath: string) {
  return path.join(getOptions().root, filePath)
}

export function createImportName(filePath: string, postfix: string) {
  return (
    filePath
      .replace(/\//g, '_')
      .replace(/\.[^/.]+$/, '')
      .replace(/^_/, '') + `_${postfix}`
  )
}

export function hasLoader(code: string) {
  return ROUTE_LOADER_REGEX.test(code)
}
