import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import RemixRouter from 'vite-plugin-remix-router'
import Unocss from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), RemixRouter(), Unocss()],
})
