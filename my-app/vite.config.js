import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/firstfullpublish/', // Updated to match your repository name
  server: {
    port: 5173
  }
})
