import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  }
]

const base = import.meta.env.BASE_URL || '/';
const router = createRouter({
  history: createWebHistory(base),
  routes
})

export default router
