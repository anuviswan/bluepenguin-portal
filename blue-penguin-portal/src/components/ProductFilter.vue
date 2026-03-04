<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import BaseCheckbox from './BaseCheckbox.vue'
import { useProductFilter } from '@/composables/useProductFilter'
import { useMetadataStore } from '@/stores/metadata'
import { storeToRefs } from 'pinia'
import type { Category } from '@/types/Category'
import type { Material } from '@/types/Material'
import type { Collection } from '@/types/Collection'
import type { Feature } from '@/types/Feature'

const { filters, toggleFilter, clearFilters } = useProductFilter()
const metadataStore = useMetadataStore()
const {
  categories: rawCategories,
  materials: rawMaterials,
  collections: rawCollections,
  features: rawFeatures,
} = storeToRefs(metadataStore)

const isMobileFilterOpen = ref(false)

interface FilterOption {
  label: string
  value: string
}

const categories = computed<FilterOption[]>(() =>
  rawCategories.value.map((c: Category) => ({
    label: c.name,
    value: c.id,
  })),
)

const materials = computed<FilterOption[]>(() =>
  rawMaterials.value.map((m: Material) => ({
    label: m.name,
    value: m.id,
  })),
)

const collections = computed<FilterOption[]>(() =>
  rawCollections.value.map((c: Collection) => ({
    label: c.name,
    value: c.id,
  })),
)

const features = computed<FilterOption[]>(() =>
  rawFeatures.value.map((f: Feature) => ({
    label: f.name,
    value: f.id,
  })),
)

onMounted(async () => {
  await metadataStore.fetchAll()
})

// Computed checks for checked state
const isChecked = (group: keyof typeof filters, value: string) => filters[group].includes(value)

const INITIAL_LIMIT = 5

const expandedGroups = reactive({
  categories: false,
  materials: false,
  collections: false,
  features: false,
})

const collapsedSections = reactive({
  categories: false,
  materials: false,
  collections: false,
  features: false,
})

const toggleExpand = (group: keyof typeof expandedGroups) => {
  expandedGroups[group] = !expandedGroups[group]
}

const toggleSection = (group: keyof typeof collapsedSections) => {
  collapsedSections[group] = !collapsedSections[group]
}

const getDisplayedOptions = (options: FilterOption[], group: keyof typeof expandedGroups) => {
  if (expandedGroups[group]) return options
  return options.slice(0, INITIAL_LIMIT)
}

const activeFilterCount = computed(() => {
  return Object.values(filters).reduce((acc, curr) => acc + curr.length, 0)
})

const getSelectedCount = (group: keyof typeof filters) => {
  return filters[group].length
}

onMounted(async () => {
  await metadataStore.fetchAll()
  // Default to collapsed on mobile (<= 768px)
  if (window.innerWidth <= 768) {
    collapsedSections.categories = true
    collapsedSections.materials = true
    collapsedSections.collections = true
    collapsedSections.features = true
  }
})
</script>

