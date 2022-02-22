import { useRoutes } from 'react-router-dom'
import { routes } from 'virtual:routes'

export function Routes() {
  return useRoutes(routes)
}
