import { readonly, ref } from 'vue';
import type {
  CreatePriceParams,
  CreateProductParams,
  PriceDetails,
  ProductDetails,
  UpdatePriceParams,
  UpdateProductParams,
  UsePriceReturn,
  UseProductReturn,
} from '#wpayment/types';

export function usePrice(): UsePriceReturn {
  const price = ref<PriceDetails | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const create = async (params: CreatePriceParams): Promise<PriceDetails> => {
    loading.value = true;
    error.value = null;
    try {
      const result = await $fetch<PriceDetails>('/api/stripe/price', { method: 'POST', body: params });
      price.value = result;
      return result;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create price';
      throw new Error(error.value);
    } finally {
      loading.value = false;
    }
  };

  const retrieve = async (priceId: string): Promise<PriceDetails> => {
    loading.value = true;
    try {
      const result = await $fetch<PriceDetails>(`/api/stripe/price/${priceId}`);
      price.value = result;
      return result;
    } finally {
      loading.value = false;
    }
  };

  const update = async (params: UpdatePriceParams): Promise<PriceDetails> => {
    loading.value = true;
    try {
      const result = await $fetch<PriceDetails>(`/api/stripe/price/${params.priceId}`, {
        method: 'PATCH',
        body: params,
      });
      price.value = result;
      return result;
    } finally {
      loading.value = false;
    }
  };

  const list = async (productId?: string): Promise<PriceDetails[]> => {
    loading.value = true;
    try {
      return await $fetch<PriceDetails[]>('/api/stripe/prices', { query: { product: productId } });
    } finally {
      loading.value = false;
    }
  };

  const search = async (query: string): Promise<PriceDetails[]> => {
    loading.value = true;
    try {
      return await $fetch<PriceDetails[]>('/api/stripe/prices/search', { query: { q: query } });
    } finally {
      loading.value = false;
    }
  };

  return {
    price: readonly(price),
    loading: readonly(loading),
    error: readonly(error),
    create,
    retrieve,
    update,
    list,
    search,
  };
}

export function useProduct(): UseProductReturn {
  const product = ref<ProductDetails | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const create = async (params: CreateProductParams): Promise<ProductDetails> => {
    loading.value = true;
    error.value = null;
    try {
      const result = await $fetch<ProductDetails>('/api/stripe/product', { method: 'POST', body: params });
      product.value = result;
      return result;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create product';
      throw new Error(error.value);
    } finally {
      loading.value = false;
    }
  };

  const retrieve = async (productId: string): Promise<ProductDetails> => {
    loading.value = true;
    try {
      const result = await $fetch<ProductDetails>(`/api/stripe/product/${productId}`);
      product.value = result;
      return result;
    } finally {
      loading.value = false;
    }
  };

  const update = async (params: UpdateProductParams): Promise<ProductDetails> => {
    loading.value = true;
    try {
      const result = await $fetch<ProductDetails>(`/api/stripe/product/${params.productId}`, {
        method: 'PATCH',
        body: params,
      });
      product.value = result;
      return result;
    } finally {
      loading.value = false;
    }
  };

  const deleteProduct = async (productId: string): Promise<void> => {
    loading.value = true;
    try {
      await $fetch(`/api/stripe/product/${productId}`, { method: 'DELETE' });
    } finally {
      loading.value = false;
    }
  };

  const list = async (params?: any): Promise<ProductDetails[]> => {
    loading.value = true;
    try {
      return await $fetch<ProductDetails[]>('/api/stripe/products', { query: params });
    } finally {
      loading.value = false;
    }
  };

  const search = async (query: string): Promise<ProductDetails[]> => {
    loading.value = true;
    try {
      return await $fetch<ProductDetails[]>('/api/stripe/products/search', { query: { q: query } });
    } finally {
      loading.value = false;
    }
  };

  return {
    product: readonly(product),
    loading: readonly(loading),
    error: readonly(error),
    create,
    retrieve,
    update,
    delete: deleteProduct,
    list,
    search,
  };
}