<template>
  <aside class="filters" :class="{ 'filters--mobile-open': isMobileFilterOpen }">
    <button class="mobile-toggle" @click="isMobileFilterOpen = !isMobileFilterOpen">
      <div class="mobile-toggle-left">
        <svg
          class="icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </svg>
        <span>{{ isMobileFilterOpen ? 'Hide Filters' : 'Show Filters' }}</span>
        <span v-if="activeFilterCount > 0" class="badge">{{ activeFilterCount }}</span>
      </div>
      <svg
        class="chevron"
        :class="{ 'chevron--open': isMobileFilterOpen }"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>

    <div class="filter-content">
      <div class="header">
        <h2>Filters</h2>
        <button v-if="activeFilterCount > 0" class="clear-link" @click="clearFilters">
          Clear All
        </button>
      </div>

      <!-- Categories -->
      <div class="filter-group" :class="{ 'filter-group--collapsed': collapsedSections.categories }">
        <button class="section-header" @click="toggleSection('categories')">
          <h3>Category</h3>
          <div class="section-header-right">
            <span v-if="getSelectedCount('categories') > 0" class="section-badge">
              {{ getSelectedCount('categories') }}
            </span>
            <svg class="section-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </button>
        <div class="section-content">
          <div class="options-grid">
            <BaseCheckbox
              v-for="opt in getDisplayedOptions(categories, 'categories')"
              :key="opt.value"
              :id="`cat-${opt.value}`"
              :label="opt.label"
              :modelValue="isChecked('categories', opt.value)"
              @update:modelValue="toggleFilter('categories', opt.value)"
            />
          </div>
          <button
            v-if="categories.length > INITIAL_LIMIT"
            class="toggle-more"
            @click="toggleExpand('categories')"
          >
            {{
              expandedGroups.categories ? 'Show Less' : `+ ${categories.length - INITIAL_LIMIT} more`
            }}
          </button>
        </div>
      </div>

      <!-- Raw Materials -->
      <div class="filter-group" :class="{ 'filter-group--collapsed': collapsedSections.materials }">
        <button class="section-header" @click="toggleSection('materials')">
          <h3>Raw Material</h3>
          <div class="section-header-right">
            <span v-if="getSelectedCount('materials') > 0" class="section-badge">{{
              getSelectedCount('materials')
            }}</span>
            <svg class="section-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </button>
        <div class="section-content">
          <div class="options-grid">
            <BaseCheckbox
              v-for="opt in getDisplayedOptions(materials, 'materials')"
              :key="opt.value"
              :id="`mat-${opt.value}`"
              :label="opt.label"
              :modelValue="isChecked('materials', opt.value)"
              @update:modelValue="toggleFilter('materials', opt.value)"
            />
          </div>
          <button
            v-if="materials.length > INITIAL_LIMIT"
            class="toggle-more"
            @click="toggleExpand('materials')"
          >
            {{
              expandedGroups.materials ? 'Show Less' : `+ ${materials.length - INITIAL_LIMIT} more`
            }}
          </button>
        </div>
      </div>

      <!-- Features -->
      <div class="filter-group" :class="{ 'filter-group--collapsed': collapsedSections.features }">
        <button class="section-header" @click="toggleSection('features')">
          <h3>Features</h3>
          <div class="section-header-right">
            <span v-if="getSelectedCount('features') > 0" class="section-badge">{{
              getSelectedCount('features')
            }}</span>
            <svg class="section-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </button>
        <div class="section-content">
          <div class="options-grid">
            <BaseCheckbox
              v-for="opt in getDisplayedOptions(features, 'features')"
              :key="opt.value"
              :id="`feat-${opt.value}`"
              :label="opt.label"
              :modelValue="isChecked('features', opt.value)"
              @update:modelValue="toggleFilter('features', opt.value)"
            />
          </div>
          <button
            v-if="features.length > INITIAL_LIMIT"
            class="toggle-more"
            @click="toggleExpand('features')"
          >
            {{ expandedGroups.features ? 'Show Less' : `+ ${features.length - INITIAL_LIMIT} more` }}
          </button>
        </div>
      </div>

      <!-- Collection -->
      <div
        class="filter-group"
        :class="{ 'filter-group--collapsed': collapsedSections.collections }"
      >
        <button class="section-header" @click="toggleSection('collections')">
          <h3>Collection</h3>
          <div class="section-header-right">
            <span v-if="getSelectedCount('collections') > 0" class="section-badge">{{
              getSelectedCount('collections')
            }}</span>
            <svg class="section-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </button>
        <div class="section-content">
          <div class="options-grid">
            <BaseCheckbox
              v-for="opt in getDisplayedOptions(collections, 'collections')"
              :key="opt.value"
              :id="`col-${opt.value}`"
              :label="opt.label"
              :modelValue="isChecked('collections', opt.value)"
              @update:modelValue="toggleFilter('collections', opt.value)"
            />
          </div>
          <button
            v-if="collections.length > INITIAL_LIMIT"
            class="toggle-more"
            @click="toggleExpand('collections')"
          >
            {{
              expandedGroups.collections ? 'Show Less' : `+ ${collections.length - INITIAL_LIMIT} more`
            }}
          </button>
        </div>
      </div>

      <div class="actions">
        <button class="clear-btn" @click="clearFilters">Clear Filters</button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.filters {
  padding-right: var(--spacing-2xl);
  border-right: 1px solid var(--color-border);
  min-width: 240px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-2xl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.clear-link {
  font-size: 0.85rem;
  color: var(--color-accent);
  font-weight: 500;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
}

.clear-link:hover {
  text-decoration: underline;
}

.mobile-toggle {
  display: none;
  width: 100%;
  padding: var(--spacing-lg);
  background-color: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-lg);
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mobile-toggle-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  font-weight: 600;
  color: var(--color-text-main);
}

