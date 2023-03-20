import fs from 'fs'
import path from 'path'
import { getOptions } from './options'

const ROUTE_LOADER_REGEX = /(export\s)?(async\s)?(const|function)\sloader/
const ROUTE_ACTION_REGEX = /(export\s)?(async\s)?(const|function)\saction/
const ROUTE_ERROR_ELEMENT_REGEX =
  /(export\s)?(async\s)?(const|function)\sErrorElement/
const ROUTE_ERROR_BOUNDARY_REGEX =
  /(export\s)?(async\s)?(const|function)\sErrorBoundary/
const ROUTE_HANDLE_REGEX = /(export\s)?(const|var|let)\shandle\s/

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
  return path.resolve(getOptions().root, filePath)
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

export function hasAction(code: string) {
  return ROUTE_ACTION_REGEX.test(code)
}

export function hasErrorElement(code: string) {
  return ROUTE_ERROR_ELEMENT_REGEX.test(code)
}

export function hasErrorBoundary(code: string) {
  return ROUTE_ERROR_BOUNDARY_REGEX.test(code)
}

export function hasHandle(code: string) {
  return ROUTE_HANDLE_REGEX.test(code)
}
