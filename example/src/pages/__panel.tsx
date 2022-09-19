import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'

export default function PanelLayout() {
  return (
    <div className="w-full h-full flex">
      <div className="w-1/5">
        <Sidebar />
      </div>

      <main className="flex-grow h-full p-8">
        <Outlet />
      </main>
    </div>
  )
}
