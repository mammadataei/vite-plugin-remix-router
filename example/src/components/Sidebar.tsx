import { NavLink } from 'react-router-dom'
import { PropsWithChildren } from 'react'

function Link(props: PropsWithChildren<{ to: string }>) {
  return (
    <NavLink
      to={props.to}
      className={({ isActive }) =>
        `py-3 px-8 rounded hover:bg-indigo-50 hover:text-gray-700 border-gray-300 focus:border-1 ${
          isActive ? 'text-indigo-500' : ''
        }`
      }
    >
      {props.children}
    </NavLink>
  )
}

const links = [
  { to: '/posts', label: 'Posts' },
  { to: '/users', label: 'Users' },
]

export function Sidebar() {
  return (
    <nav className="relative w-full h-full flex flex-col text-gray-500 px-4 py-8 border-r">
      {links.map(({ to, label }) => (
        <Link key={to} to={to}>
          {label}
        </Link>
      ))}
    </nav>
  )
}
