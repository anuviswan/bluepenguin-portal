import api from './api';
import type { Material } from '@/types/Material';

export default {
    async getAll(): Promise<Material[]> {
        const response = await api.get<Material[]>('/api/Material/getall');
        return response.data;
    }
};
