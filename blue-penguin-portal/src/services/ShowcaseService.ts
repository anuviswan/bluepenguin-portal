import api from './api';
import { getPrimaryImageIdForSkuId, downloadByImageId } from './api';
import { ProductService } from './ProductService';
import type { ShowcaseItem } from '@/types/ShowcaseItem';

interface TopCategoryResponse {
    categoryCode: string;
    categoryName: string;
    latestSkuId?: string;
}

interface TopDiscountResponse {
    skuId: string;
    discountPercentage: number;
}

async function fetchImageForSku(skuId: string): Promise<string | undefined> {
    try {
        const imageId = await getPrimaryImageIdForSkuId(skuId);
        if (imageId) {
            return await downloadByImageId(skuId, imageId);
        }
    } catch {
        // No image — placeholder will be shown in the grid
    }
    return undefined;
}

export default {
    async getTopCategories(count: number = 4): Promise<ShowcaseItem[]> {
        const response = await api.get<TopCategoryResponse[]>('/api/Showcase/GetTopCategories', {
            params: { count }
        });

        return Promise.all(
            response.data.map(async (c): Promise<ShowcaseItem> => ({
                id: c.categoryCode,
                label: c.categoryName,
                imageUrl: c.latestSkuId ? await fetchImageForSku(c.latestSkuId) : undefined,
            }))
        );
    },

    async getTopDiscounts(count: number = 4): Promise<ShowcaseItem[]> {
        const response = await api.get<TopDiscountResponse[]>('/api/Showcase/GetTopDiscounts', {
            params: { count }
        });

        console.log('[ShowcaseService] GetTopDiscounts raw response:', response.data);

        return Promise.all(
            response.data.map(async (d): Promise<ShowcaseItem> => {
                const skuId = d.skuId;
                let name = 'Product';
                let discountPrice: number | undefined;
                let originalPrice: number | undefined;

                try {
                    const product = await ProductService.getProductBySku(skuId);
                    if (product) {
                        name = product.productName;
                        discountPrice = product.discountPrice;
                        originalPrice = product.price;
                    }
                } catch (err) {
                    console.error(`[ShowcaseService] Failed to fetch product details for ${skuId}:`, err);
                }

                // Badge: Use the percentage from the API response
                const badge = `SALE -${Math.round(d.discountPercentage)}%`;

                return {
                    id: skuId,
                    label: name,
                    badge,
                    discountPrice,
                    originalPrice,
                    imageUrl: skuId ? await fetchImageForSku(skuId) : undefined,
                };
            })
        );
    },
};
