import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      '@lib': path.resolve(import.meta.dirname, './src/lib'),
      '@features': path.resolve(import.meta.dirname, './src/features'),
      '@components': path.resolve(import.meta.dirname, './src/components'),
      '@pages': path.resolve(import.meta.dirname, './src/pages'),
      '@providers': path.resolve(import.meta.dirname, './src/providers'),
      '@router': path.resolve(import.meta.dirname, './src/router'),
      '@constants': path.resolve(import.meta.dirname, './src/constants'),
      '@assets': path.resolve(import.meta.dirname, './src/assets'),
      '@icons': path.resolve(import.meta.dirname, './src/assets/icons'),
      '@images': path.resolve(import.meta.dirname, './src/assets/images'),
      '@store': path.resolve(import.meta.dirname, './src/store'),
    },
  },
})
