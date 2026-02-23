<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import heroImage from '@/assets/images/hero-image.png';
import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';
import ShowcaseGrid from '@/components/ShowcaseGrid.vue';
import ShowcaseService from '@/services/ShowcaseService';
import type { ShowcaseItem } from '@/types/ShowcaseItem';

// ── Env vars ──────────────────────────────────────────────────────────────────
const whatsappNumber = import.meta.env.VITE_WHATSAPP_CONTACT || '';
const instagramLink  = import.meta.env.VITE_INSTAGRAM_LINK || 'https://www.instagram.com/';

const whatsappLink = computed(() =>
  whatsappNumber ? `https://wa.me/${whatsappNumber}` : 'https://wa.me/'
);

const router = useRouter();

// ── Top Categories ─────────────────────────────────────────────────────────────
const categories  = ref<ShowcaseItem[]>([]);
const catLoading  = ref(true);
const catError    = ref<string | null>(null);

onMounted(async () => {
  try {
    categories.value = await ShowcaseService.getTopCategories(4);
  } catch {
    catError.value = 'Could not load categories at this time.';
  } finally {
    catLoading.value = false;
  }
});

function onCategoryClick(item: { id: string }) {
  router.push({ path: '/shop', query: { category: item.id } });
}
</script>

<template>
  <div class="landing-layout">
    <TheHeader />

    <!-- ── Hero ─────────────────────────────────────────────────────────────── -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-heading">Handcrafted Jewelry,<br />Full of Color</h1>
        <p class="hero-sub">
          Discover bright, unique accessories<br />designed to bring a splash of joy to your day.
        </p>
        <div class="hero-ctas">
          <a :href="instagramLink" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
            Order via Instagram
          </a>
          <a :href="whatsappLink" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat on WhatsApp
          </a>
        </div>
      </div>
      <div class="hero-image-area">
        <img :src="heroImage" alt="Colorful handcrafted jewelry" class="hero-img" />
      </div>
    </section>

    <!-- ── Main content wrapper ───────────────────────────────────────────── -->
    <div class="page-content">

      <!-- ── Categories (generic ShowcaseGrid) ─────────────────────────────── -->
      <ShowcaseGrid
        title="Categories"
        :items="categories"
        :loading="catLoading"
        :error="catError"
        @item-click="onCategoryClick"
      />

      <!-- ── Our Story ──────────────────────────────────────────────────────── -->
      <section class="story-section">
        <h2 class="story-title">Our Story</h2>
        <p class="story-text">
          At Blue Penguin, we believe in spreading happiness through handcrafted jewelry
          that's as unique as you are. Each piece is made with love, featuring vibrant,
          high-quality beads assembled to brighten your day. We're a small team dedicated
          to creating colorful joy, one bracelet at a time.
        </p>
        <RouterLink to="/our-story" class="story-link">Read Our Story →</RouterLink>
      </section>

      <!-- ── How It Works ──────────────────────────────────────────────────── -->
      <section class="hiw-section">
        <h2 class="hiw-title">How It Works</h2>
        <div class="hiw-steps">
          <!-- Step 1 -->
          <div class="hiw-step">
            <div class="hiw-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </div>
            <div class="hiw-text">
              <span class="hiw-main">Browse</span>
              <span class="hiw-sub">our <strong>collection</strong></span>
            </div>
          </div>

          <div class="hiw-arrow" aria-hidden="true">→</div>

          <!-- Step 2 -->
          <div class="hiw-step">
            <div class="hiw-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div class="hiw-text">
              <span class="hiw-main">Message us</span>
              <span class="hiw-sub">with product code</span>
            </div>
          </div>

          <div class="hiw-arrow" aria-hidden="true">→</div>

          <!-- Step 3 -->
          <div class="hiw-step">
            <div class="hiw-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
                <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
            </div>
            <div class="hiw-text">
              <span class="hiw-main">We craft</span>
              <span class="hiw-sub">&amp; deliver</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Browse All CTA ─────────────────────────────────────────────────── -->
      <div class="browse-all-wrapper">
        <RouterLink to="/shop" class="browse-all-btn">Browse All ›</RouterLink>
      </div>

    </div><!-- /page-content -->

    <TheFooter />
  </div>
