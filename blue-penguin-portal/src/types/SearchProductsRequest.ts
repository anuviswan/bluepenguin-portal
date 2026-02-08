export interface SearchProductsRequest {
    selectedCategories: string[];
    selectedMaterials: string[];
    selectedCollections: string[];
    selectedFeatures: string[];
    selectedYears?: string[];
    pageNumber?: number;
    pageSize?: number;
}
