import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ProductDetailsView from '../ProductDetailsView.vue'
import { useProductsStore } from '@/stores/products'
import { useMetadataStore } from '@/stores/metadata'
import { createRouter, createWebHistory } from 'vue-router'

// Mock components that might cause issues in isolation
vi.mock('@/components/TheHeader.vue', () => ({ default: { template: '<div>Header</div>' } }))
vi.mock('@/components/TheFooter.vue', () => ({ default: { template: '<div>Footer</div>' } }))
vi.mock('@/components/ProductCard.vue', () => ({ default: { template: '<div>ProductCard</div>' } }))

// Mock Services
vi.mock('@/services/ProductService', () => ({
    ProductService: {
        getProductBySku: vi.fn().mockResolvedValue({
            sku: 'SKU123',
            productName: 'Blue Pearl Necklace',
            price: 45,
            featureCodes: 'HM,HP,AD',
            description: 'Mock Description',
            bulletPoints: ['Point 1', 'Point 2']
        })
    }
}))

vi.mock('@/services/api', () => ({
    getPrimaryImageIdForSkuId: vi.fn().mockResolvedValue('img1'),
    downloadByImageId: vi.fn().mockResolvedValue('blob:url'),
    getAllImagesForSkuId: vi.fn().mockResolvedValue(['img1', 'img2'])
}))

const router = createRouter({
    history: createWebHistory(),
    routes: [{ path: '/product/:sku', name: 'product-details', component: { template: '<div></div>' } }]
})

describe('ProductDetailsView', () => {
    let productsStore: any
    let metadataStore: any

    beforeEach(() => {
        setActivePinia(createPinia())
        productsStore = useProductsStore()
        metadataStore = useMetadataStore()
        vi.clearAllMocks()
    })

    it('renders product details, feature tags, material, and collection correctly', async () => {
        // Pre-set store state
        productsStore.currentProduct = {
            sku: 'SKU123',
            productName: 'Blue Pearl Necklace',
            price: 45,
            featureCodes: ['HM', 'HP', 'AD'],
            material: 'SLV',
            collectionCode: 'NAT',
            description: 'Mock Description',
            stock: 10,
            partitionKey: 'Necklace',
            rowKey: 'SKU123',
            timestamp: new Date().toISOString(),
            eTag: '*',
            categoryCode: 'Necklace',
            yearCode: 2024
        }
        productsStore.loading = false

        // Mock metadata store
        metadataStore.features = [
            { id: 'HM', name: 'Handmade' },
            { id: 'HP', name: 'Hypoallergenic' },
            { id: 'AD', name: 'Adjustable' }
        ]
        metadataStore.materials = [
            { id: 'SLV', name: 'Silver' }
        ]
        metadataStore.collections = [
            { id: 'NAT', name: 'Nature' }
        ]

        const wrapper = mount(ProductDetailsView, {
            global: {
                plugins: [router],
                stubs: {
                    'TheHeader': true,
                    'TheFooter': true,
                    'ProductCard': true
                }
            }
        })

        await flushPromises()

        expect(wrapper.text()).toContain('Blue Pearl Necklace')
        expect(wrapper.text()).toContain('₹45')
        expect(wrapper.text()).toContain('Handmade')
        expect(wrapper.text()).toContain('Material: Silver')
        expect(wrapper.text()).toContain('Collection: Nature')
        expect(wrapper.text()).toContain('Mock Description')

        // Verify tags are rendered
        const tags = wrapper.findAll('.tag')
        expect(tags.length).toBe(5) // 3 features + 1 material + 1 collection
        expect(tags[0]!.text()).toBe('Material: Silver')
    })

    it('handles quantity changes', async () => {
        productsStore.currentProduct = {
            sku: 'SKU123',
            productName: 'Blue Pearl Necklace',
            price: 45,
            featureCodes: ['HM', 'HP', 'AD'],
            stock: 10,
            categoryCode: 'Necklace',
            material: 'Silver',
            collectionCode: 'NAT',
            yearCode: 2024
        }
        productsStore.loading = false

        const wrapper = mount(ProductDetailsView, {
            global: {
                plugins: [router],
                stubs: {
                    'TheHeader': true,
                    'TheFooter': true,
                    'ProductCard': true
                }
            }
        })
        await flushPromises()

        const incBtn = wrapper.find('.qty-btn:last-child')
        await incBtn.trigger('click')
        expect(wrapper.find('.qty-value').text()!).toBe('2')

        const decBtn = wrapper.find('.qty-btn:first-child')
        await decBtn.trigger('click')
        expect(wrapper.find('.qty-value').text()).toBe('1')
    })
})
