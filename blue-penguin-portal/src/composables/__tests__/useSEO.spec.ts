import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { ref, defineComponent, h, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { useSEO } from '../useSEO'

describe('useSEO composable', () => {
  beforeEach(() => {
    // Reset head state before each test
    document.head.innerHTML = ''
    document.title = ''
  })

  afterEach(() => {
    // Reset head state after each test
    document.head.innerHTML = ''
    document.title = ''
  })

  it('updates title and meta tags with static options', async () => {
    const TestComponent = defineComponent({
      setup() {
        useSEO(() => ({
          title: 'Test Title',
          description: 'Test Description',
          keywords: 'test, seo',
          canonical: 'https://test.com',
          ogTitle: 'Test OG Title',
          schema: { '@context': 'https://schema.org', '@type': 'WebSite', 'name': 'Test' }
        }))
        return () => h('div')
      }
    })

    const wrapper = mount(TestComponent)
    await nextTick()

    // Assert Title
    expect(document.title).toBe('Test Title')

    // Assert description meta
    const descEl = document.querySelector('meta[name="description"]')
    expect(descEl).not.toBeNull()
    expect(descEl?.getAttribute('content')).toBe('Test Description')

    // Assert keywords meta
    const keywordsEl = document.querySelector('meta[name="keywords"]')
    expect(keywordsEl).not.toBeNull()
    expect(keywordsEl?.getAttribute('content')).toBe('test, seo')

    // Assert canonical link
    const canonicalEl = document.querySelector('link[rel="canonical"]')
    expect(canonicalEl).not.toBeNull()
    expect(canonicalEl?.getAttribute('href')).toBe('https://test.com')

    // Assert OG Title
    const ogTitleEl = document.querySelector('meta[property="og:title"]')
    expect(ogTitleEl).not.toBeNull()
    expect(ogTitleEl?.getAttribute('content')).toBe('Test OG Title')

    // Assert Schema JSON-LD
    const schemaEl = document.getElementById('seo-schema')
    expect(schemaEl).not.toBeNull()
    expect(schemaEl?.textContent).toContain('"name": "Test"')

    wrapper.unmount()
  })

  it('reactively updates meta tags when getter dependencies change', async () => {
    const dynamicTitle = ref('Initial Title')

    const TestComponent = defineComponent({
      setup() {
        useSEO(() => ({
          title: dynamicTitle.value
        }))
        return () => h('div')
      }
    })

    const wrapper = mount(TestComponent)
    await nextTick()

    expect(document.title).toBe('Initial Title')

    // Change title and wait for reactivity to flush
    dynamicTitle.value = 'Updated Title'
    await nextTick()

    expect(document.title).toBe('Updated Title')

    wrapper.unmount()
  })

  it('cleans up schema script tag on component unmount', async () => {
    const TestComponent = defineComponent({
      setup() {
        useSEO(() => ({
          title: 'Unmount Title',
          schema: { '@context': 'https://schema.org', '@type': 'WebSite', 'name': 'Cleanup' }
        }))
        return () => h('div')
      }
    })

    const wrapper = mount(TestComponent)
    await nextTick()

    // Schema tag should exist
    expect(document.getElementById('seo-schema')).not.toBeNull()

    // Unmount component
    wrapper.unmount()
    await nextTick()

    // Schema tag should be removed from DOM
    expect(document.getElementById('seo-schema')).toBeNull()
  })
})
