import { NavLink, useParams } from 'react-router-dom'

export default function () {
  const { slug } = useParams()
  return (
    <div>
      <NavLink to="/posts">back</NavLink>

      <h1 className="text-2xl mt-4">Post: {slug}</h1>
    </div>
  )
}
