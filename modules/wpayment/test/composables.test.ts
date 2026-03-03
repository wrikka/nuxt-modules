import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock Stripe
vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn(),
}));

// Mock Nuxt composables
vi.mock('#app', () => ({
  useRuntimeConfig: vi.fn(() => ({
    public: {
      stripe: {
        publishableKey: 'pk_test_1234567890',
        apiVersion: '2024-11-20.acacia',
        locale: 'auto',
        elementsOptions: {},
        confirmParams: {},
      },
    },
  })),
}));

describe('useStripe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with loading state', async () => {
    const { loadStripe } = await import('@stripe/stripe-js');
    const mockStripe = { confirmPayment: vi.fn() };
    (loadStripe as any).mockResolvedValue(mockStripe);

    const { useStripe } = await import('../src/runtime/composables/useStripe');
    const { loading, error, stripe } = useStripe();

    expect(loading.value).toBe(false);
    expect(error.value).toBe(null);
    expect(stripe.value).toBe(null);
  });

  it('should load Stripe instance', async () => {
    const { loadStripe } = await import('@stripe/stripe-js');
    const mockStripe = { confirmPayment: vi.fn() };
    (loadStripe as any).mockResolvedValue(mockStripe);

    const { useStripe } = await import('../src/runtime/composables/useStripe');
    const { initialize, stripe } = useStripe();

    await initialize();

    expect(loadStripe).toHaveBeenCalledWith(
      'pk_test_1234567890',
      {
        apiVersion: '2024-11-20.acacia',
        locale: 'auto',
      },
    );
    expect(stripe.value).toBe(mockStripe);
  });

  it('should handle initialization error', async () => {
    const { loadStripe } = await import('@stripe/stripe-js');
    const error = new Error('Failed to load Stripe');
    (loadStripe as any).mockRejectedValue(error);

    const { useStripe } = await import('../src/runtime/composables/useStripe');
    const { initialize, error: errorRef } = useStripe();

    await initialize();

    expect(errorRef.value).toBe('Failed to load Stripe');
  });

  it('should confirm payment successfully', async () => {
    const { loadStripe } = await import('@stripe/stripe-js');
    const mockStripe = {
      confirmPayment: vi.fn().mockResolvedValue({ paymentIntent: { id: 'pi_123' } }),
      elements: vi.fn().mockReturnValue({
        createElement: vi.fn(),
        mount: vi.fn(),
      }),
    };
    (loadStripe as any).mockResolvedValue(mockStripe);

    const { useStripe } = await import('../src/runtime/composables/useStripe');
    const { initialize, confirmPayment } = useStripe();

    await initialize();

    const result = await confirmPayment('cs_test_123');

    expect(mockStripe.confirmPayment).toHaveBeenCalledWith({
      elements: expect.any(Object),
      clientSecret: 'cs_test_123',
      confirmParams: {},
    });
    expect(result.paymentIntent.id).toBe('pi_123');
  });

  it('should handle payment confirmation error', async () => {
    const { loadStripe } = await import('@stripe/stripe-js');
    const mockStripe = {
      confirmPayment: vi.fn().mockRejectedValue(new Error('Payment failed')),
      elements: vi.fn().mockReturnValue({
        createElement: vi.fn(),
        mount: vi.fn(),
      }),
    };
    (loadStripe as any).mockResolvedValue(mockStripe);

    const { useStripe } = await import('../src/runtime/composables/useStripe');
    const { initialize, confirmPayment } = useStripe();

    await initialize();

    const result = await confirmPayment('cs_test_123');

    expect(result.error).toBeDefined();
    expect(result.error.message).toBe('Payment confirmation failed');
  });
});

describe('useStripeElements', () => {
  it('should create elements', async () => {
    const mockElements = {
      create: vi.fn().mockReturnValue({ mount: vi.fn() }),
      getElement: vi.fn(),
      update: vi.fn(),
      clear: vi.fn(),
    };

    const { useStripeElements } = await import('../src/runtime/composables/useStripeElements');
    const { createElement } = useStripeElements(mockElements as any);

    const element = createElement('card');

    expect(mockElements.create).toHaveBeenCalledWith('card', undefined);
    expect(element).toBeDefined();
  });

  it('should get existing element', async () => {
    const mockElement = { mount: vi.fn() };
    const mockElements = {
      create: vi.fn(),
      getElement: vi.fn().mockReturnValue(mockElement),
      update: vi.fn(),
      clear: vi.fn(),
    };

    const { useStripeElements } = await import('../src/runtime/composables/useStripeElements');
    const { getElement } = useStripeElements(mockElements as any);

    const element = getElement('card');

    expect(mockElements.getElement).toHaveBeenCalledWith('card');
    expect(element).toBe(mockElement);
  });

  it('should update elements', async () => {
    const mockElements = {
      create: vi.fn(),
      getElement: vi.fn(),
      update: vi.fn(),
      clear: vi.fn(),
    };

    const { useStripeElements } = await import('../src/runtime/composables/useStripeElements');
    const { update } = useStripeElements(mockElements as any);

    const options = { appearance: { theme: 'night' } };
    update(options);

    expect(mockElements.update).toHaveBeenCalledWith(options);
  });

  it('should clear elements', async () => {
    const mockElements = {
      create: vi.fn(),
      getElement: vi.fn(),
      update: vi.fn(),
      clear: vi.fn(),
    };

    const { useStripeElements } = await import('../src/runtime/composables/useStripeElements');
    const { clear } = useStripeElements(mockElements as any);

    clear();

    expect(mockElements.clear).toHaveBeenCalled();
  });
});
