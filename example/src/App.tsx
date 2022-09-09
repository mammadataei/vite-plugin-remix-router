import { BrowserRouter } from 'react-router-dom'
import { Routes } from './routes'
import { Suspense } from 'react'
import { MainLayout } from './components/MainLayout'

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrowserRouter>
        <MainLayout>
          <Routes />
        </MainLayout>
      </BrowserRouter>
    </Suspense>
  )
}

export default App
