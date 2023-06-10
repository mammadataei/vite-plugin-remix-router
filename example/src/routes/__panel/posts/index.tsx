import {
  LoaderFunction,
  NavLink,
  useLoaderData,
  useRouteError,
} from 'react-router-dom'
import { Post } from '@ngneat/falso'
import { slugify } from '../../../utils'

export const loader: LoaderFunction = async () => {
  const response = await fetch('/api/posts')

  if (response.status === 400) {
    throw new Response('Oops! Something went wrong.', { status: 400 })
  }

  return await response.json()
}

export function Component() {
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

export function ErrorBoundary() {
  const error = useRouteError() as { data: string } | undefined
  return <div className="text-2xl text-red-600">{error?.data}</div>
}
