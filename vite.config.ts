import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

const BACKEND_ORIGIN = process.env.VITE_BACKEND_URL ?? 'http://localhost:8000'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
  server: {
    proxy: {
      '/route': { target: BACKEND_ORIGIN, changeOrigin: true },
      '/dev': { target: BACKEND_ORIGIN, changeOrigin: true },
      '/ask': { target: BACKEND_ORIGIN, changeOrigin: true },
      '/health': { target: BACKEND_ORIGIN, changeOrigin: true },
    },
  },
})
