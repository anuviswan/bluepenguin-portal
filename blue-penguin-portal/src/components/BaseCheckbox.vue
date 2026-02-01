<script setup lang="ts">
defineProps<{
  id: string;
  label: string;
  modelValue: boolean;
  count?: number;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();
</script>

<template>
  <div class="checkbox-wrapper">
    <input 
      type="checkbox" 
      :id="id" 
      :checked="modelValue"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <label :for="id">
      {{ label }} <span v-if="count !== undefined" class="count">({{ count }})</span>
    </label>
  </div>
</template>

<style scoped>
.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  cursor: pointer;
}

input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: var(--color-blue-primary);
}

label {
  cursor: pointer;
  font-size: 0.95rem;
  color: var(--color-text-main);
}

.count {
  color: var(--color-text-light);
  font-size: 0.9rem;
}
</style>
