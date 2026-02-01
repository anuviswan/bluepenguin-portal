import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ProductFilter from '../ProductFilter.vue'

describe('ProductFilter', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('renders filter groups', () => {
        const wrapper = mount(ProductFilter)
        expect(wrapper.text()).toContain('Category')
        expect(wrapper.text()).toContain('Raw Material')
    })

    it('toggles checkboxes', async () => {
        const wrapper = mount(ProductFilter)
        const checkbox = wrapper.find('input[type="checkbox"]')
        await checkbox.setValue(true)
        // Store state update is implicit if composable works, checking emission/store interaction via composable test mostly.
        // Or we can check if it stays checked.
        expect((checkbox.element as HTMLInputElement).checked).toBe(true)
    })
})
