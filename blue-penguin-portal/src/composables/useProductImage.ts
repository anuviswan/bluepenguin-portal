import { ref, onUnmounted, watch } from 'vue';
import { getPrimaryImageIdForSkuId, downloadByImageId } from '@/services/api';

// Cache to store image URLs by sku (sku is the identifier here)
const imageCache = new Map<string, string>();

export function useProductImage(sku: string) {
    const imageUrl = ref<string>('');
    const isLoading = ref<boolean>(false);
    const error = ref<Error | null>(null);

    async function loadImage() {
        if (!sku) return;

        // Check cache first
        if (imageCache.has(sku)) {
            imageUrl.value = imageCache.get(sku)!;
            return;
        }

        isLoading.value = true;
        error.value = null;

        try {
            // Step 1: Get the primary image ID
            const imageId = await getPrimaryImageIdForSkuId(sku);

            if (!imageId) {
                // If no image ID, we just stay in placeholder state
                imageUrl.value = '';
                return;
            }

            // Step 2: Download the image and get blob URL
            const blobUrl = await downloadByImageId(sku, imageId);

            imageUrl.value = blobUrl;
            imageCache.set(sku, blobUrl);
        } catch (err) {
            error.value = err instanceof Error ? err : new Error('Failed to load image');
            console.error(`Error loading product image for SKU ${sku}:`, err);
        } finally {
            isLoading.value = false;
        }
    }

    // Load image when sku changes
    watch(() => sku, () => {
        loadImage();
    }, { immediate: true });

    return {
        imageUrl,
        isLoading,
        error
    };
}
