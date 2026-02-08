import { computed, reactive, watch, onMounted } from 'vue';
import { useProductsStore, type Product } from '@/stores/products';
import { storeToRefs } from 'pinia';
import type { SearchProductsRequest } from '@/types/SearchProductsRequest';

export function useProductFilter() {
    const productsStore = useProductsStore();
    const {
        products,
        loading,
        error,
        totalCount,
        pageNumber,
        pageSize
    } = storeToRefs(productsStore);

    const filters = reactive({
        categories: [] as string[],
        materials: [] as string[],
        features: [] as string[],
        collections: [] as string[]
    });

    // Debounce timer
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    // Convert filters to API request format
    const buildSearchRequest = (): SearchProductsRequest => {
        return {
            selectedCategories: filters.categories,
            selectedMaterials: filters.materials,
            selectedCollections: filters.collections,
            selectedFeatures: filters.features,
            pageNumber: 1, // Reset to page 1 on filter change
            pageSize: pageSize.value
        };
    };

    // Trigger API search when filters change
    const performSearch = () => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        debounceTimer = setTimeout(async () => {
            const searchRequest = buildSearchRequest();
            await productsStore.searchProducts(searchRequest);
        }, 300);
    };

    // Watch for filter changes
    watch(
        () => ({ ...filters }),
        () => {
            performSearch();
        },
        { deep: true }
    );

    // Load more products
    const loadMore = async () => {
        const searchRequest = buildSearchRequest();
        searchRequest.pageNumber = pageNumber.value; // Store already knows current page
        await productsStore.loadMoreProducts(searchRequest);
    };

    const hasMore = computed(() => products.value.length < totalCount.value);

    // Load initial products on mount
    onMounted(async () => {
        await productsStore.searchProducts({
            selectedCategories: [],
            selectedMaterials: [],
            selectedCollections: [],
            selectedFeatures: [],
            pageNumber: 1,
            pageSize: pageSize.value
        });
    });

    const toggleFilter = (group: 'categories' | 'materials' | 'features' | 'collections', value: string) => {
        const index = filters[group].indexOf(value);
        if (index === -1) {
            filters[group].push(value);
        } else {
            filters[group].splice(index, 1);
        }
    };

    const clearFilters = () => {
        filters.categories = [];
        filters.materials = [];
        filters.features = [];
        filters.collections = [];
    };

    return {
        filters,
        filteredProducts: products,
        loading,
        error,
        totalCount,
        hasMore,
        toggleFilter,
        clearFilters,
        loadMore
    };
}
