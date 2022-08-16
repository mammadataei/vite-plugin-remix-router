import {
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
  expect(isDynamicRoute('[...all]')).toBe(true)
  expect(isDynamicRoute('[id]')).toBe(true)
})

it('parameterizeDynamicRoute', () => {
  expect(parameterizeDynamicRoute('topic')).toBe('topic')
  expect(parameterizeDynamicRoute('[id]')).toBe(':id')
})

it('normalizeFilenameToRoute', () => {
  expect(normalizeFilenameToRoute('_layout')).toBe('_layout')
  expect(normalizeFilenameToRoute('topic')).toBe('topic')
  expect(normalizeFilenameToRoute('index')).toBe('index')
  expect(normalizeFilenameToRoute('[id]')).toBe(':id')
})
