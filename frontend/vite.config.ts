import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const envDir = path.resolve(import.meta.dirname, '..')
  const env = loadEnv(mode, envDir, '')
  const port = env.FRONTEND_URL ? Number(new URL(env.FRONTEND_URL).port) || 5173 : 5173

  return {
    envDir,
    plugins: [react(), tailwindcss()],
    server: { port, strictPort: true },
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
  }
})
