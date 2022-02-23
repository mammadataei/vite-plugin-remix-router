import { Outlet } from 'react-router-dom'

export default function () {
  return (
    <div>
      <Outlet />
    </div>
  )
}

export function getRouteConfig() {
  return {
    name: 'users',
    auth: true,
  }
}
