import { ActionFunction, Form, useActionData } from 'react-router-dom'

export const action: ActionFunction = async ({ request }) => {
  const data = Object.fromEntries(await request.formData())

  return await fetch('/api/posts', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((response) => response.json())
}

export function Component() {
  const data = useActionData() as { message: string }

  return (
    <Form
      method="post"
      className="mx-32 flex flex-col justify-center gap-y-4 mt-8"
    >
      <label htmlFor="title">Title</label>
      <input
        id="title"
        name="title"
        type="text"
        className="py-3 px-4 border border-gray-200 rounded-sm"
      />

      <label htmlFor="body">Body</label>
      <textarea
        id="body"
        name="body"
        rows={10}
        className="py-3 px-4 border border-gray-200 rounded-sm"
      ></textarea>

      <button
        type="submit"
        className="w-full py-3 bg-indigo-500 text-white rounded-sm disabled:bg-gray-300"
      >
        Create new post
      </button>

      {data && <p>{data?.message}</p>}
    </Form>
  )
}
