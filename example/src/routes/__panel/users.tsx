import { Link, Outlet } from 'react-router-dom'

export function Component() {
  return <Outlet />
}

export const handle = {
  crumb: () => (
    <Link to="/users" className="text-blue-500">
      Users
    </Link>
  ),
}
