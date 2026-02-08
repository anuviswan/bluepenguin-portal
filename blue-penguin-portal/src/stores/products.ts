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
        searchProducts,
        fetchProductBySku
    };
});
