import api from './api';
import { getPrimaryImageIdForSkuId, downloadByImageId } from './api';
import type { ShowcaseItem } from '@/types/ShowcaseItem';

interface TopCategoryResponse {
    categoryCode: string;
    categoryName: string;
    latestSkuId?: string;
}

export default {
    async getTopCategories(count: number = 4): Promise<ShowcaseItem[]> {
        const response = await api.get<TopCategoryResponse[]>('/api/Showcase/GetTopCategories', {
            params: { count }
        });

        // Fetch images in parallel using each category's latestSkuId
        const items = await Promise.all(
            response.data.map(async (c): Promise<ShowcaseItem> => {
                let imageUrl: string | undefined;

                if (c.latestSkuId) {
                    try {
                        const imageId = await getPrimaryImageIdForSkuId(c.latestSkuId);
                        if (imageId) {
                            imageUrl = await downloadByImageId(c.latestSkuId, imageId);
                        }
                    } catch {
                        // No image — placeholder will be shown in the grid
                    }
                }

                return {
                    id: c.categoryCode,
                    label: c.categoryName,
                    imageUrl,
                };
            })
        );

        return items;
    },
};
