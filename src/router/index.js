import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Editor from '../views/Editor.vue'
import NewProject from '../views/NewProject.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/editor/:id?',
    name: 'editor',
    component: Editor
  },
  {
    path: '/new-project',
    name: 'newProject',
    component: NewProject
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router