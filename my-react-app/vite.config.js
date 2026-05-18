import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/auth': 'http://localhost:8000',
      '/scan/upload': 'http://localhost:8000',
      '/scan/upload-asm': 'http://localhost:8000',
      '/scan/history': 'http://localhost:8000',
      '/scan/report': 'http://localhost:8000',
      '/admin/scans': 'http://localhost:8000',
      '/admin/scan': 'http://localhost:8000',
    },
  },
})
