import { watchEffect, onUnmounted } from 'vue'

export interface SEOOptions {
  title?: string
  description?: string
  keywords?: string
  robots?: string
  canonical?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogType?: string
  ogUrl?: string
  twitterCard?: 'summary' | 'summary_large_image' | string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  schema?: Record<string, unknown> | Record<string, unknown>[]
}

const DEFAULT_TITLE = 'Blue Penguin'
const DEFAULT_DESCRIPTION = 'Premium Handcrafted Bead Jewellery & Custom Accessories'

export function useSEO(seoGetter: () => SEOOptions) {
  const setMetaTag = (nameOrProperty: string, content?: string, isProperty = false) => {
    const selector = isProperty ? `meta[property="${nameOrProperty}"]` : `meta[name="${nameOrProperty}"]`
    if (content === undefined || content === null || content === '') {
      const el = document.querySelector(selector)
      if (el) el.remove()
      return
    }
    let el = document.querySelector(selector)
    if (!el) {
      el = document.createElement('meta')
      if (isProperty) {
        el.setAttribute('property', nameOrProperty)
      } else {
        el.setAttribute('name', nameOrProperty)
      }
      document.head.appendChild(el)
    }
    el.setAttribute('content', content)
  }

  const setCanonical = (url?: string) => {
    let el = document.querySelector('link[rel="canonical"]')
    if (!url) {
      if (el) el.remove()
      return
    }
    if (!el) {
      el = document.createElement('link')
      el.setAttribute('rel', 'canonical')
      document.head.appendChild(el)
    }
    el.setAttribute('href', url)
  }

  const setSchema = (schema?: Record<string, unknown> | Record<string, unknown>[]) => {
    let el = document.getElementById('seo-schema')
    if (!schema) {
      if (el) el.remove()
      return
    }
    if (!el) {
      el = document.createElement('script')
      el.id = 'seo-schema'
      el.setAttribute('type', 'application/ld+json')
      document.head.appendChild(el)
    }
    el.textContent = JSON.stringify(schema, null, 2)
  }

  watchEffect(() => {
    const options = seoGetter()

    // Title
    document.title = options.title || DEFAULT_TITLE

    // Standard Meta Tags
    setMetaTag('description', options.description || DEFAULT_DESCRIPTION)
    setMetaTag('keywords', options.keywords)
    setMetaTag('robots', options.robots || 'index, follow')

    // Canonical
    setCanonical(options.canonical)

    // Open Graph Tags
    setMetaTag('og:title', options.ogTitle || options.title || DEFAULT_TITLE, true)
    setMetaTag('og:description', options.ogDescription || options.description || DEFAULT_DESCRIPTION, true)
    setMetaTag('og:image', options.ogImage, true)
    setMetaTag('og:type', options.ogType || 'website', true)
    setMetaTag('og:url', options.ogUrl || options.canonical, true)

    // Twitter Card Tags
    setMetaTag('twitter:card', options.twitterCard || 'summary_large_image')
    setMetaTag('twitter:title', options.twitterTitle || options.ogTitle || options.title || DEFAULT_TITLE)
    setMetaTag('twitter:description', options.twitterDescription || options.ogDescription || options.description || DEFAULT_DESCRIPTION)
    setMetaTag('twitter:image', options.twitterImage || options.ogImage)

    // Structured Data
    setSchema(options.schema)
  })

  // Cleanup on unmount
  onUnmounted(() => {
    const schemaEl = document.getElementById('seo-schema')
    if (schemaEl) schemaEl.remove()
  })
}
