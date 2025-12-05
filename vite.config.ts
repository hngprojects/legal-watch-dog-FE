import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import {} from 'vite-ssg' // to avoid type errors with ssgOptions
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  ssgOptions: {
    includedRoutes: (paths) => {
      return paths.filter((path) => path.startsWith('/blog'))
    },
  },
  plugins: [vue(), vueJsx(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
