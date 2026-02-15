import { ref, watch } from 'vue';
import { getPrimaryImageIdForSkuId, downloadByImageId } from '@/services/api';
import fallbackImage from '@/assets/images/no-images-found.jpg';

// Cache to store image URLs by sku (sku is the identifier here)
const imageCache = new Map<string, string>();

export function useProductImage(sku: string) {
    const imageUrl = ref<string>('');
    const isLoading = ref<boolean>(false);
    const error = ref<Error | null>(null);

    async function loadImage() {
        if (!sku) {
            imageUrl.value = fallbackImage;
            return;
        }

        // Check cache first
        if (imageCache.has(sku)) {
            imageUrl.value = imageCache.get(sku)!;
            return;
        }

        isLoading.value = true;
        error.value = null;

        try {
            let imageId: string | null = null;

            // Step 1: Try to get the primary image ID
            try {
                imageId = await getPrimaryImageIdForSkuId(sku);
            } catch (primaryErr) {
                console.warn(`Failed to get primary image for SKU ${sku}, trying to get all images:`, primaryErr);
            }

            // Step 2: If no primary image, try to get all images and use the first one
            if (!imageId) {
                try {
                    const { getAllImagesForSkuId } = await import('@/services/api');
                    const imageIds = await getAllImagesForSkuId(sku);
                    if (imageIds && imageIds.length > 0) {
                        imageId = (imageIds[0] || null) as string | null;
                    }
                } catch (allImagesErr) {
                    console.warn(`Failed to get all images for SKU ${sku}:`, allImagesErr);
                }
            }

            // Step 3: If still no image ID, use fallback
            if (!imageId) {
                imageUrl.value = fallbackImage;
                imageCache.set(sku, fallbackImage);
                return;
            }

            // Step 4: Download the image and get blob URL
            const blobUrl = await downloadByImageId(sku, imageId);

            imageUrl.value = blobUrl;
            imageCache.set(sku, blobUrl);
        } catch (err) {
            error.value = err instanceof Error ? err : new Error('Failed to load image');
            console.error(`Error loading product image for SKU ${sku}:`, err);
            // Use fallback on error
            imageUrl.value = fallbackImage;
            imageCache.set(sku, fallbackImage);
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
