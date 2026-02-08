import { computed, type Ref, unref } from 'vue';

export function useCurrency(amount: Ref<number> | number, currencyCode = 'INR') {
  const formatted = computed(() => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(unref(amount));
  });

  return {
    formatted,
  };
}
