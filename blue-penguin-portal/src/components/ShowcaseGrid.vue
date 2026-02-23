<script setup lang="ts">
import type { ShowcaseItem } from '@/types/ShowcaseItem';

defineProps<{
  title: string;
  items: ShowcaseItem[];
  loading?: boolean;
  error?: string | null;
}>();

const emit = defineEmits<{
  'item-click': [item: ShowcaseItem];
}>();
</script>

<template>
  <section class="showcase-section">
    <h2 class="showcase-title">{{ title }}</h2>

    <!-- Error State -->
    <div v-if="error" class="showcase-error">
      <p>{{ error }}</p>
    </div>

    <!-- Loading Skeletons -->
    <div v-else-if="loading" class="showcase-grid">
      <div v-for="i in 4" :key="i" class="showcase-card skeleton">
        <div class="card-image skeleton-img"></div>
        <div class="skeleton-label"></div>
      </div>
    </div>

    <!-- Items Grid -->
    <div v-else class="showcase-grid">
      <div
        v-for="item in items"
        :key="item.id"
        class="showcase-card"
        role="button"
        tabindex="0"
        @click="emit('item-click', item)"
        @keydown.enter="emit('item-click', item)"
      >
        <div class="card-image-wrapper">
          <img
            v-if="item.imageUrl"
            :src="item.imageUrl"
            :alt="item.label"
            class="card-image"
          />
          <div v-else class="card-image-placeholder">
            <span class="placeholder-icon">🌸</span>
          </div>
          <span v-if="item.badge" class="card-badge">{{ item.badge }}</span>
        </div>
        <p class="card-label">{{ item.label }}</p>
        <div v-if="item.discountPrice || item.originalPrice" class="card-prices">
          <span v-if="item.discountPrice" class="discount-price">₹{{ item.discountPrice }}</span>
          <span v-if="item.originalPrice" class="original-price" :class="{ 'has-discount': item.discountPrice }">₹{{ item.originalPrice }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.showcase-section {
  padding: 3rem 0;
}

.showcase-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-text-main);
  margin-bottom: 2rem;
  letter-spacing: 0.01em;
}

.showcase-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.25rem;
}

.showcase-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: transform 0.2s ease;
  flex: 0 1 calc(25% - 1.25rem); /* Safer calculation for 4 per row */
  max-width: 280px; /* Limits size of items when few exist */
}

.showcase-card:hover {
  transform: translateY(-4px);
}

.card-image-wrapper {
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border-radius: 8px;
  background-color: #f3ece8;
  position: relative;
}

.card-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #e63946;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  letter-spacing: 0.05em;
  pointer-events: none;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  z-index: 1;
}

.showcase-card:hover .card-image {
  transform: scale(1.04);
}

.card-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5ece8 0%, #e8ddd8 100%);
}

.placeholder-icon {
  font-size: 3rem;
  opacity: 0.6;
}

.card-label {
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text-main);
  text-align: center;
  margin-top: 0.25rem;
}

.card-prices {
  display: flex;
  gap: 0.75rem;
  align-items: baseline;
  justify-content: center;
}

.discount-price {
  font-weight: 700;
  color: #e63946;
  font-size: 1.1rem;
}

.original-price {
  color: var(--color-text-light);
  font-size: 0.9rem;
}

.original-price.has-discount {
  text-decoration: line-through;
  opacity: 0.8;
}

/* Skeleton loading */
.skeleton .skeleton-img {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  background: linear-gradient(90deg, #f0e8e3 25%, #e5dbd5 50%, #f0e8e3 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease infinite;
}

.skeleton .skeleton-label {
  width: 70%;
  height: 1.1rem;
  border-radius: 4px;
  background: linear-gradient(90deg, #f0e8e3 25%, #e5dbd5 50%, #f0e8e3 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s ease infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.showcase-error {
  text-align: center;
  color: var(--color-text-light);
  padding: 2rem 0;
  font-size: 0.95rem;
}

@media (max-width: 900px) {
  .showcase-card {
    flex: 0 1 calc(50% - 1.25rem);
  }
}

@media (max-width: 500px) {
  .showcase-card {
    flex: 0 1 calc(50% - 0.75rem);
  }
  .showcase-title {
    font-size: 1.6rem;
  }
  .showcase-grid {
    gap: 0.75rem;
  }
}
</style>
