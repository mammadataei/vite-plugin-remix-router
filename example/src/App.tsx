import { router } from './router'
import { Suspense } from 'react'
import { MainLayout } from './components/MainLayout'
import { RouterProvider } from 'react-router-dom'

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MainLayout>
        <RouterProvider router={router} />
      </MainLayout>
    </Suspense>
  )
}

export default App
