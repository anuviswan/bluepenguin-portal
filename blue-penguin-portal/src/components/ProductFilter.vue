<script setup lang="ts">
import BaseCheckbox from './BaseCheckbox.vue';
import { useProductFilter } from '@/composables/useProductFilter';
import { computed } from 'vue';

import { ref, onMounted } from 'vue';
import CategoryService from '@/services/CategoryService';
import type { Category } from '@/types/Category';

const { filters, toggleFilter, clearFilters, getCount } = useProductFilter();

interface FilterOption {
  label: string;
  value: string;
  id?: string; // Optional ID for keying if needed
}

const categories = ref<FilterOption[]>([]);

onMounted(async () => {
    try {
        const data = await CategoryService.getAll();
        categories.value = data.map((c: Category) => ({ 
            label: c.name, 
            value: c.name,
            id: c.id 
        }));
    } catch (error) {
        console.error('Failed to fetch categories:', error);
    }
});

const materials: FilterOption[] = [
  { label: 'Bead-Based', value: 'Bead-Based' },
  { label: 'Resin-Based', value: 'Resin-Based' },
];

const features: FilterOption[] = [
  { label: 'Handmade', value: 'Handmade' },
  { label: 'Hypoallergenic', value: 'Hypoallergenic' },
  { label: 'Adjustable', value: 'Adjustable' },
];

const collections: FilterOption[] = [
    { label: 'Ocean Dreams', value: 'Ocean Dreams' }
];

// Computed checks for checked state
const isChecked = (group: keyof typeof filters, value: string) => filters[group].includes(value);

</script>

<template>
  <aside class="filters">
    <div class="header">
      <h2>Filters</h2>
    </div>

    <div class="filter-group">
      <h3>Category</h3>
      <BaseCheckbox 
        v-for="opt in categories" 
        :key="opt.value"
        :id="`cat-${opt.value}`"
        :label="opt.label"
        :count="getCount('category', opt.value)"
        :modelValue="isChecked('categories', opt.value)"
        @update:modelValue="toggleFilter('categories', opt.value)"
      />
    </div>

    <div class="filter-group">
      <h3>Raw Material</h3>
      <BaseCheckbox 
        v-for="opt in materials" 
        :key="opt.value"
         :id="`mat-${opt.value}`"
        :label="opt.label"
        :count="getCount('material', opt.value)"
        :modelValue="isChecked('materials', opt.value)"
        @update:modelValue="toggleFilter('materials', opt.value)"
      />
    </div>

    <div class="filter-group">
      <h3>Features</h3>
      <BaseCheckbox 
        v-for="opt in features" 
        :key="opt.value"
         :id="`feat-${opt.value}`"
        :label="opt.label"
        :modelValue="isChecked('features', opt.value)"
        @update:modelValue="toggleFilter('features', opt.value)"
      />
    </div>

    <div class="filter-group">
      <h3>Collection</h3>
      <BaseCheckbox 
        v-for="opt in collections" 
        :key="opt.value"
         :id="`col-${opt.value}`"
        :label="opt.label"
        :modelValue="isChecked('collections', opt.value)"
        @update:modelValue="toggleFilter('collections', opt.value)"
      />
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
