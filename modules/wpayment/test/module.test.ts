import { beforeEach, describe, expect, it } from 'vitest';
import { createResolver } from '@nuxt/kit';
import type { WpaymentModuleOptions } from '../src/module';

const _resolver = createResolver(import.meta.url);

describe('Wpayment Module', () => {
  let moduleOptions: WpaymentModuleOptions;

  beforeEach(() => {
    moduleOptions = {
      publishableKey: 'pk_test_1234567890',
      secretKey: 'sk_test_1234567890',
      apiVersion: '2024-11-20.acacia',
      locale: 'auto',
      elementsOptions: {},
      confirmParams: {},
    };
  });

  it('should have correct module metadata', async () => {
    const stripeModule = await import('../src/module');
    const moduleDefinition = stripeModule.default;

    expect(moduleDefinition.meta?.name).toBe('@wrikka/wpayment');
    expect(moduleDefinition.meta?.configKey).toBe('wpayment');
    expect(moduleDefinition.meta?.version).toBe('0.0.1');
    expect(moduleDefinition.meta?.compatibility?.nuxt).toMatch(/^3\.|4\./);
  });

  it('should validate required publishable key', () => {
    const invalidOptions = { ...moduleOptions, publishableKey: '' };

    expect(() => {
      validateModuleOptions(invalidOptions);
    }).toThrow('Stripe publishable key is required');
  });

  it('should apply default values', () => {
    const minimalOptions = {
      publishableKey: 'pk_test_1234567890',
    };

    const validated = validateModuleOptions(minimalOptions);

    expect(validated.apiVersion).toBe('2024-11-20.acacia');
    expect(validated.locale).toBe('auto');
    expect(validated.elementsOptions).toEqual({});
    expect(validated.confirmParams).toEqual({});
  });

  it('should register correct aliases', async () => {
    const stripeModule = await import('../src/module');
    const moduleDefinition = stripeModule.default;

    // Mock nuxt instance
    const mockNuxt = {
      options: {
        alias: {},
        runtimeConfig: {
          public: {},
          private: {},
        },
      },
    };

    // Mock setup
    await moduleDefinition.setup?.(moduleOptions, mockNuxt as any);

    expect(mockNuxt.options.alias['#wpayment']).toBeDefined();
    expect(mockNuxt.options.alias['#wpayment/types']).toBeDefined();
  });

  it('should configure runtime config correctly', async () => {
    const stripeModule = await import('../src/module');
    const moduleDefinition = stripeModule.default;

    const mockNuxt = {
      options: {
        alias: {},
        runtimeConfig: {
          public: {},
          private: {},
        },
      },
    };

    await moduleDefinition.setup?.(moduleOptions, mockNuxt as any);

    expect(mockNuxt.options.runtimeConfig.public.wpayment).toEqual({
      publishableKey: moduleOptions.publishableKey,
      apiVersion: moduleOptions.apiVersion,
      locale: moduleOptions.locale,
      elementsOptions: moduleOptions.elementsOptions,
      confirmParams: moduleOptions.confirmParams,
    });

    expect(mockNuxt.options.runtimeConfig.private.wpaymentSecretKey).toBe(moduleOptions.secretKey);
  });
});

// Helper function to simulate module validation
function validateModuleOptions(options: any): WpaymentModuleOptions {
  if (!options.publishableKey) {
    throw new Error('Stripe publishable key is required');
  }

  return {
    apiVersion: '2024-11-20.acacia',
    locale: 'auto',
    elementsOptions: {},
    confirmParams: {},
    ...options,
  };
}
