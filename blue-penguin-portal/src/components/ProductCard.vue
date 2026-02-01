<script setup lang="ts">
import { computed } from 'vue';
import { useCurrency } from '@/composables/useCurrency';
import type { Product } from '@/stores/products';

const props = defineProps<{
  product: Product;
}>();

const { formatted: price } = useCurrency(computed(() => props.product.price));

// Helper for image colors/placeholders based on design feel
// In real app, `props.product.image` would be real url.
// I will use a placeholder or style the div if image fails.
</script>

<template>
  <div class="product-card">
    <div class="image-container">
        <!-- Using a placeholder div with dynamic colors or patterns could be cool if no image. 
             For now, just a standard img with error fallback or simple rect.
             Since I don't have real images, I'll style a div to look like "content". 
        -->
        <div class="placeholder-image">
            {{ product.title[0] }}
        </div>
    </div>
    <div class="info">
        <h3 class="title">{{ product.title }}</h3>
        <div class="details">
            <span class="price">{{ price }}</span>
            <div class="icons">
                <span v-if="product.features.includes('Ocean Dreams')" title="Ocean Dreams">🌊</span> 
                <span v-if="product.features.includes('Handmade')" title="Handmade">✋</span>
                <span title="Adjustable" v-if="product.features.includes('Adjustable')">🔧</span>
                <span title="Hypoallergenic" v-if="product.features.includes('Hypoallergenic')">🌿</span>
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
  margin-bottom: 0.5rem;
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
