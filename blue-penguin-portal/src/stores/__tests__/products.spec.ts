import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProductsStore } from '../products'

describe('Products Store', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('initializes with mock data', () => {
        const store = useProductsStore()
        expect(store.products.length).toBeGreaterThan(0)
        expect(store.products[0]).toHaveProperty('title')
    })
})
