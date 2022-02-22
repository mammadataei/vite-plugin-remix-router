import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import reactFSR from 'vite-plugin-react-fsr'
import Unocss from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), reactFSR(), Unocss()],
})
