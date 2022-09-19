import { PropsWithChildren } from 'react'

export function MainLayout({ children }: PropsWithChildren<unknown>) {
  return (
    <div className="container flex h-screen mx-auto max-w-screen-lg text-gray-800 min-h-screen">
      {children}
    </div>
  )
}
