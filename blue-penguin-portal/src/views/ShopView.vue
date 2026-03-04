<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
import ProductFilter from '@/components/ProductFilter.vue'
import ProductCard from '@/components/ProductCard.vue'
import { useProductFilter } from '@/composables/useProductFilter'

const { filteredProducts, loading, error, totalCount, hasMore, loadMore } = useProductFilter()
</script>

<template>
  <div class="home-layout">
    <TheHeader />

    <div class="main-container">
      <ProductFilter class="sidebar" />

      <main class="content">
        <div class="content-header">
          <p class="count">{{ totalCount }} items</p>
        </div>

        <!-- Error State -->
        <div v-if="error" class="error-state">
          <p class="error-message">{{ error }}</p>
          <p class="error-hint">Please try again or adjust your filters.</p>
        </div>

        <!-- Loading State -->
        <div v-else-if="loading && filteredProducts.length === 0" class="loading-state">
          <div class="spinner"></div>
          <p>Loading products...</p>
        </div>

        <!-- Products Grid -->
        <div v-else-if="filteredProducts.length > 0" class="product-grid">
          <ProductCard v-for="product in filteredProducts" :key="product.sku" :product="product" />
        </div>

        <!-- No Results -->
        <div v-else-if="!loading" class="no-results">
          <p>No products found matching your filters.</p>
        </div>

        <div class="load-more" v-if="hasMore">
          <button class="load-more-btn" @click="loadMore" :disabled="loading">
            <span v-if="loading" class="btn-spinner"></span>
            {{ loading ? 'Loading...' : 'Load More ›' }}
          </button>
        </div>
      </main>
    </div>

    <TheFooter />
  </div>
</template>

<style scoped>
.home-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  padding: var(--spacing-2xl);
  flex: 1;
}

.sidebar {
  width: 250px;
  flex-shrink: 0;
}

.content {
  flex: 1;
  padding-left: var(--spacing-2xl);
}

.content-header {
  margin-bottom: var(--spacing-2xl);
}

.count {
  color: var(--color-text-light);
  font-size: 0.9rem;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--spacing-2xl) var(--spacing-xl);
}

.no-results {
  padding: var(--spacing-5xl);
  text-align: center;
  color: var(--color-text-light);
}

.load-more {
  margin-top: var(--spacing-5xl);
  display: flex;
  justify-content: center;
}

.load-more-btn {
  border: 1px solid var(--color-border);
  padding: var(--spacing-md) var(--spacing-2xl);
  border-radius: var(--radius-sm);
  background-color: var(--color-white);
  font-size: var(--font-size-md);
  color: var(--color-text-main);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.load-more-btn:hover {
  background-color: var(--color-bg-light);
}

.loading-state {
  padding: var(--spacing-5xl);
  text-align: center;
  color: var(--color-text-light);
}

.spinner {
  border: 3px solid var(--color-border-light);
  border-top: 3px solid var(--color-blue-primary);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto var(--spacing-lg);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.btn-spinner {
  border: 2px solid var(--color-border-light);
  border-top: 2px solid var(--color-blue-primary);
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}

.load-more-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-state {
  padding: var(--spacing-5xl);
  text-align: center;
}

.error-message {
  color: var(--color-accent);
  font-size: var(--font-size-md);
  margin-bottom: var(--spacing-sm);
}

.error-hint {
  color: var(--color-text-light);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
    padding: var(--spacing-lg) var(--spacing-md);
  }

  .sidebar {
    width: 100%;
    margin-bottom: var(--spacing-xl);
    padding-right: 0;
    border-right: none;
    border-bottom: 2px solid var(--color-border);
    padding-bottom: var(--spacing-xl);
  }

  .content {
    padding-left: 0;
  }

  .content-header {
    margin-bottom: var(--spacing-xl);
    text-align: center;
  }
}

@media (max-width: 480px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: var(--spacing-lg) var(--spacing-sm);
  }
}
</style>
