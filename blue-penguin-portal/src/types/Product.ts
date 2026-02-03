export interface Product {
    productName: string;
    sku: string;
    price: number;
    stock: number;
    partitionKey: string;
    rowKey: string;
    timestamp: string;
    eTag: string;
    materialCode: string;
    collectionCode: string;
    featureCodes: string;
    yearCode: number;
    sequenceCode?: number;
}
