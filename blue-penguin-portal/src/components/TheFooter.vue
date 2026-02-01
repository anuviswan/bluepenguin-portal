<script setup lang="ts">
</script>

<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="section">
        <h3>About Us</h3>
        <p>Our Story</p>
        <p>Craftsmanship</p>
      </div>
      <div class="section">
        <h3>Contact</h3>
        <p>Email: info@bluepenguin.com</p>
      </div>
      <div class="section">
        <h3>Follow Us</h3>
        <div class="social-icons">
             <!-- Placeholders for icons -->
            <span class="icon">📘</span>
            <span class="icon">📷</span>
            <span class="icon">🅿️</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--color-bg-light);
  padding: 3rem 0;
  border-top: 1px solid var(--color-border);
  margin-top: 4rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  padding: 0 2rem;
}

.section h3 {
  color: var(--color-blue-primary); /* Or darker text */
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: #4A5568; 
  /* Design seems to have dark text headings */
}

.section p {
  color: var(--color-text-main);
  margin-bottom: 0.5rem;
  cursor: pointer;
}

.social-icons {
  display: flex;
  gap: 1rem;
}

.icon {
  font-size: 1.5rem;
  cursor: pointer;
}
</style>
