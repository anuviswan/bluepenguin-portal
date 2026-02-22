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


const { formatted: price } = useCurrency(computed(() => currentProduct.value?.price || 0));
const { formatted: discountPrice } = useCurrency(computed(() => currentProduct.value?.discountPrice || 0));

const hasDiscount = computed(() => {
  const p = currentProduct.value;
  return !!p && !!p.discountPrice && p.discountPrice < p.price;
});

const discountPercentage = computed(() => {
  if (!hasDiscount.value || !currentProduct.value) return 0;
  return Math.round(((currentProduct.value.price - currentProduct.value.discountPrice!) / currentProduct.value.price) * 100);
});

const formattedExpiryDate = computed(() => {
  if (!currentProduct.value?.discountExpiryDate) return '';
  return new Date(currentProduct.value.discountExpiryDate).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
});

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
  const codes = currentProduct.value?.featureCodes;
  if (!codes) return [];
  if (Array.isArray(codes)) {
    return codes.map((code: string) => String(code).trim()).filter(Boolean);
  }
  if (typeof codes === 'string') {
    return (codes as string).split(',').map((code: string) => code.trim()).filter(Boolean);
  }
  return [];
});

const featureNames = computed(() => {
  return featureCodesArray.value.map((code: string) => {
    const feature = allFeatures.value.find(f => f.id === code);
    return feature ? feature.name : code;
  });
});

const materialName = computed(() => {
  if (!currentProduct.value?.material) return '';
  const mat = allMaterials.value.find(m => m.id === currentProduct.value?.material);
  return mat ? mat.name : currentProduct.value.material;
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


const whatsappLink = computed(() => {
  const phone = import.meta.env.VITE_WHATSAPP_CONTACT || '';
  const message = encodeURIComponent(`Hi, I'm interested in ${currentProduct.value?.productName} (SKU: ${currentProduct.value?.sku})`);
  return `https://wa.me/${phone}?text=${message}`;
});

const instagramLink = import.meta.env.VITE_INSTAGRAM_LINK || 'https://www.instagram.com/';

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
              <div v-if="hasDiscount" class="sale-badge">SALE -{{ discountPercentage }}%</div>
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
              <div v-if="hasDiscount" class="discount-container">
                <span class="price-large discount-price">{{ discountPrice }}</span>
                <span class="price-original">{{ price }}</span>
                <span class="discount-badge">SAVE {{ discountPercentage }}%</span>
              </div>
              <span v-else class="price-large">{{ price }}</span>

              <div v-if="hasDiscount && formattedExpiryDate" class="expiry-date">
                Offer ends {{ formattedExpiryDate }}
              </div>
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
              <a
                :href="whatsappLink"
                target="_blank"
                rel="noopener noreferrer"
                class="action-btn whatsapp-btn"
              >
                <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Order via Whatsapp
              </a>
              <a
                :href="instagramLink"
                target="_blank"
                rel="noopener noreferrer"
                class="action-btn instagram-btn"
              >
                <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                View In Instagram
              </a>
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
            <p>{{ currentProduct.description }}</p>
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
  position: relative;
}

.sale-badge {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    background-color: #e63946;
    color: white;
    padding: 0.4rem 1rem;
    font-size: 0.85rem;
    font-weight: 700;
    border-radius: 4px;
    z-index: 5;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
  padding-top: 1rem;
  padding-left: 1.5rem;
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
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.discount-container {
    display: flex;
    align-items: baseline;
    gap: 1rem;
    flex-wrap: wrap;
}

.discount-price {
    color: #e63946 !important;
}

.price-original {
    font-size: 1.25rem;
    color: var(--color-text-light);
    text-decoration: line-through;
    font-weight: 400;
}

.discount-badge {
    background-color: #fff1f2;
    color: #e63946;
    padding: 0.2rem 0.6rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 600;
    border: 1px solid #ffe4e6;
}

.expiry-date {
    font-size: 0.85rem;
    color: #e63946;
    font-weight: 500;
    margin-top: 0.25rem;
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
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.85rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
}

.btn-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.whatsapp-btn {
  background-color: #25D366;
  color: white;
}

.whatsapp-btn:hover {
  background-color: #1da851;
}

.instagram-btn {
  background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
  color: white;
}

.instagram-btn:hover {
  opacity: 0.9;
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
