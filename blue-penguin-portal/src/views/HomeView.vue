<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';
import ProductFilter from '@/components/ProductFilter.vue';
import ProductCard from '@/components/ProductCard.vue';
import { useProductFilter } from '@/composables/useProductFilter';
import { computed } from 'vue';

const { filteredProducts, loading, error } = useProductFilter();
const totalItems = computed(() => filteredProducts.value.length);
</script>

<template>
  <div class="home-layout">
    <TheHeader />
    
    <div class="main-container">
      <ProductFilter class="sidebar" />
      
      <main class="content">
        <div class="content-header">
           <p class="count">{{ totalItems }} items</p>
        </div>
        
        <!-- Error State -->
        <div v-if="error" class="error-state">
            <p class="error-message">{{ error }}</p>
            <p class="error-hint">Please try again or adjust your filters.</p>
        </div>

        <!-- Loading State -->
        <div v-else-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading products...</p>
        </div>

        <!-- Products Grid -->
        <div v-else-if="filteredProducts.length > 0" class="product-grid">
          <ProductCard 
            v-for="product in filteredProducts" 
            :key="product.sku" 
            :product="product" 
          />
        </div>

        <!-- No Results -->
        <div v-else class="no-results">
            <p>No products found matching your filters.</p>
        </div>

        <div class="load-more" v-if="filteredProducts.length > 0 && !loading">
           <button class="load-more-btn">Load More ›</button> 
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
  padding: 2rem;
  flex: 1;
}

.sidebar {
  width: 250px;
  flex-shrink: 0;
}

.content {
  flex: 1;
  padding-left: 2rem;
}

.content-header {
  margin-bottom: 2rem;
}

.count {
    color: var(--color-text-light);
    font-size: 0.9rem;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 2rem 1.5rem; /* Row gap 2rem, Col gap 1.5rem */
}

.no-results {
    padding: 4rem;
    text-align: center;
    color: var(--color-text-light);
}

.load-more {
    margin-top: 4rem;
    display: flex;
    justify-content: center;
}

.load-more-btn {
    border: 1px solid var(--color-border);
    padding: 0.75rem 2rem;
    border-radius: 4px;
    background-color: white;
    font-size: 1rem;
    color: var(--color-text-main);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: background-color 0.2s;
}

.load-more-btn:hover {
    background-color: #f9f9f9;
}

.loading-state {
    padding: 4rem;
    text-align: center;
    color: var(--color-text-light);
}

.spinner {
    border: 3px solid #f3f3f3;
    border-top: 3px solid var(--color-blue-primary);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.error-state {
    padding: 4rem;
    text-align: center;
}

.error-message {
    color: #dc2626;
    font-size: 1rem;
    margin-bottom: 0.5rem;
}

.error-hint {
    color: var(--color-text-light);
    font-size: 0.9rem;
}

@media (max-width: 768px) {
    .main-container {
        flex-direction: column;
        padding: 1rem;
    }
    
    .sidebar {
        width: 100%;
        margin-bottom: 2rem;
        padding-right: 0;
        border-right: none;
        border-bottom: 1px solid var(--color-border);
        padding-bottom: 2rem;
    }
    
    .content {
        padding-left: 0;
    }
}
</style>
