import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import {} from 'vite-ssg' // to avoid type errors with ssgOptions
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { blogPosts } from './src/data/posts'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  ssgOptions: {
    includedRoutes: (_, routes) => {
      const landingLayoutRoute = routes.find((r) => r.path === '/' && r.name === 'landing')

      const landingPagePaths =
        landingLayoutRoute?.children
          ?.map((child) => `/${child.path}`)
          .filter((path) => !path.includes(':')) ?? []

      const dynamicBlogPaths = blogPosts.map((post) => `/blog/${post.id}`)

      return [...new Set([...landingPagePaths, ...dynamicBlogPaths])]
    },
  },
  plugins: [vue(), vueJsx(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
