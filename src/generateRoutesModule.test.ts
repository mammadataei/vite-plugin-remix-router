import { generateRoutesModule } from './generateRoutesModule'
import { buildRouteTree } from './buildRouteTree'
import { setOptions } from './options'

setOptions({
  root: process.cwd(),
  extensions: ['tsx', 'jsx'],
  routesDirectory: 'example/src/routes',
})

it('should generate the routes module', () => {
  const routeTree = buildRouteTree()
  const routesModule = generateRoutesModule(routeTree)

  expect(routesModule).toMatchSnapshot()
})
