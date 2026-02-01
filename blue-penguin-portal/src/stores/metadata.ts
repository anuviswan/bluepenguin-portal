import { defineStore } from 'pinia';
import { ref } from 'vue';
import CategoryService from '@/services/CategoryService';
import MaterialService from '@/services/MaterialService';
import CollectionService from '@/services/CollectionService';
import FeatureService from '@/services/FeatureService';
import type { Category } from '@/types/Category';
import type { Material } from '@/types/Material';
import type { Collection } from '@/types/Collection';
import type { Feature } from '@/types/Feature';

const CACHE_DURATION = Number(import.meta.env.VITE_CACHE_DURATION) || 3 * 60 * 60 * 1000; // Default 3 hours

export const useMetadataStore = defineStore('metadata', () => {
    const categories = ref<Category[]>([]);
    const materials = ref<Material[]>([]);
    const collections = ref<Collection[]>([]);
    const features = ref<Feature[]>([]);
    const lastFetched = ref<number>(0);

    async function fetchAll() {
        if (lastFetched.value && (Date.now() - lastFetched.value < CACHE_DURATION)) {
            // Data is fresh enough
            return;
        }

        try {
            const [categoriesData, materialsData, collectionsData, featuresData] = await Promise.all([
                CategoryService.getAll(),
                MaterialService.getAll(),
                CollectionService.getAll(),
                FeatureService.getAll()
            ]);

            categories.value = categoriesData;
            materials.value = materialsData;
            collections.value = collectionsData;
            features.value = featuresData;
            lastFetched.value = Date.now();
        } catch (error) {
            console.error('Failed to fetch metadata:', error);
            // Optionally prevent update of lastFetched so it retries next time
        }
    }

    return {
        categories,
        materials,
        collections,
        features,
        fetchAll
    };
});
