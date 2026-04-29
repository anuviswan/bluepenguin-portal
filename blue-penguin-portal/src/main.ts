import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './assets/base.css'

declare global {
  interface Window {
    dataLayer: unknown[]
  }
}

if (import.meta.env.PROD) {
  const script = document.createElement('script')
  script.async = true
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-3G2CEWVYGN'
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  function gtag(...args: unknown[]) {
    //window.dataLayer.push(args)
    window.dataLayer.push(arguments)
  }
  gtag('js', new Date())
  gtag('config', 'G-3G2CEWVYGN')
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
