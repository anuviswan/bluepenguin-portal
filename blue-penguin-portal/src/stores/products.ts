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
    const page = ref(1);
    const pageSize = ref(12);

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
                    ? product.featureCodes.split(',').map((c: string) => c.trim()).filter(Boolean)
                    : [],
            yearCode: typeof product.yearCode === 'number' ? product.yearCode : new Date().getFullYear(),
            sequenceCode: product.sequenceCode,
            description: product.description
        };
    }

    async function searchProducts(filters: SearchProductsRequest, append: boolean = false) {
        loading.value = true;
        error.value = null;

        try {
            // Ensure pagination params are set correctly for the API (page instead of pageNumber)
            // We use the provided filters (which no longer have page/pageSize) and our internal state.
            const params = {
                page: append ? page.value + 1 : 1, // Default to 1 if not appending
                pageSize: pageSize.value
            };

            const result = await ProductService.searchProducts(filters, params);

            // Normalize all products to ensure type safety
            const normalizedProducts = result.items.map(normalizeProduct);

            if (append) {
                products.value = [...products.value, ...normalizedProducts];
            } else {
                products.value = normalizedProducts;
            }

            totalCount.value = result.totalCount;
            page.value = result.page;
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

        await searchProducts(filters, true);
    }

    async function fetchProductBySku(skuId: string) {
        loading.value = true;
        error.value = null;
        currentProduct.value = null;
        currentProductImages.value = [];

        try {
            const product = await ProductService.getProductBySku(skuId);

            // Normalize the product data
            const normalizedProduct = normalizeProduct(product);

            // Handle description migration
            if (!normalizedProduct.description) {
                normalizedProduct.description = `A delicate and elegant ${normalizedProduct.productName.toLowerCase()} featuring a premium design. Perfect for adding a touch of serene beauty to any outfit.`;
            }
            currentProduct.value = normalizedProduct;

            // Fetch all images
            try {
                const { getAllImagesForSkuId, downloadByImageId } = await import('@/services/api');
                const fallbackImage = (await import('@/assets/images/no-images-found.jpg')).default;

                const imageIds = await getAllImagesForSkuId(skuId);

                if (!imageIds || imageIds.length === 0) {
                    currentProductImages.value = [fallbackImage];
                } else {
                    const imageUrls = await Promise.all(
                        imageIds.map(id => downloadByImageId(skuId, id))
                    );
                    currentProductImages.value = imageUrls.length > 0 ? imageUrls : [fallbackImage];
                }
            } catch (imgErr) {
                console.warn('Failed to fetch product images:', imgErr);
                // Use fallback on error
                try {
                    const fallbackImage = (await import('@/assets/images/no-images-found.jpg')).default;
                    currentProductImages.value = [fallbackImage];
                } catch (fallbackErr) {
                    console.error('Failed to load fallback image:', fallbackErr);
                }
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
        page,
        pageSize,
        searchProducts,
        loadMoreProducts,
        fetchProductBySku
    };
});
