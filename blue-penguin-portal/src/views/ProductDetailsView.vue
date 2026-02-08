<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProductsStore } from '@/stores/products';
import { useMetadataStore } from '@/stores/metadata';
import { storeToRefs } from 'pinia';
import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';
import ProductCard from '@/components/ProductCard.vue';
import { useCurrency } from '@/composables/useCurrency';

const route = useRoute();
const router = useRouter();
const productsStore = useProductsStore();
const metadataStore = useMetadataStore();
const { currentProduct, currentProductImages, loading, error, products: allProducts } = storeToRefs(productsStore);
const { features: allFeatures, materials: allMaterials, collections: allCollections } = storeToRefs(metadataStore);

const sku = computed(() => route.params.sku as string);
const selectedImageIndex = ref(0);
const quantity = ref(1);

const { formatted: price } = useCurrency(computed(() => currentProduct.value?.price || 0));

const loadData = async () => {
  if (sku.value) {
    await Promise.all([
      productsStore.fetchProductBySku(sku.value),
      metadataStore.fetchAll()
    ]);
    selectedImageIndex.value = 0;
  }
};

onMounted(loadData);
watch(sku, loadData);

const mainImage = computed(() => {
  if (currentProductImages.value.length > 0) {
    return currentProductImages.value[selectedImageIndex.value];
  }
  return '';
});

const featureCodesArray = computed(() => {
  if (!currentProduct.value?.featureCodes) return [];
  return currentProduct.value.featureCodes.split(',').map(code => code.trim());
});

const featureNames = computed(() => {
  return featureCodesArray.value.map(code => {
    const feature = allFeatures.value.find(f => f.id === code);
    return feature ? feature.name : code;
  });
});

const materialName = computed(() => {
  if (!currentProduct.value?.materialCode) return '';
  const mat = allMaterials.value.find(m => m.id === currentProduct.value?.materialCode);
  return mat ? mat.name : currentProduct.value.materialCode;
});

const collectionName = computed(() => {
  if (!currentProduct.value?.collectionCode) return '';
  const col = allCollections.value.find(c => c.id === currentProduct.value?.collectionCode);
  return col ? col.name : currentProduct.value.collectionCode;
});

const relatedProducts = computed(() => {
  // Simple heuristic for related products: same category or first few products
  return allProducts.value
    .filter(p => p.sku !== sku.value)
    .slice(0, 4);
});

const incrementQty = () => quantity.value++;
const decrementQty = () => {
  if (quantity.value > 1) quantity.value--;
};

const goBack = () => {
  router.push('/');
};
</script>

<template>
  <div class="details-layout">
    <TheHeader />

    <div class="container">
      <nav class="breadcrumb">
        <a @click.prevent="goBack" href="#" class="back-link">
          <span class="arrow">←</span> Back to Results
        </a>
      </nav>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading product details...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="goBack" class="btn-primary">Return to Shop</button>
      </div>

      <div v-else-if="currentProduct" class="product-content">
        <div class="product-main">
          <!-- Image Gallery -->
          <div class="gallery-section">
            <div class="main-image-container">
              <img v-if="mainImage" :src="mainImage" :alt="currentProduct.productName" class="main-image" />
              <div v-else class="placeholder-main">
                {{ currentProduct.productName[0] }}
              </div>
            </div>
            <div class="thumbnails" v-if="currentProductImages.length > 1">
              <div 
                v-for="(img, index) in currentProductImages" 
                :key="index"
                class="thumbnail"
                :class="{ active: selectedImageIndex === index }"
                @click="selectedImageIndex = index"
              >
                <img :src="img" :alt="`${currentProduct.productName} thumb ${index}`" />
              </div>
            </div>
          </div>

          <!-- Product Info -->
          <div class="info-section">
            <h1 class="product-title">{{ currentProduct.productName }}</h1>
            <div class="price-row">
              <span class="price-large">{{ price }}</span>
            </div>

            <div class="quick-features">
              <span v-if="featureCodesArray.includes('HM')" class="q-feature">
                <span class="icon">✋</span> Handmade
              </span>
              <span v-if="featureCodesArray.includes('HP')" class="q-feature">
                <span class="icon">☑</span> Hypoallergenic
              </span>
              <span v-if="featureCodesArray.includes('AD')" class="q-feature">
                <span class="icon">🔧</span> Adjustable
              </span>
            </div>

            <div class="purchase-actions">
              <div class="quantity-selector">
                <button @click="decrementQty" class="qty-btn">−</button>
                <span class="qty-value">{{ quantity }}</span>
                <button @click="incrementQty" class="qty-btn">+</button>
              </div>
              <button class="add-to-cart-btn">Add to Cart</button>
            </div>

            <div class="feature-tags">
              <span v-if="materialName" class="tag material-tag">
                Material: {{ materialName }}
              </span>
              <span v-if="collectionName" class="tag collection-tag">
                Collection: {{ collectionName }}
              </span>
              <span v-for="name in featureNames" :key="name" class="tag">
                {{ name }}
              </span>
            </div>
          </div>
        </div>

        <!-- Product Details Description -->
        <div class="product-description-section">
          <h2>Product Details</h2>
          <div class="description-text">
            <p>{{ currentProduct.productDescription }}</p>
          </div>
        </div>

        <!-- Related Products -->
        <div class="related-section" v-if="relatedProducts.length > 0">
          <h2>You May Also Like</h2>
          <div class="related-grid">
            <ProductCard 
              v-for="product in relatedProducts" 
              :key="product.sku" 
              :product="product" 
            />
          </div>
          <div class="load-more-container">
             <button class="load-more-btn" @click="goBack">Load More ›</button>
          </div>
        </div>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<style scoped>
