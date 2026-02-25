export interface ShowcaseItem {
  id: string
  label: string
  imageUrl?: string
  badge?: string // overlay chip on the card image, e.g. 'SALE -30%'
  discountPrice?: number // sale price in ₹ (shown in red)
  originalPrice?: number // original price in ₹ (shown struck-through)
}
