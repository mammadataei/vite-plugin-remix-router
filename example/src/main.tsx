import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import '@unocss/reset/tailwind.css'
import 'uno.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
