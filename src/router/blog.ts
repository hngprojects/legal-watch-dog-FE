import BlogView from '@/views/BlogView.vue'
import { createMemoryHistory, createRouter } from 'vue-router'

export const routes = [
  { path: '/blog', name: 'blog', component: BlogView },
  {
    path: '/blog/:id',
    name: 'blog-detail',
    component: () => import('@/views/BlogDetailView.vue'),
    props: true,
  },
]

export default createRouter({ history: createMemoryHistory(), routes })
