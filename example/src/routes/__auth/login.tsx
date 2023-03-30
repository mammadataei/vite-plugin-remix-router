import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function Component() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const redirect = useNavigate()

  function login(event: FormEvent) {
    event.preventDefault()

    if (username === 'admin' && password === 'secret') {
      return redirect('/posts')
    }

    alert('Try `admin:secret`')
  }

  return (
    <div className="w-full h-full flex justify-center items-center ">
      <div className="flex-col items-center justify-center p-8 bg-white shadow-lg border border-gray-100">
        <h1 className="text-2xl">Login</h1>

        <form
          className="flex flex-col justify-center items-center gap-y-4 mt-8"
          onSubmit={login}
        >
          <input
            type="text"
            placeholder="Username"
            className="py-3 px-4 border border-gray-200 rounded-sm"
            value={username}
            onChange={({ target: { value } }) => setUsername(value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="py-3 px-4 border border-gray-200 rounded-sm"
            value={password}
            onChange={({ target: { value } }) => setPassword(value)}
          />

          <button
            type="submit"
            className="w-full py-3 bg-indigo-500 text-white rounded-sm disabled:bg-gray-300"
            disabled={!password || !username}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
