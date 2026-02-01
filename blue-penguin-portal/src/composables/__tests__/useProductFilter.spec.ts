import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProductFilter } from '../useProductFilter'
import { useProductsStore } from '../../stores/products'

describe('useProductFilter', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('filters by category', () => {
        const { filters, filteredProducts, toggleFilter } = useProductFilter()
        toggleFilter('categories', 'Necklace')
        expect(filters.categories).toContain('Necklace')

        // Check if all filtered products are Necklaces
        const allNecklaces = filteredProducts.value.every(p => p.category === 'Necklace')
        expect(allNecklaces).toBe(true)
    })

    it('filters by multiple criteria', () => {
        const { filters, filteredProducts, toggleFilter } = useProductFilter()
        toggleFilter('categories', 'Necklace')
        toggleFilter('materials', 'Bead-Based')

        const correctFilter = filteredProducts.value.every(p =>
            p.category === 'Necklace' && p.material === 'Bead-Based'
        )
        expect(correctFilter).toBe(true)
    })

    it('clears filters', () => {
        const { filters, clearFilters, toggleFilter } = useProductFilter()
        toggleFilter('categories', 'Necklace')
        clearFilters()
        expect(filters.categories).toHaveLength(0)
    })
})
