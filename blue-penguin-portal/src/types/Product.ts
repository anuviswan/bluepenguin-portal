export interface Product {
  productName: string
  sku: string
  price: number
  stock: number
  categoryCode: string
  material: string
  collectionCode: string
  featureCodes: string[]
  yearCode: number
  sequenceCode?: number
  description?: string
  discountPrice?: number
  discountExpiryDate?: string
  specifications?: string[]
  productCareInstructions?: string[]
  primaryImageUrl?: string
  isArtisanFav?: boolean
  images?: Array<{ imageUrl: string; isPrimary?: boolean }>
}
