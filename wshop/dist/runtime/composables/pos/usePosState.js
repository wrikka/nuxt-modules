import { computed, ref } from "vue";
import { useSettings } from "~/composables/useSettings";
export function usePosState() {
  const categories = ref([]);
  const products = ref([]);
  const customers = ref([]);
  const selectedCustomer = ref(null);
  const loading = ref(false);
  const processing = ref(false);
  const error = ref(null);
  const registers = ref([]);
  const selectedRegister = ref(null);
  const paymentMethods = ref([]);
  const selectedPaymentMethod = ref(null);
  const discount = ref(0);
  const { settings } = useSettings();
  const tax = computed(() => subtotal.value * (settings.value.taxRate || 0) / 100);
  return {
    categories,
    products,
    customers,
    selectedCustomer,
    loading,
    processing,
    error,
    registers,
    selectedRegister,
    paymentMethods,
    selectedPaymentMethod,
    discount,
    tax
  };
}
