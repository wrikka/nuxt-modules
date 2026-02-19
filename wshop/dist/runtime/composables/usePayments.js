import { ref } from "vue";
export const usePayments = () => {
  const providers = ref([]);
  const loading = ref(false);
  const fetchProviders = async () => {
    loading.value = true;
    try {
      const data = [
        {
          id: "stripe",
          name: "Stripe",
          connected: true,
          description: "Accept credit cards, debit cards, and popular payment methods."
        },
        {
          id: "paypal",
          name: "PayPal",
          connected: false,
          description: "Enable PayPal Checkout for your store."
        },
        {
          id: "cod",
          name: "Cash on Delivery",
          connected: true,
          description: "Accept cash on delivery for orders."
        }
      ];
      providers.value = data;
    } catch (error) {
      console.error("Failed to fetch payment providers:", error);
    } finally {
      loading.value = false;
    }
  };
  return {
    providers,
    loading,
    fetchProviders
  };
};
