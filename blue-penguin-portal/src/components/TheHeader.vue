<script setup lang="ts">
import { ref } from 'vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}
</script>

<template>
  <header class="header">
    <RouterLink to="/" class="logo-link" @click="closeMenu">
      <div class="logo-container">
        <img src="@/assets/logo.png" alt="Blue Penguin Logo" class="logo-img" decoding="async" />
        <div class="brand">
          <span class="brand-name">Blue Penguin</span>
        </div>
      </div>
    </RouterLink>

    <button
      class="menu-toggle"
      @click="toggleMenu"
      :aria-expanded="isMenuOpen"
      aria-label="Toggle navigation menu"
    >
      <span class="menu-bar" :class="{ 'menu-bar--open': isMenuOpen }"></span>
      <span class="menu-bar" :class="{ 'menu-bar--open': isMenuOpen }"></span>
      <span class="menu-bar" :class="{ 'menu-bar--open': isMenuOpen }"></span>
    </button>

    <div class="nav-overlay" :class="{ 'nav-overlay--open': isMenuOpen }" @click="closeMenu"></div>

    <nav class="nav" :class="{ 'nav--open': isMenuOpen }">
      <RouterLink to="/" class="nav-link" exact-active-class="nav-link--active" @click="closeMenu"
        >Home</RouterLink
      >
      <RouterLink to="/shop" class="nav-link" active-class="nav-link--active" @click="closeMenu"
        >Shop</RouterLink
      >
      <RouterLink
        to="/our-story"
        class="nav-link"
        active-class="nav-link--active"
        @click="closeMenu"
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
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo-link {
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s;
  z-index: 101;
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
  font-family: 'Yeseva One', serif;
  font-size: 2rem;
  color: var(--color-blue-primary);
  font-weight: 500;
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

/* Menu Toggle */
.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 111;
}

.menu-bar {
  width: 100%;
  height: 3px;
  background-color: var(--color-blue-primary);
  border-radius: 10px;
  transition: all 0.3s ease-in-out;
}

.nav-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  z-index: 105;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

@media (max-width: 768px) {
  .header {
    padding: 1rem var(--spacing-xl);
  }

  .menu-toggle {
    display: flex;
  }

  .menu-bar--open:nth-child(1) {
    transform: translateY(9px) rotate(45deg);
  }

  .menu-bar--open:nth-child(2) {
    opacity: 0;
    transform: translateX(-20px);
  }

  .menu-bar--open:nth-child(3) {
    transform: translateY(-9px) rotate(-45deg);
  }

  .nav {
    position: fixed;
    top: 0;
    right: -100%;
    width: 280px;
    height: 100vh;
    background-color: var(--color-white);
    flex-direction: column;
    padding: var(--spacing-10xl) var(--spacing-2xl);
    gap: var(--spacing-3xl);
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
    transition: right 0.3s ease-in-out;
    z-index: 110;
  }

  .nav--open {
    right: 0;
  }

  .nav-overlay--open {
    display: block;
    opacity: 1;
    pointer-events: auto;
  }

  .nav-link {
    font-size: 1.2rem;
    width: 100%;
    text-align: center;
    padding: var(--spacing-sm) 0;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 0.75rem var(--spacing-lg);
  }

  .brand-name {
    font-size: 1.5rem;
  }

  .logo-img {
    height: 36px;
  }
}
</style>
