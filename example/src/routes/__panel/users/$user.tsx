import { NavLink, Outlet, useParams } from 'react-router-dom'
import { Breadcrumbs } from '../../../components/Breadcrumbs'

export default function () {
  const { user } = useParams()

  return (
    <div>
      <Breadcrumbs />

      <h1 className="text-2xl mt-8">User: {user}</h1>

      <div className="mt-8">
        <div className="flex border-b border-gray-200 text-gray-500">
          <NavLink
            to=""
            end
            className={({ isActive }) =>
              `py-2 px-3 ${isActive ? 'text-blue-500' : ''}`
            }
          >
            Overview
          </NavLink>
          <NavLink
            to="profile"
            className={({ isActive }) =>
              `py-2 px-3 ${isActive ? 'text-blue-500' : ''}`
            }
          >
            Profile
          </NavLink>
          <NavLink
            to="settings"
            className={({ isActive }) =>
              `py-2 px-3 ${isActive ? 'text-blue-500' : ''}`
            }
          >
            Settings
          </NavLink>
        </div>
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export const handle = {
  crumb: ({ user }: { user: string }) => (
    <span className="capitalize">{user}</span>
  ),
}
