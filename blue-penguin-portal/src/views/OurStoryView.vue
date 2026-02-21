<script setup lang="ts">
import TheHeader from '@/components/TheHeader.vue';
import TheFooter from '@/components/TheFooter.vue';
</script>

<template>
  <div class="our-story-page">
    <TheHeader />
    
    <main class="story-container">
      <div class="story-content">
        <header class="story-header">
          <span class="subtitle">Since the beginning</span>
          <h1 class="display-title">Our Story</h1>
        </header>

        <section class="story-segment intro">
          <p class="lead-text">
            Long before it was a brand, <span class="brand-name">Blue Penguin</span> was just an idea—an image that wouldn’t let go. 
            Imagine the world’s smallest penguin, the little blue penguin, waddling along the coastlines of New Zealand. 
            It isn’t the tallest or the loudest, yet it thrives with quiet resilience, rare charm, and a wonder that lingers in the heart.
          </p>
        </section>

        <div class="divider">
          <div class="dot"></div>
        </div>

        <section class="story-segment body">
          <p>
            That spirit spoke to us. We didn’t set out to be the biggest or the boldest—we set out to create treasures 
            that feel rare, meaningful, and personal, much like spotting a blue penguin in the wild. 
            Each piece carries the same promise: <span class="highlight">strength in gentleness</span>, 
            <span class="highlight">beauty in simplicity</span>, and <span class="highlight">joy in the smallest details</span>.
          </p>
        </section>

        <section class="story-segment conclusion">
          <div class="quote-block">
            <p>
              Blue Penguin became more than a name—it became a way of creating. 
              A reminder that small things matter, that patience shapes beauty, and that the quietest voices often leave the deepest echoes. 
              With every design, we celebrate resilience, uniqueness, and the wonder hidden in everyday moments.
            </p>
          </div>
        </section>
      </div>
    </main>

    <TheFooter />
  </div>
</template>

<style scoped>
.our-story-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-white);
  color: var(--color-text-main);
}

.story-container {
  flex: 1;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8rem 2rem;
}

.story-content {
  max-width: 800px;
  width: 100%;
  animation: fadeInDown 1.2s ease-out;
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.story-header {
  margin-bottom: 5rem;
  text-align: center;
}

.subtitle {
  text-transform: uppercase;
  letter-spacing: 0.3em;
  font-size: 0.75rem;
  color: var(--color-blue-light);
  display: block;
  margin-bottom: 1rem;
}

.display-title {
  font-family: var(--font-family-display);
  font-size: 5.5rem;
  color: var(--color-blue-primary);
  line-height: 0.9;
  margin: 0;
}

.story-segment {
  margin-bottom: 4rem;
}

.lead-text {
  font-size: 1.6rem;
  line-height: 1.5;
  font-weight: 300;
  color: var(--color-text-main);
  text-align: center;
}

.brand-name {
  color: var(--color-blue-primary);
  font-weight: 600;
}

.divider {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 4rem 0;
}

.dot {
  width: 6px;
  height: 6px;
  background-color: var(--color-blue-light);
  border-radius: 50%;
  opacity: 0.4;
}

.body {
  text-align: center;
  max-width: 700px;
  margin: 0 auto 4rem;
}

.body p {
  font-size: 1.2rem;
  line-height: 1.8;
  color: var(--color-text-light);
}

.highlight {
  color: var(--color-blue-primary);
  font-weight: 500;
}

.quote-block {
  padding: 4rem;
  background-color: var(--color-bg-light);
  border-radius: 2px;
  position: relative;
  text-align: center;
}

.quote-block p {
  font-size: 1.3rem;
  line-height: 1.7;
  font-style: italic;
  color: var(--color-blue-primary);
  margin: 0;
}

@media (max-width: 768px) {
  .display-title {
    font-size: 3.5rem;
  }
  
  .lead-text {
    font-size: 1.3rem;
  }
  
  .story-container {
    padding: 6rem 1.5rem;
  }
  
  .quote-block {
    padding: 2.5rem 1.5rem;
  }
}
</style>
