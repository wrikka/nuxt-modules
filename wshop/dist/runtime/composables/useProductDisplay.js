import { computed, ref, watch } from "vue";
export function useProductDisplay(product) {
  const selectedOptions = ref({});
  watch(product, (newProduct) => {
    if (newProduct?.options) {
      selectedOptions.value = newProduct.options.reduce(
        (acc, opt) => {
          acc[opt.name] = opt.values[0]?.value ?? "";
          return acc;
        },
        {}
      );
    }
  }, { immediate: true });
  const selectedVariant = computed(() => {
    if (!product.value?.variants || Object.keys(selectedOptions.value).length === 0) {
      return product.value?.variants?.length === 1 && product.value?.options?.length === 0 ? product.value.variants[0] : void 0;
    }
    return product.value.variants.find(
      (v) => JSON.stringify(v.options) === JSON.stringify(selectedOptions.value)
    );
  });
  const displayedPrice = computed(() => selectedVariant.value?.price || product.value?.price || 0);
  const displayedImage = computed(() => {
    const variantImage = product.value?.images?.find(
      (img) => img.id === selectedVariant.value?.imageId
    );
    return variantImage?.src || product.value?.images?.[0]?.src || "/placeholder.svg";
  });
  return {
    selectedOptions,
    selectedVariant,
    displayedPrice,
    displayedImage
  };
}
