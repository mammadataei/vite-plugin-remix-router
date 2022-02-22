import { NavLink } from 'react-router-dom'

export default function () {
  return (
    <div>
      <h1 className="text-2xl">Users</h1>

      <div className="flex flex-col gap-y-2 pt-8">
        <NavLink to="john">John</NavLink>
        <NavLink to="jane">Jane</NavLink>
      </div>
    </div>
  )
}
