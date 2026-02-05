<script setup lang="ts">
import { computed } from 'vue';
import { useCurrency } from '@/composables/useCurrency';
import { useProductImage } from '@/composables/useProductImage';
import type { Product } from '@/types/Product';

const props = defineProps<{
  product: Product;
}>();

const { formatted: price } = useCurrency(computed(() => props.product.price));
const { imageUrl, isLoading, error } = useProductImage(props.product.sku);

// Parse feature codes - they might be comma-separated or single values
const featureCodesArray = computed(() => {
  if (!props.product.featureCodes) return [];
  return props.product.featureCodes.split(',').map(code => code.trim());
});
</script>

<template>
  <div class="product-card">
    <div class="image-container">
        <div v-if="isLoading" class="loading-overlay">
            <div class="spinner"></div>
        </div>
        <img v-else-if="imageUrl && !error" :src="imageUrl" :alt="product.productName" class="product-image" />
        <div v-else class="placeholder-image">
            {{ product.productName[0] }}
        </div>
    </div>
    <div class="info">
        <h3 class="title">{{ product.productName }}</h3>
        <p class="sku">{{ product.sku }}</p>
        <div class="details">
            <span class="price">{{ price }}</span>
            <div class="icons">
                <!-- Show icons based on collection and feature codes -->
                <span v-if="product.collectionCode === 'NAT'" title="Nature Collection">🌿</span>
                <span v-if="featureCodesArray.includes('EM')" title="Embedded">💎</span>
                <span v-if="featureCodesArray.includes('HM')" title="Handmade">✋</span>
                <span v-if="featureCodesArray.includes('AD')" title="Adjustable">🔧</span>
            </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 4px; /* Slight radius */
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  border: 1px solid transparent;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.image-container {
  width: 100%;
  aspect-ratio: 1;
  background-color: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
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
    to { transform: rotate(360deg); }
}

.placeholder-image {
    font-size: 3rem;
    color: #ccc;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
}



.info {
  padding: 1rem 0; /* Design has minimal padding, text mostly below image aligned left */
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

.price {
  font-weight: 600;
  color: var(--color-text-main);
}

.icons {
    display: flex;
    gap: 0.5rem;
    font-size: 1rem;
    color: var(--color-blue-primary);
}
</style>