.mobile-toggle .icon {
  width: 18px;
  height: 18px;
  color: var(--color-blue-primary);
}

.mobile-toggle .chevron {
  width: 20px;
  height: 20px;
  color: var(--color-text-light);
  stroke-width: 2.5;
  transition: transform 0.3s ease;
}

.chevron--open {
  transform: rotate(180deg);
}

.badge {
  background-color: var(--color-blue-primary);
  color: white;
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.filter-group {
  margin-bottom: var(--spacing-2xl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-bg-mute);
}

.filter-group:last-of-type {
  border-bottom: none;
}

.section-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: none;
  border: none;
  padding: var(--spacing-xs) 0;
  cursor: pointer;
  text-align: left;
}

.section-header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.section-badge {
  background-color: var(--color-bg-mute);
  color: var(--color-text-main);
  font-size: 0.7rem;
  padding: 1px 6px;
  border-radius: var(--radius-sm);
  font-weight: 600;
}

.section-chevron {
  width: 16px;
  height: 16px;
  color: var(--color-text-light);
  stroke-width: 2.5;
  transition: transform 0.3s ease;
  transform: rotate(180deg);
}

.filter-group--collapsed .section-chevron {
  transform: rotate(0);
}

.section-content {
  overflow: hidden;
  transition: all 0.3s ease;
  max-height: 1000px; /* Large enough for content */
  margin-top: var(--spacing-md);
}

.filter-group--collapsed .section-content {
  max-height: 0;
  margin-top: 0;
  opacity: 0;
}

.options-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

h2 {
  font-size: 1.1rem;
  color: var(--color-text-main);
}

h3 {
  font-size: 0.85rem;
  margin: 0;
  color: var(--color-blue-primary);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.actions {
  margin-top: var(--spacing-2xl);
  display: block;
}

.toggle-more {
  background: none;
  border: none;
  padding: 0;
  margin-top: 0.5rem;
  color: var(--color-blue-primary);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s;
}

.toggle-more:hover {
  color: var(--color-text-main);
  text-decoration: underline;
}

.clear-btn {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-bg-soft);
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-text-main);
  transition: all 0.2s;
}

.clear-btn:hover {
  background-color: var(--color-bg-mute);
}

@media (max-width: 768px) {
  .filters {
    padding-right: 0;
    border-right: none;
    min-width: 0;
    width: 100%;
  }

  .mobile-toggle {
    display: flex;
  }

  .filter-content {
    display: none;
    padding: var(--spacing-lg);
    background-color: var(--color-white);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    margin-bottom: var(--spacing-xl);
    box-shadow: var(--shadow-sm);
  }

  .filters--mobile-open .filter-content {
    display: block;
  }

  .header {
    display: none; /* Hide internal header on mobile as we have the toggle */
  }

  .filter-group {
    margin-bottom: var(--spacing-md);
    padding-bottom: var(--spacing-md);
  }

  .options-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-sm);
  }
}

@media (max-width: 480px) {
  .options-grid {
    grid-template-columns: 1fr;
  }
}
</style>
