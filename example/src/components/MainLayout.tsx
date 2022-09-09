import { PropsWithChildren } from 'react'
import { Sidebar } from './Sidebar'

export function MainLayout({ children }: PropsWithChildren<unknown>) {
  return (
    <div className="container mx-auto max-w-screen-lg text-gray-800 min-h-screen">
      <Sidebar />

      <main className="p-8">{children}</main>
    </div>
  )
}
