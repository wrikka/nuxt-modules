import { vi } from 'vitest';

// Mock Vue's reactive and readonly
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue');
  return {
    ...actual,
    // Add any specific mocks if needed
  };
});

// Mock @stripe/stripe-js
vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn(),
}));

// Mock Nuxt app composables
vi.mock('#app', () => ({
  useRuntimeConfig: vi.fn(() => ({
    public: {
      stripe: {
        publishableKey: 'pk_test_1234567890abcdef',
        apiVersion: '2024-11-20.acacia',
        locale: 'auto',
        elementsOptions: {},
        confirmParams: {},
      },
    },
    private: {
      stripeSecretKey: 'sk_test_1234567890abcdef',
    },
  })),
}));

// Global test setup
global.console = {
  ...console,
  // Suppress console.log in tests unless needed
  log: vi.fn(),
  // Keep error and warn for debugging
  error: console.error,
  warn: console.warn,
};
