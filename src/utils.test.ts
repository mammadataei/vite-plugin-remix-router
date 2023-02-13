import {
  createImportName,
  hasAction,
  hasErrorBoundary,
  hasErrorElement,
  hasHandle,
  hasLoader,
  isCatchAllRoute,
  isDynamicRoute,
  normalizeFilenameToRoute,
  parameterizeDynamicRoute,
} from './utils'

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

it('hasAction', () => {
  expect(hasAction(`export const action = () => {}`)).toEqual(true)
  expect(hasAction(`export const action:ActionFunction = () => {}`)).toEqual(
    true,
  )
  expect(hasAction(`const action = () => {}`)).toEqual(true)
  expect(hasAction(`export function action () {}`)).toEqual(true)
  expect(hasAction(`export async function action() {}`)).toEqual(true)
  expect(hasAction(`async function action () {}`)).toEqual(true)
  expect(hasAction(`async function action () {}`)).toEqual(true)
})

it('hasErrorElement', () => {
  expect(hasErrorElement(`export const ErrorElement = () => {}`)).toEqual(true)
  expect(hasErrorElement(`const ErrorElement = () => {}`)).toEqual(true)
  expect(hasErrorElement(`export function ErrorElement () {}`)).toEqual(true)
})

it('hasErrorBoundary', () => {
  expect(hasErrorBoundary(`export const ErrorBoundary = () => {}`)).toEqual(
    true,
  )
  expect(hasErrorBoundary(`const ErrorBoundary = () => {}`)).toEqual(true)
  expect(hasErrorBoundary(`export function ErrorBoundary () {}`)).toEqual(true)
})

it('hasHandle', () => {
  expect(hasHandle(`export const handle = {}`)).toEqual(true)
  expect(hasHandle(`const handle = {}`)).toEqual(true)
  expect(hasHandle(`export let handle = {}`)).toEqual(true)
  expect(hasHandle(`let handle = {}`)).toEqual(true)
  expect(hasHandle(`export var handle = {}`)).toEqual(true)
  expect(hasHandle(`var handle = {}`)).toEqual(true)

  expect(hasHandle(`export const handleForm =`)).toEqual(false)
  expect(hasHandle(`const handleForm =`)).toEqual(false)
  expect(hasHandle(`export let handleForm =`)).toEqual(false)
  expect(hasHandle(`let handleForm =`)).toEqual(false)
  expect(hasHandle(`export var handleForm =`)).toEqual(false)
  expect(hasHandle(`var handleForm =`)).toEqual(false)
})
