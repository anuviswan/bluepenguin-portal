import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ProductFilter from '../ProductFilter.vue'
import { useMetadataStore } from '@/stores/metadata'

// Mock services are implicitly useful if store uses them, but if we assume logic is moved to store,
// we might want to mock the store actions or just rely on service mocks if store calls them.
// Let's rely on service mocks and the real store logic to verify integration, 
// OR mock the store state directly.
// Given we want to test ProductFilter, we should probably mock the store state or spy on fetchAll.
// But using real store with mocked services verifies the chain.

// Mock Services
vi.mock('@/services/CategoryService', () => ({
    default: {
        getAll: vi.fn().mockResolvedValue([{ id: '1', name: 'Necklace' }])
    }
}))
vi.mock('@/services/MaterialService', () => ({
    default: {
        getAll: vi.fn().mockResolvedValue([{ id: '1', name: 'Bead-Based' }])
    }
}))
vi.mock('@/services/CollectionService', () => ({
    default: {
        getAll: vi.fn().mockResolvedValue([{ id: '1', name: 'Ocean Dreams' }])
    }
}))
vi.mock('@/services/FeatureService', () => ({
    default: {
        getAll: vi.fn().mockResolvedValue([{ id: '1', name: 'Handmade' }])
    }
}))

describe('ProductFilter', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
    })

    it('renders filter groups', async () => {
        const wrapper = mount(ProductFilter)
        // Store call happens on mount
        await flushPromises()

        expect(wrapper.text()).toContain('Category')
        expect(wrapper.text()).toContain('Raw Material')
        expect(wrapper.text()).toContain('Necklace')
        expect(wrapper.text()).toContain('Bead-Based')
        expect(wrapper.text()).toContain('Ocean Dreams')
        expect(wrapper.text()).toContain('Handmade')
    })

    it('limits filter options to 5 and toggles more/less', async () => {
        const CategoryService = (await import('@/services/CategoryService')).default
        vi.mocked(CategoryService.getAll).mockResolvedValue(Array.from({ length: 8 }, (_, i) => ({
            id: `${i + 1}`,
            name: `Category ${i + 1}`,
            description: `Desc ${i + 1}`
        })))

        const wrapper = mount(ProductFilter)
        await flushPromises()

        // Initially should show only 5 checkboxes in Category group
        const categoryGroup = wrapper.findAll('.filter-group').find(g => g.find('h3').text() === 'Category')
        const checkboxes = categoryGroup?.findAllComponents({ name: 'BaseCheckbox' })
        expect(checkboxes?.length).toBe(5)

        // Find "more" button
        const moreBtn = categoryGroup?.find('.toggle-more')
        expect(moreBtn?.exists()).toBe(true)
        expect(moreBtn?.text()).toContain('+ 3 more')

        // Click "more"
        await moreBtn?.trigger('click')

        // Should show all 8 checkboxes
        const updatedCheckboxes = categoryGroup?.findAllComponents({ name: 'BaseCheckbox' })
        expect(updatedCheckboxes?.length).toBe(8)
        expect(moreBtn?.text()).toBe('Show Less')

        // Click "less"
        await moreBtn?.trigger('click')
        expect(categoryGroup?.findAllComponents({ name: 'BaseCheckbox' }).length).toBe(5)
    })
})
