import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'

export default function MainLayout() {
  return (
    <div className="container mx-auto max-w-screen-lg text-gray-800 min-h-screen">
      <Sidebar />

      <main className="p-8">
        <Outlet />
      </main>
    </div>
  )
}
