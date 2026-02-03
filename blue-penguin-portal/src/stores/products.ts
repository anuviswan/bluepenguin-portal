import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ProductService } from '@/services/ProductService';
import type { Product } from '@/types/Product';
import type { SearchProductsRequest } from '@/types/SearchProductsRequest';

export type { Product };

export const useProductsStore = defineStore('products', () => {
    const products = ref<Product[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    async function searchProducts(filters: SearchProductsRequest) {
        loading.value = true;
        error.value = null;

        try {
            products.value = await ProductService.searchProducts(filters);
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to fetch products';
            products.value = [];
        } finally {
            loading.value = false;
        }
    }

    return {
        products,
        loading,
        error,
        searchProducts
    };
});
