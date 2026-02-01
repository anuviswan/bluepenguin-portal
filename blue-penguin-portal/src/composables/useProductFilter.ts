import { computed, reactive } from 'vue';
import { useProductsStore, type Product } from '@/stores/products';
import { storeToRefs } from 'pinia';

export function useProductFilter() {
    const productsStore = useProductsStore();
    const { products } = storeToRefs(productsStore);

    const filters = reactive({
        categories: [] as string[],
        materials: [] as string[],
        features: [] as string[],
        collections: [] as string[]
    });

    const filteredProducts = computed(() => {
        return products.value.filter((product: Product) => {
            const matchesCategory = filters.categories.length === 0 || filters.categories.includes(product.category);
            const matchesMaterial = filters.materials.length === 0 || filters.materials.includes(product.material);
            const matchesFeature = filters.features.length === 0 || filters.features.every(f => product.features.includes(f));
            // OR logic for features usually, but strict filtering might imply AND? 
            // In e-commerce, usually multiple checkboxes in same group is OR (e.g. Red OR Blue), 
            // but across groups is AND (Red AND Shirt).
            // For features like "Handmade", "Hypoallergenic", usually it's AND if checking for specific constraints, but user might want to see items that are Handmade OR Hypoallergenic?
            // Let's stick to simple "includes" check. If multiple features selected, usually it means "Show items that have ANY of these" or "ALL of these".
            // Let's assume OR within group for simple checkboxes list, similar to categories.
            // Wait, looking at the UI, "Handmade", "Hypoallergenic". If I check both, I probably want items that are EITHER. 
            // But for "Raw Material", Bead-Based OR Resin-Based.
            // Let's implement OR logic within each filter group.

            const productFeatures = product.features || [];
            const matchesFeatures = filters.features.length === 0 || filters.features.some(f => productFeatures.includes(f));


            const matchesCollection = filters.collections.length === 0 || (product.collection && filters.collections.includes(product.collection));

            return matchesCategory && matchesMaterial && matchesFeatures && matchesCollection;
        });
    });

    // Counts for UI display (e.g. Necklace (4))
    // We want counts based on current other filters? Or global counts?
    // Design usually shows global counts or filtered counts. Design "Necklace (4)" suggests static or filtered.
    // Let's go with global counts for now to keep it simple, or computed based on current filtered set if requested.
    // The design shows numbers next to unchecked boxes too, implying it might be the count available if you check it.

    function getCount(key: keyof Product, value: string): number {
        return products.value.filter(p => {
            if (Array.isArray(p[key])) {
                return (p[key] as string[]).includes(value);
            }
            return p[key] === value;
        }).length;
    }

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
        filteredProducts,
        toggleFilter,
        clearFilters,
        getCount
    };
}
