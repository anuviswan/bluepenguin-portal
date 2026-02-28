import api from './api'
import CategoryService from './CategoryService'
import type { ShowcaseItem } from '@/types/ShowcaseItem'

interface TopCategoryResponse {
  categoryCode: string
  categoryName: string
  blobUrl?: string
}

interface TopDiscountResponse {
  skuid: string
  productName: string
  price: number
  discountedPrice: number
  blobUrl?: string
}

interface TopCollectionResponse {
  collectionCode: string
  collectionName?: string
  productCount: number
  blobUrl?: string
}

interface ArtisanFavItemResponse {
  skuid: string
  productName: string
  originalPrice: number
  discountedPrice: number
  blobUrl?: string
}

interface FeaturedCategoryShowcaseResponse {
  categoryCode: string
  categoryName: string
  blobUrl?: string
}

export default {
  async getTopCategories(count: number = 4): Promise<ShowcaseItem[]> {
    const response = await api.get<TopCategoryResponse[]>('/api/Showcase/GetTopCategories', {
      params: { count },
    })

    return response.data.map(
      (c): ShowcaseItem => ({
        id: c.categoryCode,
        label: c.categoryName,
        imageUrl: c.blobUrl,
      }),
    )
  },

  async getTopCollections(count: number = 4): Promise<ShowcaseItem[]> {
    try {
      const response = await api.get<TopCollectionResponse[]>('/api/Showcase/GetTopCollections', { params: { count } })

      console.log('[ShowcaseService] GetTopCollections raw response:', response.data)

      return response.data.map((c: TopCollectionResponse): ShowcaseItem => {
        const code = c.collectionCode ?? ''

        return {
          id: code,
          label: c.collectionName || 'Collection',
          imageUrl: c.blobUrl,
        }
      })
    } catch (err) {
      console.error('[ShowcaseService] Failed to fetch top collections:', err)
      throw err
    }
  },

  async getArtisanFavs(): Promise<ShowcaseItem[]> {
    const response = await api.get<ArtisanFavItemResponse[]>('/api/ArtisanFav/getall')

    return response.data.map((item): ShowcaseItem => {
      return {
        id: item.skuid,
        label: item.productName || 'Product',
        originalPrice: item.originalPrice,
        discountPrice: item.discountedPrice,
        imageUrl: item.blobUrl,
      }
    })
  },

  async getTopDiscounts(count: number = 4): Promise<ShowcaseItem[]> {
    const response = await api.get<TopDiscountResponse[]>('/api/Showcase/GetTopDiscounts', {
      params: { count },
    })

    console.log('[ShowcaseService] GetTopDiscounts raw response:', response.data)

    return response.data.map((d): ShowcaseItem => {
      // Badge: Calculate percentage from prices
      let discountPercentage = 0
      if (d.price > 0 && d.discountedPrice < d.price) {
        discountPercentage = ((d.price - d.discountedPrice) / d.price) * 100
      }

      const badge = discountPercentage > 0 ? `SALE -${Math.round(discountPercentage)}%` : undefined

      return {
        id: d.skuid,
        label: d.productName || 'Product',
        badge,
        discountPrice: d.discountedPrice,
        originalPrice: d.price,
        imageUrl: d.blobUrl,
      }
    })
  },

  async getWaysToStyle(): Promise<ShowcaseItem[]> {
    try {
      const response = await api.get<FeaturedCategoryShowcaseResponse[]>('/api/FeaturedCategory/getall-for-showcase')

      return response.data.map((category): ShowcaseItem => {
        return {
          id: category.categoryCode,
          label: category.categoryName || 'Category',
          imageUrl: category.blobUrl,
        }
      })
    } catch (error) {
      console.error('[ShowcaseService] Failed to fetch ways to style:', error)
      // Fallback logic incase endpoint doesn't exist yet/fails
      return []
    }
  },
}
