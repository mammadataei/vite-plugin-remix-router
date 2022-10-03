import {
  createImportName,
  hasLoader,
  isCatchAllRoute,
  isDynamicRoute,
  normalizeFilenameToRoute,
  parameterizeDynamicRoute,
} from './utils'
import { expect } from 'vitest'

it('isCatchAllRoute', () => {
  expect(isCatchAllRoute('')).toBe(false)
  expect(isCatchAllRoute('all')).toBe(false)
  expect(isCatchAllRoute('$all')).toBe(false)
  expect(isCatchAllRoute('$')).toBe(true)
})

it('isDynamicRoute', () => {
  expect(isDynamicRoute('')).toBe(false)
  expect(isDynamicRoute('topic')).toBe(false)
  expect(isDynamicRoute('$')).toBe(true)
  expect(isDynamicRoute('$id')).toBe(true)
})

it('parameterizeDynamicRoute', () => {
  expect(parameterizeDynamicRoute('topic')).toBe('topic')
  expect(parameterizeDynamicRoute('$id')).toBe(':id')
})

it('normalizeFilenameToRoute', () => {
  expect(normalizeFilenameToRoute('_layout')).toBe('_layout')
  expect(normalizeFilenameToRoute('topic')).toBe('topic')
  expect(normalizeFilenameToRoute('index')).toBe('index')
  expect(normalizeFilenameToRoute('$id')).toBe(':id')
})

it('createImportName', () => {
  expect(createImportName('example/src/routes/$.tsx', 'LOADER')).toEqual(
    'example_src_routes_$_LOADER',
  )
  expect(createImportName('example/src/routes/about.tsx', 'ACTION')).toEqual(
    'example_src_routes_about_ACTION',
  )
  expect(
    createImportName('example/src/routes/__auth/login.tsx', 'LOADER'),
  ).toEqual('example_src_routes___auth_login_LOADER')
  expect(
    createImportName('example/src/routes/__panel/posts/$slug.tsx', 'ACTION'),
  ).toEqual('example_src_routes___panel_posts_$slug_ACTION')
})

it('hasLoader', () => {
  expect(hasLoader(`export const loader = () => {}`)).toEqual(true)
  expect(hasLoader(`export const loader:LoaderFunction = () => {}`)).toEqual(
    true,
  )
  expect(hasLoader(`const loader = () => {}`)).toEqual(true)
  expect(hasLoader(`export function loader () {}`)).toEqual(true)
  expect(hasLoader(`export async function loader() {}`)).toEqual(true)
  expect(hasLoader(`async function loader () {}`)).toEqual(true)
  expect(hasLoader(`async function loader () {}`)).toEqual(true)
})
