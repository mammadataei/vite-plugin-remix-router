import { BrowserRouter } from 'react-router-dom'
import { Routes } from './routes'
import { Suspense } from 'react'

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </Suspense>
  )
}

export default App
