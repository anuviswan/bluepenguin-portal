import api from './api';
import type { Category } from '@/types/Category';

export default {
    async getAll(): Promise<Category[]> {
        const response = await api.get<Category[]>('/api/Category/getall');
        return response.data;
    }
};
