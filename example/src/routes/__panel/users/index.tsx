import { NavLink } from 'react-router-dom'

const users = [
  {
    id: 1,
    name: 'John',
  },
  {
    id: 2,
    name: 'Jane',
  },
]

export function Component() {
  return (
    <div className=" w-full h-full">
      <h1 className="text-2xl">Users</h1>

      <div className="flex flex-col gap-y-2 pt-8">
        {users.map(({ id, name }) => (
          <NavLink
            key={id}
            to={name.toLowerCase()}
            className="py-3 px-4 border rounded-sm hover:bg-gray-50"
          >
            {name}
          </NavLink>
        ))}
      </div>
    </div>
  )
}
