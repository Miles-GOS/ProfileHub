import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/pages/Login.vue'
import Profile from '@/pages/Profile.vue'
import Register from '@/pages/Register.vue'

// import other pages

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { public: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { public: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { public: true },
  },
  { path: '/:pathMatch(.*)*', redirect: '/login' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (!to.meta.public && !token) {
    return next('/login')
  }

  next()
})

export default router
