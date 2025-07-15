import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/pages/Login.vue'
import Profile from '@/pages/Profile.vue'
import Register from '@/pages/Register.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { public: true, hideHeader: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { public: true, hideHeader: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { public: false },
  },
  {
    path: '/home',
    name: 'Home',
    component: Profile,
    meta: { public: false },
  },

  { path: '/:pathMatch(.*)*', redirect: '/login' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const isLoggedIn = !!token

  if (!to.meta.public && !isLoggedIn) {
    return next('/login')
  }

  if (isLoggedIn && (to.path === '/login' || to.path === '/register')) {
    return next('/profile')
  }

  next()
})

export default router
