import { LoaderFunction, NavLink, useLoaderData } from 'react-router-dom'
import { Post } from '@ngneat/falso'

export const loader: LoaderFunction = async ({ params }) => {
  return await fetch(`/api/posts/${params.slug}`).then((response) =>
    response.json(),
  )
}

export default function () {
  const { post } = useLoaderData() as { post: Post }

  return (
    <div>
      <NavLink to="/posts">back</NavLink>

      <h1 className="text-2xl mt-4">{post.title}</h1>

      <p className="mt-8">{post.body}</p>
    </div>
  )
}
