import fs from 'fs'

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
