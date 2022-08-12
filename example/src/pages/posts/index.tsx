import { NavLink } from 'react-router-dom'

const posts = [
  {
    id: 1,
    title: 'Hello World',
  },
  {
    id: 2,
    title: 'New Post',
  },
]

function slugify(str: string) {
  return str.replace(/\s/, '_').toLowerCase()
}

export default function () {
  return (
    <div>
      <h1 className="text-2xl">Posts</h1>

      <div className="flex flex-col gap-y-2 pt-8">
        {posts.map(({ id, title }) => (
          <NavLink key={id} to={slugify(title)}>
            {title}
          </NavLink>
        ))}
      </div>
    </div>
  )
}
