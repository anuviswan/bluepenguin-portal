import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { storeToRefs } from 'pinia'

let isInitialized = false

export function useProductFilter() {
  const productsStore = useProductsStore()
  const route = useRoute()
  const { products, loading, error, totalCount, page, pageSize } = storeToRefs(productsStore)

  // Load more products
  const loadMore = async () => {
    const searchRequest = productsStore.buildSearchRequest()
    await productsStore.loadMoreProducts(searchRequest)
  }

  const hasMore = computed(() => products.value.length < totalCount.value)

  // Initialize function. Only actually hits the API if the store is completely empty, 
  // or if we have route query parameters that we need to force into the filters.
  // The watcher inside Pinia handles subsequent generic API reloading.
  onMounted(() => {
    if (isInitialized) return
    isInitialized = true

    const preselectedCat = route.query.category as string | undefined
    const preselectedColl = route.query.collection as string | undefined

    let injectedFilter = false

    if (preselectedCat && !productsStore.filters.categories.includes(preselectedCat)) {
      productsStore.filters.categories.push(preselectedCat)
      injectedFilter = true
    }

    if (preselectedColl && !productsStore.filters.collections.includes(preselectedColl)) {
      productsStore.filters.collections.push(preselectedColl)
      injectedFilter = true
    }

    // Only manually trigger the initial search if we didn't inject anything (which triggers the watcher)
    // AND we actually need to load products (i.e. first page load, not a component re-mount)
    if (!injectedFilter && products.value.length === 0 && page.value === 1) {
      productsStore.searchProducts(productsStore.buildSearchRequest())
    }
  })

  return {
    filters: productsStore.filters,
    filteredProducts: products,
    loading,
    error,
    totalCount,
    hasMore,
    toggleFilter: productsStore.toggleFilter,
    clearFilters: productsStore.clearFilters,
    loadMore,
  }
}

