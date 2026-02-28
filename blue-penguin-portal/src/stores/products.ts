import { defineStore } from 'pinia'
import { ref, reactive, watch } from 'vue'
import { ProductService } from '@/services/ProductService'
import api from '@/services/api'
import type { Product } from '@/types/Product'
import type { SearchProductsRequest } from '@/types/SearchProductsRequest'

export type { Product }

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const currentProduct = ref<Product | null>(null)
  const currentProductImages = ref<string[]>([])
  const artisanFavSkuList = ref<string[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const totalCount = ref(0)
  const page = ref(1)
  const pageSize = ref(12)

  // Filter state
  const filters = reactive({
    categories: [] as string[],
    materials: [] as string[],
    features: [] as string[],
    collections: [] as string[],
  })

  // Normalize product data to ensure type safety
  function normalizeProduct(product: any): Product {
    return {
      productName: product.productName || 'Unknown Product',
      sku: product.sku || '',
      price: typeof product.price === 'number' ? product.price : 0,
      stock: typeof product.stock === 'number' ? product.stock : 0,
      categoryCode: product.categoryCode || '',
      material: product.material || '',
      collectionCode: product.collectionCode || '',
      featureCodes: Array.isArray(product.featureCodes)
        ? product.featureCodes
        : typeof product.featureCodes === 'string'
          ? product.featureCodes
            .split(',')
            .map((c: string) => c.trim())
            .filter(Boolean)
          : [],
      yearCode: typeof product.yearCode === 'number' ? product.yearCode : new Date().getFullYear(),
      sequenceCode: product.sequenceCode,
      description: product.description,
      discountPrice: typeof product.discountPrice === 'number' ? product.discountPrice : undefined,
      discountExpiryDate: product.discountExpiryDate,
      specifications: Array.isArray(product.specifications) ? product.specifications : undefined,
      productCareInstructions: Array.isArray(product.productCareInstructions) ? product.productCareInstructions : undefined,
      primaryImageUrl: product.primaryImageUrl,
      isArtisanFav: typeof product.isArtisanFav === 'boolean' ? product.isArtisanFav : false,
      images: Array.isArray(product.images) ? product.images : [],
    }
  }

  async function searchProducts(filters: SearchProductsRequest, append: boolean = false) {
    loading.value = true
    error.value = null

    try {
      // Ensure pagination params are set correctly for the API (page instead of pageNumber)
      // We use the provided filters (which no longer have page/pageSize) and our internal state.
      const params = {
        page: append ? page.value + 1 : 1, // Default to 1 if not appending
        pageSize: pageSize.value,
      }

      const result = await ProductService.searchProducts(filters, params)

      // Normalize all products to ensure type safety
      const normalizedProducts = result.items.map(normalizeProduct)

      if (append) {
        products.value = [...products.value, ...normalizedProducts]
      } else {
        products.value = normalizedProducts
      }

      totalCount.value = result.totalCount
      page.value = result.page
      pageSize.value = result.pageSize
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch products'
      if (!append) products.value = []
    } finally {
      loading.value = false
    }
  }

  async function loadMoreProducts(filters: SearchProductsRequest) {
    if (loading.value || products.value.length >= totalCount.value) return

    await searchProducts(filters, true)
  }

  async function fetchProductBySku(skuId: string) {
    loading.value = true
    error.value = null
    currentProduct.value = null
    currentProductImages.value = []

    try {
      const product = await ProductService.getProductBySku(skuId)

      // Normalize the product data
      const normalizedProduct = normalizeProduct(product)

      // Handle description migration
      if (!normalizedProduct.description) {
        normalizedProduct.description = `A delicate and elegant ${normalizedProduct.productName.toLowerCase()} featuring a premium design. Perfect for adding a touch of serene beauty to any outfit.`
      }

      // Immediately set the product so the UI can render
      currentProduct.value = normalizedProduct

      // Use inline images, or fallback
      let imageUrls: string[] = []

      if (normalizedProduct.images && normalizedProduct.images.length > 0) {
        // Sort so primary image is first if there is an indicator, else just map them
        const sortedImages = [...normalizedProduct.images].sort((a, b) => {
          if (a.isPrimary) return -1
          if (b.isPrimary) return 1
          return 0
        })
        imageUrls = sortedImages.map(img => img.imageUrl).filter(Boolean)
      } else if (normalizedProduct.primaryImageUrl) {
        imageUrls = [normalizedProduct.primaryImageUrl]
      }

      if (imageUrls.length > 0) {
        currentProductImages.value = imageUrls
      } else {
        try {
          const fallbackImage = (await import('@/assets/images/no-images-found.jpg')).default
          currentProductImages.value = [fallbackImage]
        } catch (e) {
          console.error('Failed to load fallback image:', e)
        }
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch product details'
    } finally {
      loading.value = false
    }
  }

  async function fetchArtisanFavs() {
    if (artisanFavSkuList.value.length > 0) return // Already cached
    try {
      const response = await api.get<string[]>('/api/ArtisanFav/getall')
      artisanFavSkuList.value = response.data
    } catch (err) {
      console.error('[ProductsStore] Failed to fetch artisan favs:', err)
    }
  }

  function buildSearchRequest(): SearchProductsRequest {
    return {
      selectedCategories: filters.categories,
      selectedMaterials: filters.materials,
      selectedCollections: filters.collections,
      selectedFeatures: filters.features,
    }
  }

  function toggleFilter(group: 'categories' | 'materials' | 'features' | 'collections', value: string) {
    const index = filters[group].indexOf(value)
    if (index === -1) {
      filters[group].push(value)
    } else {
      filters[group].splice(index, 1)
    }
  }

  function clearFilters() {
    filters.categories = []
    filters.materials = []
    filters.features = []
    filters.collections = []
  }

  // Live debounced search when filters change
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  function performSearch() {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    debounceTimer = setTimeout(async () => {
      const searchRequest = buildSearchRequest()
      await searchProducts(searchRequest)
    }, 300)
  }

  // Watch filters deeply, triggering a search only once per change
  watch(
    () => ({ ...filters }),
    () => {
      performSearch()
    },
    { deep: true }
  )

  return {
    products,
    currentProduct,
    currentProductImages,
    artisanFavSkuList,
    loading,
    error,
    totalCount,
    page,
    pageSize,
    filters,
    searchProducts,
    loadMoreProducts,
    fetchProductBySku,
    fetchArtisanFavs,
    toggleFilter,
    clearFilters,
    buildSearchRequest,
  }
})
