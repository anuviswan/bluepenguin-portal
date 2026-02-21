import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/product/:sku',
      name: 'product-details',
      component: () => import('../views/ProductDetailsView.vue'),
    },
    {
      path: '/our-story',
      name: 'our-story',
      component: () => import('../views/OurStoryView.vue'),
    },
  ],
})

export default router
