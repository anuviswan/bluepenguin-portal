<script setup lang="ts">
</script>



<template>
  <header class="header">
    <div class="logo-container">
       <img src="/images/penguin-logo.png" alt="Blue Penguin Logo" class="logo-img" /> 
       <div class="brand">
         <span class="brand-name">Blue Penguin</span>
       </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: center;
  padding: 2rem 0;
  background-color: var(--color-bg-light); 
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
