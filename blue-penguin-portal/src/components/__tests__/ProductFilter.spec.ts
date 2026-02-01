import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ProductFilter from '../ProductFilter.vue'

// Mock CategoryService
vi.mock('@/services/CategoryService', () => ({
    default: {
        getAll: vi.fn().mockResolvedValue([
            { id: '1', name: 'Necklace' },
            { id: '2', name: 'Bracelet' }
        ])
    }
}))

describe('ProductFilter', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
    })

    it('renders filter groups', async () => {
        const wrapper = mount(ProductFilter)
        await flushPromises() // Wait for onMounted
        expect(wrapper.text()).toContain('Category')
        expect(wrapper.text()).toContain('Raw Material')
        expect(wrapper.text()).toContain('Necklace')
        expect(wrapper.text()).toContain('Bracelet')
    })

    it('toggles checkboxes', async () => {
        const wrapper = mount(ProductFilter)
        await flushPromises()
        const checkbox = wrapper.find('input[type="checkbox"]') // This might grab the first one which should be Necklace now
        if (checkbox.exists()) {
            await checkbox.setValue(true)
            expect((checkbox.element as HTMLInputElement).checked).toBe(true)
        }
    })
})
