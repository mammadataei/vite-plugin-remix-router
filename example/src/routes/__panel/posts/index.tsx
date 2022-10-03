import { LoaderFunction, NavLink, useLoaderData } from 'react-router-dom'
import { Post } from '@ngneat/falso'
import { slugify } from '../../../utils'

export const loader: LoaderFunction = async () => {
  return fetch('/api/posts').then((response) => response.json())
}

export default function () {
  const { posts } = useLoaderData() as { posts: Post[] }

  return (
    <div className="w-full h-full">
      <h1 className="text-2xl">Posts</h1>

      <div className="flex flex-col gap-y-2 pt-8">
        {posts.map(({ id, title }) => (
          <NavLink
            key={id}
            to={slugify(title)}
            className="py-3 px-4 border rounded-sm hover:bg-gray-50"
          >
            {title}
          </NavLink>
        ))}
      </div>
    </div>
  )
}
