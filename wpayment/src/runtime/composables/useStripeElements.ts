import type { StripeElement, StripeElements } from '@stripe/stripe-js';
import { readonly, ref } from 'vue';

export function useStripeElements(elements?: StripeElements) {
  const stripeElements = ref<StripeElements | null>(elements || null);
  const error = ref<string | null>(null);

  const createElement = (type: string, options?: any): StripeElement | null => {
    if (!stripeElements.value) {
      error.value = 'Stripe Elements are not initialized';
      return null;
    }

    try {
      const element = stripeElements.value.create(type, options);
      return element;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create element';
      return null;
    }
  };

  const getElement = (type: string): StripeElement | null => {
    if (!stripeElements.value) {
      error.value = 'Stripe Elements are not initialized';
      return null;
    }

    try {
      const element = stripeElements.value.getElement(type);
      return element;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to get element';
      return null;
    }
  };

  const update = (options: any) => {
    if (!stripeElements.value) {
      error.value = 'Stripe Elements are not initialized';
      return;
    }

    try {
      stripeElements.value.update(options);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update elements';
    }
  };

  const clear = () => {
    if (!stripeElements.value) {
      error.value = 'Stripe Elements are not initialized';
      return;
    }

    try {
      stripeElements.value.clear();
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to clear elements';
    }
  };

  const focus = (type: string) => {
    const element = getElement(type);
    if (element) {
      element.focus();
    }
  };

  const blur = (type: string) => {
    const element = getElement(type);
    if (element) {
      element.blur();
    }
  };

  const destroy = (type: string) => {
    const element = getElement(type);
    if (element) {
      element.destroy();
    }
  };

  return {
    elements: readonly(stripeElements),
    error: readonly(error),
    createElement,
    getElement,
    update,
    clear,
    focus,
    blur,
    destroy,
  };
}
