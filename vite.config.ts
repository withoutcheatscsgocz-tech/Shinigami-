import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative base so the built assets load correctly when packaged inside a
  // Capacitor Android WebView (served from the app filesystem, not a domain root).
  base: './',
  server: {
    host: true,
    port: 5173,
  },
})
