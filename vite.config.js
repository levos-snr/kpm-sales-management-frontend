import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

export default defineConfig({
    test: {
       globals: true,
       environment: 'jsdom',
       setupFiles: ['src/__tests__/setup.js'],
     },
    //change port for production
  preview: {
    port: 3001,
    },
// for dev
  server: {
    port: 3000,
    },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
