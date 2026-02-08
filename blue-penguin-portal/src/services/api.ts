import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

/**
 * Fetches the primary image ID for a given SKU
 */
export async function getPrimaryImageIdForSkuId(skuId: string): Promise<string> {
    const response = await api.get<string>('/api/FileUpload/getPrimaryImageIdForSkuId', {
        params: { skuId }
    });
    return response.data;
}

/**
 * Downloads an image by imageId and returns a blob URL
 */
export async function downloadByImageId(skuId: string, imageId: string): Promise<string> {
    const response = await api.get('/api/FileUpload/downloadByimageId', {
        params: { skuId, imageId },
        responseType: 'blob'
    });

    // Create a blob URL from the response
    const blob = new Blob([response.data], { type: response.headers['content-type'] || 'image/jpeg' });
    return URL.createObjectURL(blob);
}

/**
 * Fetches all image IDs for a given SKU
 */
export async function getAllImagesForSkuId(skuId: string): Promise<string[]> {
    const response = await api.get<string[]>('/api/FileUpload/getAllImagesForSkuId', {
        params: { skuId }
    });
    return response.data;
}

export default api;
