<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'
import ProductFilter from '@/components/ProductFilter.vue'
import ProductCard from '@/components/ProductCard.vue'
import { useProductFilter } from '@/composables/useProductFilter'
import { useSEO } from '@/composables/useSEO'
import { computed } from 'vue'

const { filteredProducts, loading, error, totalCount, hasMore, loadMore, filters, sortBy } = useProductFilter()

const hasActiveFilters = computed(() => {
  return filters.searchTerm !== '' || 
         filters.categories.length > 0 || 
         filters.materials.length > 0 || 
         filters.collections.length > 0 || 
         filters.features.length > 0
})

const siteUrl = import.meta.env.VITE_SITE_URL || 'https://bluepenguin.in'

useSEO(() => ({
  title: 'Shop Custom Bead Jewellery & Handmade Bracelets | Blue Penguin',
  description: 'Browse the premium handcrafted bead jewellery collection by Blue Penguin. Customise and choose from our artisan bracelets, necklaces, and accessories.',
  keywords: 'bead jewellery, handmade bracelets, custom jewellery, beaded necklaces, artisan accessories, shop handmade India',
  canonical: `${siteUrl}/shop`,
  ogImage: `${siteUrl}/favicon.png`,
  schema: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': siteUrl
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Shop',
        'item': `${siteUrl}/shop`
      }
    ]
  }
}))
</script>

<template>
  <div class="home-layout">
    <TheHeader />

    <div class="main-container">
      <ProductFilter class="sidebar" />

      <main class="content">
        <div class="toolbar">
          <div class="toolbar-search">
            <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              v-model="filters.searchTerm" 
              placeholder="Search bracelets, earrings, necklaces..." 
              class="search-input"
            />
            <button v-if="filters.searchTerm" @click="filters.searchTerm = ''" class="clear-search-btn" aria-label="Clear search">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="toolbar-actions">
            <p v-if="hasActiveFilters" class="count">Showing {{ totalCount }} results</p>
            <div class="sort-dropdown">
              <select v-model="sortBy" class="sort-select" aria-label="Sort products">
                <option value="newest">Newest</option>
                <option value="featured">Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
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
  padding-left: var(--spacing-4xl); /* Increased to move slightly away from left filter divider */
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-4xl);
  padding-bottom: var(--spacing-xl);
  border-bottom: 1px solid var(--color-border-light);
  flex-wrap: wrap;
  gap: var(--spacing-lg);
}

.toolbar-search {
  position: relative;
  flex: 1;
  max-width: 420px;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 44px;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  font-size: var(--font-size-md);
  color: var(--color-text-main);
  background-color: var(--color-white);
  transition: all 0.2s ease;
}

.search-input::placeholder {
  color: var(--color-text-light);
  opacity: 0.8;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-blue-primary);
  box-shadow: 0 0 0 2px rgba(11, 79, 108, 0.1);
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: var(--color-text-light);
  pointer-events: none;
}

.clear-search-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: var(--color-text-light);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s, color 0.2s;
}

.clear-search-btn:hover {
  background-color: var(--color-bg-light);
  color: var(--color-text-main);
}

.clear-search-btn svg {
  width: 16px;
  height: 16px;
}

.sort-select {
  padding: 8px 32px 8px 12px;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-main);
  background-color: var(--color-white);
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 8px center;
  background-size: 16px;
}

.sort-select:focus {
  outline: none;
  border-color: var(--color-blue-primary);
}

.count {
  color: var(--color-text-light);
  font-size: 0.8rem;
  opacity: 0.7;
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

  .toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-md);
    padding-bottom: var(--spacing-md);
  }

  .toolbar-search {
    max-width: none;
  }

  .toolbar-actions {
    justify-content: space-between;
  }
}

@media (max-width: 480px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: var(--spacing-lg) var(--spacing-sm);
  }
}
</style>
