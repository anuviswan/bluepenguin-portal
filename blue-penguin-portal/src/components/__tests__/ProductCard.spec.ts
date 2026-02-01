import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ProductCard from '../ProductCard.vue'

describe('ProductCard', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    const mockProduct = {
        id: 1,
        title: 'Test Necklace',
        price: 99,
        image: 'test.jpg',
        category: 'Necklace',
        material: 'Silver',
        features: ['Handmade']
    }

    it('renders product details', () => {
        const wrapper = mount(ProductCard, {
            props: {
                product: mockProduct
            }
        })
        expect(wrapper.text()).toContain('Test Necklace')
        expect(wrapper.text()).toContain('$99')
    })
})
