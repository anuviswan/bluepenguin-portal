<script setup lang="ts"></script>

<template>
  <header class="header">
    <RouterLink to="/" class="logo-link">
      <div class="logo-container">
        <img src="@/assets/logo.png" alt="Blue Penguin Logo" class="logo-img" decoding="async" />
        <div class="brand">
          <span class="brand-name">Blue Penguin</span>
        </div>
      </div>
    </RouterLink>

    <nav class="nav">
      <RouterLink to="/" class="nav-link" exact-active-class="nav-link--active">Home</RouterLink>
      <RouterLink to="/shop" class="nav-link" active-class="nav-link--active">Shop</RouterLink>
      <RouterLink to="/our-story" class="nav-link" active-class="nav-link--active"
        >Our Story</RouterLink
      >
    </nav>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem var(--spacing-4xl);
  background-color: var(--color-bg-light);
  border-bottom: 1px solid var(--color-border);
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
  gap: var(--spacing-sm);
}

.logo-img {
  height: 48px;
  width: auto;
}

.brand {
  display: flex;
  align-items: center;
}

.brand-name {
  font-family: var(--font-family-display);
  font-size: 2rem;
  color: var(--color-blue-primary);
  font-weight: 700;
}

/* Nav */
.nav {
  display: flex;
  align-items: center;
  gap: var(--spacing-2xl);
}

.nav-link {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-text-light);
  text-decoration: none;
  padding-bottom: 2px;
  border-bottom: 2px solid transparent;
  transition:
    color 0.2s,
    border-color 0.2s;
}

.nav-link:hover {
  color: var(--color-text-main);
}

.nav-link--active {
  color: var(--color-blue-primary);
  border-bottom-color: var(--color-blue-primary);
}

@media (max-width: 600px) {
  .header {
    flex-direction: column;
    gap: var(--spacing-lg);
    padding: var(--spacing-lg);
  }
  .nav {
    gap: var(--spacing-xl);
  }
}
</style>
