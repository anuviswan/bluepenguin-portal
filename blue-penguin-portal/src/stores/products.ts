import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ProductService } from '@/services/ProductService';
import type { Product } from '@/types/Product';
import type { SearchProductsRequest } from '@/types/SearchProductsRequest';

export type { Product };

export const useProductsStore = defineStore('products', () => {
    const products = ref<Product[]>([]);
    const currentProduct = ref<Product | null>(null);
    const currentProductImages = ref<string[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    // Pagination state
    const totalCount = ref(0);
    const pageNumber = ref(1);
    const pageSize = ref(12);

    async function searchProducts(filters: SearchProductsRequest, append: boolean = false) {
        loading.value = true;
        error.value = null;

        try {
            // Ensure pagination params are set
            const request: SearchProductsRequest = {
                ...filters,
                pageNumber: filters.pageNumber || 1,
                pageSize: filters.pageSize || pageSize.value
            };

            const result = await ProductService.searchProducts(request);

            if (append) {
                products.value = [...products.value, ...result.items];
            } else {
                products.value = result.items;
            }

            totalCount.value = result.totalCount;
            pageNumber.value = result.pageNumber;
            pageSize.value = result.pageSize;
        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to fetch products';
            if (!append) products.value = [];
        } finally {
            loading.value = false;
        }
    }

    async function loadMoreProducts(filters: SearchProductsRequest) {
        if (loading.value || products.value.length >= totalCount.value) return;

        const nextPage = pageNumber.value + 1;
        await searchProducts({ ...filters, pageNumber: nextPage }, true);
    }

    async function fetchProductBySku(skuId: string) {
        loading.value = true;
        error.value = null;
        currentProduct.value = null;
        currentProductImages.value = [];

        try {
            const product = await ProductService.getProductBySku(skuId);
            // Mocking description and bullet points if they are missing
            if (!product.productDescription) {
                product.productDescription = `A delicate and elegant ${product.productName.toLowerCase()} featuring a premium design. Perfect for adding a touch of serene beauty to any outfit.`;
            }
            currentProduct.value = product;

            // Fetch all images
            try {
                const { getAllImagesForSkuId, downloadByImageId } = await import('@/services/api');
                const imageIds = await getAllImagesForSkuId(skuId);
                const imageUrls = await Promise.all(
                    imageIds.map(id => downloadByImageId(skuId, id))
                );
                currentProductImages.value = imageUrls;
            } catch (imgErr) {
                console.warn('Failed to fetch product images:', imgErr);
                // Fallback to primary image if possible, or leave empty
            }

        } catch (err) {
            error.value = err instanceof Error ? err.message : 'Failed to fetch product details';
        } finally {
            loading.value = false;
        }
    }

    return {
        products,
        currentProduct,
        currentProductImages,
        loading,
        error,
        totalCount,
        pageNumber,
        pageSize,
        searchProducts,
        loadMoreProducts,
        fetchProductBySku
    };
});
