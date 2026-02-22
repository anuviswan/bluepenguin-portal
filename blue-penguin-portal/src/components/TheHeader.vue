<script setup lang="ts">
</script>



<template>
  <header class="header">
    <RouterLink to="/" class="logo-link">
      <div class="logo-container">
         <img src="/images/penguin-logo.png" alt="Blue Penguin Logo" class="logo-img" /> 
         <div class="brand">
           <span class="brand-name">Blue Penguin</span>
         </div>
      </div>
    </RouterLink>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
  background-color: var(--color-bg-light); 
}

.logo-link {
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s;
}

.logo-link:hover {
  opacity: 0.8;
}

.logo-container {
    display: flex;
    align-items: center;
    gap: 15px;
}

.logo-img {
    height: 60px; /* Restricting height to prevent oversized logo */
    width: auto;
}

.brand {
  display: flex;
  align-items: center;
}

.brand-name {
  font-family: var(--font-family-display);
  font-size: 2.5rem;
  color: var(--color-blue-primary);
  font-weight: 700; 
}
</style>
