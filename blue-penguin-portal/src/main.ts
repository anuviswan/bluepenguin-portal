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

const gaId = import.meta.env.VITE_GA_ID
if (import.meta.env.PROD && gaId) {
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  function gtag(...args: unknown[]) {
    //window.dataLayer.push(args)
    window.dataLayer.push(arguments)
  }
  gtag('js', new Date())
  gtag('config', gaId)
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
