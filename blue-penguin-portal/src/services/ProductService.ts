import api from './api';
import type { SearchProductsRequest } from '@/types/SearchProductsRequest';
import type { Product } from '@/types/Product';
import type { PaginatedResult } from '@/types/PaginatedResult';

export const ProductService = {
    async searchProducts(filters: SearchProductsRequest): Promise<PaginatedResult<Product>> {
        const response = await api.post<PaginatedResult<Product>>('/api/Product/search', filters);
        return response.data;
    },
    async getAllProducts(pageNumber: number = 1, pageSize: number = 12): Promise<PaginatedResult<Product>> {
        const response = await api.get<PaginatedResult<Product>>('/api/Product/getall', {
            params: { pageNumber, pageSize }
        });
        return response.data;
    },
    async getProductBySku(skuId: string): Promise<Product> {
        const response = await api.get<Product>('/api/Product/getbysku', {
            params: { sku: skuId }
        });
        return response.data;
    }
};
