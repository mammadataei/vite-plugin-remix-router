import { NavLink } from 'react-router-dom'
import { PropsWithChildren } from 'react'

function Link(props: PropsWithChildren<{ to: string }>) {
  return (
    <NavLink
      to={props.to}
      className={({ isActive }) =>
        `py-3 px-4 rounded hover:bg-gray-50 hover:text-gray-700 border-gray-300 focus:border-1 ${
          isActive ? 'text-blue-500' : ''
        }`
      }
    >
      {props.children}
    </NavLink>
  )
}

const links = [
  { to: '/', label: 'Home' },
  { to: '/posts', label: 'Posts' },
  { to: '/users', label: 'Users' },
  { to: '/about', label: 'About' },
  { to: '/not-found', label: '404' },
]

export function Sidebar() {
  return (
    <nav className="flex justify-center text-gray-500 py-4 border-b border-gray-200">
      {links.map(({ to, label }) => (
        <Link key={to} to={to}>
          {label}
        </Link>
      ))}
    </nav>
  )
}
