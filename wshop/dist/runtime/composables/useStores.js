import { ref } from "vue";
export const useStores = () => {
  const stores = ref([]);
  const store = ref(null);
  const loading = ref(false);
  const fetchStores = async () => {
    loading.value = true;
    try {
      const mockAddress = {
        id: 1,
        customerId: 1,
        type: "shipping",
        firstName: "Wrikka",
        lastName: "Store",
        addressLine1: "123 Main St",
        city: "Bangkok",
        state: "Bangkok",
        postalCode: "10110",
        country: "Thailand",
        isDefault: true,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      stores.value = [
        {
          id: "1",
          name: "Main Branch",
          url: "main.wrikka.com",
          currency: "THB",
          address: mockAddress,
          phone: "02-123-4567",
          email: "main@wrikka.com",
          managerId: "101",
          isActive: true,
          timezone: "Asia/Bangkok",
          taxRate: 0.07,
          operatingHours: {},
          // Mocked for simplicity
          settings: {},
          // Mocked for simplicity
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        }
      ];
    } catch (error) {
      console.error("Failed to fetch stores:", error);
    } finally {
      loading.value = false;
    }
  };
  const fetchStore = async (id) => {
    loading.value = true;
    try {
      const foundStore = stores.value.find((s) => s.id === id.toString());
      store.value = foundStore || null;
    } catch (error) {
      console.error(`Failed to fetch store ${id}:`, error);
    } finally {
      loading.value = false;
    }
  };
  return {
    stores,
    store,
    loading,
    fetchStores,
    fetchStore
  };
};
