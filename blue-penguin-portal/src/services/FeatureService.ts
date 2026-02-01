import api from './api';
import type { Feature } from '@/types/Feature';

export default {
    async getAll(): Promise<Feature[]> {
        const response = await api.get<Feature[]>('/api/Feature/getall');
        return response.data;
    }
};
