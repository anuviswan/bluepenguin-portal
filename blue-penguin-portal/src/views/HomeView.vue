<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';
import ProductFilter from '@/components/ProductFilter.vue';
import ProductCard from '@/components/ProductCard.vue';
import { useProductFilter } from '@/composables/useProductFilter';
import { computed } from 'vue';

const { filteredProducts, getCount } = useProductFilter();
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
        
        <div class="product-grid" v-if="filteredProducts.length > 0">
          <ProductCard 
            v-for="product in filteredProducts" 
            :key="product.id" 
            :product="product" 
          />
        </div>
        <div v-else class="no-results">
            <p>No products found matching your filters.</p>
        </div>

        <div class="load-more" v-if="filteredProducts.length > 0">
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
