import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProductsStore } from '../products'

describe('Products Store', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('initializes with empty products', () => {
        const store = useProductsStore()
        expect(store.products).toHaveLength(0)
        expect(store.currentProduct).toBeNull()
    })
})