.details-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background-soft);
}

.container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem;
  flex: 1;
}

.breadcrumb {
  margin-bottom: 1.5rem;
}

.back-link {
  color: var(--color-text-light);
  text-decoration: none;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.back-link:hover {
  color: var(--color-blue-primary);
}

.product-content {
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 4px;
}

.product-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 2.5rem;
  gap: 3rem;
  border-bottom: 1px solid var(--color-border);
}

/* Gallery */
.gallery-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-image-container {
  aspect-ratio: 1;
  background-color: #f8f8f8;
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnails {
  display: flex;
  gap: 0.75rem;
}

.thumbnail {
  width: 80px;
  height: 80px;
  border: 1px solid var(--color-border);
  cursor: pointer;
  overflow: hidden;
  transition: all 0.2s;
}

.thumbnail.active {
  border-color: var(--color-blue-primary);
  border-width: 2px;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Info Section */
.info-section {
  display: flex;
  flex-direction: column;
}

.product-title {
  font-size: 2.5rem;
  color: var(--color-text-main);
  margin-bottom: 1.5rem;
  font-weight: 400;
  font-family: 'Outfit', sans-serif;
}

.price-row {
  margin-bottom: 2rem;
}

.price-large {
  font-size: 1.75rem;
  font-weight: 500;
  color: var(--color-text-main);
}

.quick-features {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  color: var(--color-text-light);
  font-size: 0.9rem;
}

.q-feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon {
    font-size: 1.1rem;
    color: var(--color-blue-primary);
}

.purchase-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.quantity-selector {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  height: 48px;
}

.qty-btn {
  background: none;
  border: none;
  width: 40px;
  height: 100%;
  cursor: pointer;
  font-size: 1.2rem;
  color: var(--color-text-light);
}

.qty-value {
  width: 40px;
  text-align: center;
  font-weight: 500;
}

.add-to-cart-btn {
  flex: 1;
  background-color: #94b8d7; /* Soft blue from design */
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.add-to-cart-btn:hover {
  background-color: var(--color-blue-primary);
}

.feature-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
}

.tag {
  background-color: var(--color-background-soft);
  color: var(--color-blue-primary);
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid var(--color-border);
}

.material-tag {
  background-color: #f0f7ff;
  border-color: #cfe2ff;
}

.collection-tag {
  background-color: #fff9eb;
  border-color: #ffecb5;
  color: #856404;
}

/* Description Section */
.product-description-section {
  padding: 2.5rem;
  background-color: #fafafa;
}

.product-description-section h2 {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  color: var(--color-text-main);
}

.description-text {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-text-main);
  max-width: 800px;
}

/* Related Products */
.related-section {
  margin-top: 4rem;
}

.related-section h2 {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: var(--color-text-main);
  text-align: left;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.load-more-container {
    margin-top: 3rem;
    display: flex;
    justify-content: center;
}

.load-more-btn {
    border: 1px solid var(--color-border);
    padding: 0.75rem 2.5rem;
    border-radius: 4px;
    background-color: white;
    font-size: 1rem;
    transition: all 0.2s;
}

.load-more-btn:hover {
    background-color: #f5f5f5;
}

/* Common states */
.loading-state, .error-state {
  padding: 10rem 0;
  text-align: center;
}

.spinner {
    border: 3px solid #f3f3f3;
    border-top: 3px solid var(--color-blue-primary);
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
    margin: 0 auto 1.5rem;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@media (max-width: 900px) {
  .product-main {
    grid-template-columns: 1fr;
    padding: 1.5rem;
  }
  
  .related-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
