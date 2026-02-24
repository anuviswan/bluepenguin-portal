import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('../views/LandingView.vue'),
    },
    {
      path: '/shop',
      name: 'shop',
      component: () => import('../views/ShopView.vue'),
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
    {
      path: '/refund-policy',
      name: 'refund-policy',
      component: () => import('../views/RefundPolicyView.vue'),
    },
    {
      path: '/shipping-policy',
      name: 'shipping-policy',
      component: () => import('../views/ShippingPolicyView.vue'),
    },
  ],
})

export default router
