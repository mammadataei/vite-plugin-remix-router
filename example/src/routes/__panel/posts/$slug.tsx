import {
  LoaderFunction,
  NavLink,
  useLoaderData,
  useRouteError,
} from 'react-router-dom'
import { Post } from '@ngneat/falso'

export const loader: LoaderFunction = async ({ params }) => {
  const response = await fetch(`/api/posts/${params.slug}`)

  if (response.status === 404) {
    throw new Response('Post Not Found.', { status: 404 })
  }

  return await response.json()
}

export function Component() {
  const { post } = useLoaderData() as { post: Post }

  return (
    <div>
      <NavLink to="/posts">back</NavLink>

      <h1 className="text-2xl mt-4">{post.title}</h1>

      <p className="mt-8">{post.body}</p>
    </div>
  )
}

export function ErrorElement() {
  const error = useRouteError() as { data: string } | undefined
  return <div className="text-2xl text-red-600">{error?.data}</div>
}
