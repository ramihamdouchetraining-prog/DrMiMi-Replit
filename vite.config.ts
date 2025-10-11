import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: ['.replit.dev', '.replit.app', '.repl.co', 'localhost'],
    hmr: {
      clientPort: 443,
      protocol: 'wss',
      host: process.env.REPLIT_DEV_DOMAIN?.split(':')[0] || 'localhost'
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src',
      '@assets': '/attached_assets'
    }
  }
})