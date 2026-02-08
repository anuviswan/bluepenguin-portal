<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue';
import BaseCheckbox from './BaseCheckbox.vue';
import { useProductFilter } from '@/composables/useProductFilter';
import { useMetadataStore } from '@/stores/metadata';
import { storeToRefs } from 'pinia';
import type { Category } from '@/types/Category';
import type { Material } from '@/types/Material';
import type { Collection } from '@/types/Collection';
import type { Feature } from '@/types/Feature';

const { filters, toggleFilter, clearFilters } = useProductFilter();
const metadataStore = useMetadataStore();
const { categories: rawCategories, materials: rawMaterials, collections: rawCollections, features: rawFeatures } = storeToRefs(metadataStore);


interface FilterOption {
  label: string;
  value: string;
}

const categories = computed<FilterOption[]>(() => rawCategories.value.map((c: Category) => ({ 
    label: c.name, 
    value: c.id
})));

const materials = computed<FilterOption[]>(() => rawMaterials.value.map((m: Material) => ({
    label: m.name,
    value: m.id
})));

const collections = computed<FilterOption[]>(() => rawCollections.value.map((c: Collection) => ({
    label: c.name,
    value: c.id
})));

const features = computed<FilterOption[]>(() => rawFeatures.value.map((f: Feature) => ({
    label: f.name,
    value: f.id
})));

onMounted(async () => {
    await metadataStore.fetchAll();
});





// Computed checks for checked state
const isChecked = (group: keyof typeof filters, value: string) => filters[group].includes(value);

const INITIAL_LIMIT = 5;

const expandedGroups = reactive({
  categories: false,
  materials: false,
  collections: false,
  features: false,
});

const toggleExpand = (group: keyof typeof expandedGroups) => {
  expandedGroups[group] = !expandedGroups[group];
};

const getDisplayedOptions = (options: FilterOption[], group: keyof typeof expandedGroups) => {
  if (expandedGroups[group]) return options;
  return options.slice(0, INITIAL_LIMIT);
};

</script>

<template>
  <aside class="filters">
    <div class="header">
      <h2>Filters</h2>
    </div>

    <div class="filter-group">
      <h3>Category</h3>
      <BaseCheckbox 
        v-for="opt in getDisplayedOptions(categories, 'categories')" 
        :key="opt.value"
        :id="`cat-${opt.value}`"
        :label="opt.label"
        :modelValue="isChecked('categories', opt.value)"
        @update:modelValue="toggleFilter('categories', opt.value)"
      />
      <button 
        v-if="categories.length > INITIAL_LIMIT" 
        class="toggle-more"
        @click="toggleExpand('categories')"
      >
        {{ expandedGroups.categories ? 'Show Less' : `+ ${categories.length - INITIAL_LIMIT} more` }}
      </button>
    </div>

    <div class="filter-group">
      <h3>Raw Material</h3>
      <BaseCheckbox 
        v-for="opt in getDisplayedOptions(materials, 'materials')" 
        :key="opt.value"
         :id="`mat-${opt.value}`"
        :label="opt.label"
        :modelValue="isChecked('materials', opt.value)"
        @update:modelValue="toggleFilter('materials', opt.value)"
      />
      <button 
        v-if="materials.length > INITIAL_LIMIT" 
        class="toggle-more"
        @click="toggleExpand('materials')"
      >
        {{ expandedGroups.materials ? 'Show Less' : `+ ${materials.length - INITIAL_LIMIT} more` }}
      </button>
    </div>

    <div class="filter-group">
      <h3>Features</h3>
      <BaseCheckbox 
        v-for="opt in getDisplayedOptions(features, 'features')" 
        :key="opt.value"
         :id="`feat-${opt.value}`"
        :label="opt.label"
        :modelValue="isChecked('features', opt.value)"
        @update:modelValue="toggleFilter('features', opt.value)"
      />
      <button 
        v-if="features.length > INITIAL_LIMIT" 
        class="toggle-more"
        @click="toggleExpand('features')"
      >
        {{ expandedGroups.features ? 'Show Less' : `+ ${features.length - INITIAL_LIMIT} more` }}
      </button>
    </div>

    <div class="filter-group">
      <h3>Collection</h3>
      <BaseCheckbox 
        v-for="opt in getDisplayedOptions(collections, 'collections')" 
        :key="opt.value"
         :id="`col-${opt.value}`"
        :label="opt.label"
        :modelValue="isChecked('collections', opt.value)"
        @update:modelValue="toggleFilter('collections', opt.value)"
      />
      <button 
        v-if="collections.length > INITIAL_LIMIT" 
        class="toggle-more"
        @click="toggleExpand('collections')"
      >
        {{ expandedGroups.collections ? 'Show Less' : `+ ${collections.length - INITIAL_LIMIT} more` }}
      </button>
    </div>
    
     <div class="actions">
        <button class="clear-btn" @click="clearFilters">Clear Filters</button>
    </div>
  </aside>
</template>

<style scoped>
.filters {
  padding-right: 2rem;
  border-right: 1px solid var(--color-border);
  min-width: 200px;
}

.header {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--color-border);
}

.filter-group {
  margin-bottom: 2rem;
}

h2 {
    font-size: 1.1rem;
    color: var(--color-text-main);
}

h3 {
  font-size: 1rem;
  margin-bottom: 1rem;
  color: var(--color-blue-primary);
  font-weight: 600;
}

.actions {
    margin-top: 2rem;
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
    padding: 0.5rem;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background-color: white;
    font-size: 0.9rem;
    color: var(--color-text-light);
    transition: all 0.2s;
}

.clear-btn:hover {
    background-color: #f3f4f6;
    color: var(--color-text-main);
}
</style>
