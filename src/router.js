import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/Home.vue'
import Article from './components/Article.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/article/:id',
    name: 'Article',
    component: Article,
    props: true
  }
]

const base = import.meta.env.BASE_URL || '/';
const router = createRouter({
  history: createWebHistory(base),
  routes
})

export default router
