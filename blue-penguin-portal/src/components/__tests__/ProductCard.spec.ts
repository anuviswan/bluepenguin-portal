import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ProductCard from '../ProductCard.vue'

describe('ProductCard', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    const mockProduct = {
        productName: 'Test Necklace',
        sku: 'TEST-SKU',
        price: 99,
        stock: 10,
        partitionKey: 'Necklace',
        rowKey: 'TEST-SKU',
        timestamp: new Date().toISOString(),
        eTag: '*',
        material: 'Silver',
        collectionCode: 'NAT',
        featureCodes: ['Handmade'],
        categoryCode: 'Necklace',
        yearCode: 2024
    }

    it('renders product details', () => {
        const wrapper = mount(ProductCard, {
            props: {
                product: mockProduct
            }
        })
        expect(wrapper.text()).toContain('Test Necklace')
        expect(wrapper.text()).toContain('₹99')
    })
})