</template>

<style scoped>
/* ── Layout ─────────────────────────────────────────────────────────────────── */
.landing-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg-light);
}

.page-content {
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem 3rem;
}

/* ── Hero ────────────────────────────────────────────────────────────────────── */
.hero {
  display: flex;
  align-items: stretch;
  min-height: 420px;
  background: linear-gradient(120deg, #f7ede8 0%, #f2e4da 60%, #e8d8cc 100%);
  overflow: hidden;
  position: relative;
}

.hero-content {
  flex: 0 0 48%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4rem 3.5rem 4rem 5rem;
  z-index: 1;
}

.hero-heading {
  font-family: var(--font-family-body);
  font-size: clamp(2rem, 3.5vw, 3rem);
  font-weight: 700;
  color: #2d2420;
  line-height: 1.15;
  margin-bottom: 1rem;
}

.hero-sub {
  font-size: 1rem;
  color: #5a4a42;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.hero-ctas {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.4rem;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
}

.btn-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.btn-primary {
  background-color: #7a5c4e;
  color: #fff;
}
.btn-primary:hover {
  background-color: #5e4039;
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: transparent;
  color: #5a4a42;
  border: 1.5px solid rgba(90, 74, 66, 0.45);
}
.btn-secondary:hover {
  background-color: rgba(90, 74, 66, 0.08);
  transform: translateY(-1px);
}

.hero-image-area {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #e8d5c8 0%, #d4bfb0 50%, #c4a898 100%);
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

/* ── Our Story ───────────────────────────────────────────────────────────────── */
.story-section {
  padding: 3rem 0 2rem;
  text-align: center;
  max-width: 680px;
  margin: 0 auto;
}

.story-title {
  font-family: var(--font-family-display);
  font-size: 2.2rem;
  color: #8b5e52;
  font-weight: 400;
  margin-bottom: 1.25rem;
}

.story-text {
  color: var(--color-text-light);
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
}

.story-link {
  font-size: 0.95rem;
  font-weight: 500;
  color: #7a5c4e;
  transition: color 0.2s;
}
.story-link:hover {
  color: #5e4039;
}

/* ── How It Works ────────────────────────────────────────────────────────────── */
.hiw-section {
  padding: 3rem 0 2rem;
}

.hiw-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-text-main);
  margin-bottom: 2.5rem;
  letter-spacing: 0.01em;
}

.hiw-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  background-color: #f5edea;
  border-radius: 16px;
  padding: 2rem 2.5rem;
}

.hiw-step {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 0;
}

.hiw-icon {
  width: 52px;
  height: 52px;
  background-color: #e8d8d0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #7a5c4e;
}

.hiw-icon svg {
  width: 26px;
  height: 26px;
}

.hiw-text {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.hiw-main {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--color-text-main);
}

.hiw-sub {
  font-size: 0.9rem;
  color: var(--color-text-light);
}

.hiw-arrow {
  font-size: 1.4rem;
  color: #b09a91;
  padding: 0 1.5rem;
  flex-shrink: 0;
}

/* ── Browse All ──────────────────────────────────────────────────────────────── */
.browse-all-wrapper {
  display: flex;
  justify-content: center;
  padding: 2.5rem 0 1rem;
}

.browse-all-btn {
  display: inline-block;
  padding: 0.85rem 3rem;
  border-radius: 8px;
  background-color: #e8dbd5;
  color: #4a3830;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  letter-spacing: 0.02em;
}

.browse-all-btn:hover {
  background-color: #d9c8c0;
  transform: translateY(-1px);
}

/* ── Responsive ──────────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    min-height: auto;
  }

  .hero-content {
    flex: none;
    padding: 2.5rem 2rem;
  }

  .hero-image-area {
    height: 260px;
  }

  .page-content {
    padding: 0 1rem 2rem;
  }

  .hiw-steps {
    flex-direction: column;
    gap: 1.25rem;
    padding: 1.5rem;
  }

  .hiw-arrow {
    transform: rotate(90deg);
    padding: 0;
  }

  .hiw-step {
    width: 100%;
  }

  .story-section {
    padding: 2rem 0;
  }
}
</style>
