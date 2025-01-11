import { createRouter, createWebHistory } from 'vue-router'
// import { useUserStore } from '@/stores/user.store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/schedule'
      // meta: { requiresAuth: true }
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/schedule',
      component: () => import('@/components/department/DepartmentCalendar.vue')
    },
    {
      path: '/profile',
      component: () => import('@/components/department/DepartmentProfile.vue')
    },
  ],
})

// router.beforeEach(async (to) => {
//   const store = useUserStore()
//   if (to.meta.requiresAuth && !store.currentUser) {
//     return { name: 'login' }
//   }
// })

export default router
