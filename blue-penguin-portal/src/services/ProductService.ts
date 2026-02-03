import api from './api';
import type { SearchProductsRequest } from '@/types/SearchProductsRequest';
import type { Product } from '@/types/Product';

export const ProductService = {
    async searchProducts(filters: SearchProductsRequest): Promise<Product[]> {
        const response = await api.post<Product[]>('/api/Product/search', filters);
        return response.data;
    }
};
