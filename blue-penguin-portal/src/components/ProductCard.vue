<script setup lang="ts">
import { computed } from 'vue'
import { useCurrency } from '@/composables/useCurrency'
import { useProductImage } from '@/composables/useProductImage'
import { useProductsStore } from '@/stores/products'
import { storeToRefs } from 'pinia'
import type { Product } from '@/types/Product'

const props = defineProps<{
  product: Product
}>()

const { formatted: price } = useCurrency(computed(() => props.product.price))
const { formatted: discountPrice } = useCurrency(computed(() => props.product.discountPrice || 0))

const hasDiscount = computed(
  () => !!props.product.discountPrice && props.product.discountPrice < props.product.price,
)
const { imageUrl, isLoading, error } = useProductImage(props.product.sku)

const productsStore = useProductsStore()
const { artisanFavSkuList } = storeToRefs(productsStore)
const isArtisanFav = computed(() => artisanFavSkuList.value.includes(props.product.sku))

// Parse feature codes - they might be an array or a comma-separated string
const featureCodesArray = computed(() => {
  const codes = props.product.featureCodes
  if (!codes) return []
  if (Array.isArray(codes)) {
    return codes.map((code: string) => String(code).trim()).filter(Boolean)
  }
  if (typeof codes === 'string') {
    return (codes as string)
      .split(',')
      .map((code: string) => code.trim())
      .filter(Boolean)
  }
  return []
})
</script>

<template>
  <RouterLink :to="{ name: 'product-details', params: { sku: product.sku } }" class="product-card">
    <div class="image-container">
      <!-- Artisan Fav Overlay -->
      <div v-if="isArtisanFav" class="artisan-badge" title="Artisan's Pick">⭐ Artisan's Pick</div>
      <div v-if="hasDiscount" class="sale-badge">SALE</div>
      <div v-if="isLoading" class="loading-overlay">
        <div class="spinner"></div>
      </div>
      <img
        v-else-if="imageUrl && imageUrl !== '/src/assets/images/no-images-found.jpg' && !imageUrl.includes('no-images-found')"
        :src="imageUrl"
        :alt="product.productName"
        class="product-image"
        loading="lazy"
        decoding="async"
      />
      <div v-else class="placeholder-image">
        {{ product.productName ? product.productName[0] : '' }}
      </div>
    </div>
    <div class="info">
      <h3 class="title">{{ product.productName }}</h3>
      <p class="sku">{{ product.sku }}</p>
      <div class="details">
        <div class="price-container">
          <span v-if="hasDiscount" class="discount-price">{{ discountPrice }}</span>
          <span class="price" :class="{ 'original-price': hasDiscount }">{{ price }}</span>
        </div>
        <div class="icons">
          <!-- Show icons based on collection and feature codes -->
          <span v-if="product.collectionCode === 'NAT'" title="Nature Collection">🌿</span>
          <span v-if="featureCodesArray.includes('EM')" title="Embedded">💎</span>
          <span v-if="featureCodesArray.includes('HM')" title="Handmade">✋</span>
          <span v-if="featureCodesArray.includes('AD')" title="Adjustable">🔧</span>
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  background-color: var(--color-white);
  border-radius: var(--radius-sm);
  overflow: hidden;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  cursor: pointer;
  border: 1px solid transparent;
  text-decoration: none;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.image-container {
  width: 100%;
  aspect-ratio: 1 / 1;
  background-color: var(--color-bg-mute);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.sale-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: var(--color-accent);
  color: var(--color-white);
  padding: 2px 8px;
  font-size: var(--font-size-xs);
  font-weight: 700;
  border-radius: 2px;
  z-index: 10;
  letter-spacing: 0.5px;
}

.artisan-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  color: var(--color-text-main);
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 20px;
  z-index: 10;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 4px;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.5);
}

.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--color-blue-primary);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.placeholder-image {
  font-size: var(--font-size-5xl);
  color: var(--color-blue-primary);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-image-placeholder); /* Warmer brand background replacing bg-light */
  border: 1px solid var(--color-border); /* Subtle border */
  text-transform: uppercase;
  font-weight: 600;
}

.info {
  padding: 0.5rem 0; /* Design has minimal padding, text mostly below image aligned left */
  padding-left: 0.5rem;
}

.title {
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text-main);
  margin-bottom: 0.25rem;
}

.sku {
  font-size: 0.75rem;
  color: var(--color-text-light);
  margin-bottom: 0.5rem;
  font-family: monospace;
}

.details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-container {
  display: flex;
  flex-direction: column;
}

.discount-price {
  font-weight: 700;
  color: var(--color-accent);
  font-size: var(--font-size-md);
}

.price {
  font-weight: 600;
  color: var(--color-text-main);
}

.original-price {
  text-decoration: line-through;
  color: var(--color-text-light);
  font-size: 0.85rem;
  font-weight: 400;
}

.icons {
  display: flex;
  gap: 0.5rem;
  font-size: 1rem;
  color: var(--color-blue-primary);
}
</style>
