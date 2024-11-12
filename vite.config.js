import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

export default defineConfig({
  //change port for production
  test: {
     globals: true,
     environment: 'jsdom',
     setupFiles: ['src/__tests__/setup.js'],
   },

  preview: {
    port: 3001,
    },

  // for dev
  server: {
    port: 3000,
    },

  plugins: [react(), sentryVitePlugin({
    org: "future-software-agency",
    project: "javascript-react"
  })],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    sourcemap: true
  }
})