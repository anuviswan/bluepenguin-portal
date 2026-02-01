import api from './api';
import type { Collection } from '@/types/Collection';

export default {
    async getAll(): Promise<Collection[]> {
        const response = await api.get<Collection[]>('/api/Collection/getall');
        return response.data;
    }
};
