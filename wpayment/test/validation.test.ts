import { describe, expect, it } from 'vitest';
import {
  isValidCurrency,
  isValidEmail,
  isValidPublishableKey,
  isValidSecretKey,
  isValidUrl,
  StripeValidationError,
  validateCheckoutSession,
  validateCustomer,
  validatePaymentIntent,
  validateStripeConfig,
  VALIDATION_ERRORS,
} from '../src/runtime/utils/validation';

describe('Validation', () => {
  describe('validateStripeConfig', () => {
    it('should validate valid config', () => {
      const config = {
        publishableKey: 'pk_test_1234567890abcdef',
        apiVersion: '2024-11-20.acacia',
        locale: 'en',
      };

      expect(() => validateStripeConfig(config)).not.toThrow();
    });

    it('should throw error for missing publishable key', () => {
      const config = {
        apiVersion: '2024-11-20.acacia',
      };

      expect(() => validateStripeConfig(config)).toThrow('Invalid Stripe configuration:');
    });

    it('should throw error for empty publishable key', () => {
      const config = {
        publishableKey: '',
      };

      expect(() => validateStripeConfig(config)).toThrow();
    });
  });

  describe('validatePaymentIntent', () => {
    it('should validate valid payment intent', () => {
      const data = {
        amount: 2000,
        currency: 'USD',
        customer: 'cus_123',
      };

      expect(() => validatePaymentIntent(data)).not.toThrow();
    });

    it('should throw error for invalid amount', () => {
      const data = {
        amount: 0,
        currency: 'USD',
      };

      expect(() => validatePaymentIntent(data)).toThrow('Invalid payment intent data:');
    });

    it('should throw error for invalid currency', () => {
      const data = {
        amount: 2000,
        currency: 'US',
      };

      expect(() => validatePaymentIntent(data)).toThrow();
    });
  });

  describe('validateCustomer', () => {
    it('should validate valid customer', () => {
      const data = {
        email: 'test@example.com',
        name: 'John Doe',
      };

      expect(() => validateCustomer(data)).not.toThrow();
    });

    it('should throw error for invalid email', () => {
      const data = {
        email: 'invalid-email',
      };

      expect(() => validateCustomer(data)).toThrow('Invalid customer data:');
    });

    it('should throw error for missing email', () => {
      const data = {
        name: 'John Doe',
      };

      expect(() => validateCustomer(data)).toThrow();
    });
  });

  describe('validateCheckoutSession', () => {
    it('should validate valid checkout session', () => {
      const data = {
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
        line_items: [
          {
            price_data: {
              currency: 'USD',
              product_data: {
                name: 'Test Product',
              },
              unit_amount: 2000,
            },
            quantity: 1,
          },
        ],
      };

      expect(() => validateCheckoutSession(data)).not.toThrow();
    });

    it('should throw error for invalid URLs', () => {
      const data = {
        success_url: 'invalid-url',
        cancel_url: 'https://example.com/cancel',
        line_items: [],
      };

      expect(() => validateCheckoutSession(data)).toThrow();
    });

    it('should throw error for empty line items', () => {
      const data = {
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
        line_items: [],
      };

      expect(() => validateCheckoutSession(data)).toThrow();
    });
  });

  describe('Helper functions', () => {
    describe('isValidPublishableKey', () => {
      it('should validate test publishable key', () => {
        expect(isValidPublishableKey('pk_test_1234567890abcdef')).toBe(true);
      });

      it('should validate live publishable key', () => {
        expect(isValidPublishableKey('pk_live_1234567890abcdef')).toBe(true);
      });

      it('should reject invalid publishable key', () => {
        expect(isValidPublishableKey('sk_test_1234567890abcdef')).toBe(false);
        expect(isValidPublishableKey('invalid')).toBe(false);
        expect(isValidPublishableKey('pk_test_too_short')).toBe(false);
      });
    });

    describe('isValidSecretKey', () => {
      it('should validate test secret key', () => {
        expect(isValidSecretKey('sk_test_1234567890abcdef')).toBe(true);
      });

      it('should validate live secret key', () => {
        expect(isValidSecretKey('sk_live_1234567890abcdef')).toBe(true);
      });

      it('should reject invalid secret key', () => {
        expect(isValidSecretKey('pk_test_1234567890abcdef')).toBe(false);
        expect(isValidSecretKey('invalid')).toBe(false);
        expect(isValidSecretKey('sk_test_too_short')).toBe(false);
      });
    });

    describe('isValidCurrency', () => {
      it('should validate 3-letter currency codes', () => {
        expect(isValidCurrency('USD')).toBe(true);
        expect(isValidCurrency('EUR')).toBe(true);
        expect(isValidCurrency('GBP')).toBe(true);
      });

      it('should reject invalid currency codes', () => {
        expect(isValidCurrency('US')).toBe(false);
        expect(isValidCurrency('USDD')).toBe(false);
        expect(isValidCurrency('usd')).toBe(false);
        expect(isValidCurrency('123')).toBe(false);
      });
    });

    describe('isValidEmail', () => {
      it('should validate valid emails', () => {
        expect(isValidEmail('test@example.com')).toBe(true);
        expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
        expect(isValidEmail('user123@test-domain.com')).toBe(true);
      });

      it('should reject invalid emails', () => {
        expect(isValidEmail('invalid-email')).toBe(false);
        expect(isValidEmail('@domain.com')).toBe(false);
        expect(isValidEmail('user@')).toBe(false);
        expect(isValidEmail('user@domain')).toBe(false);
        expect(isValidEmail('')).toBe(false);
      });
    });

    describe('isValidUrl', () => {
      it('should validate valid URLs', () => {
        expect(isValidUrl('https://example.com')).toBe(true);
        expect(isValidUrl('http://localhost:3000')).toBe(true);
        expect(isValidUrl('https://subdomain.example.com/path')).toBe(true);
      });

      it('should reject invalid URLs', () => {
        expect(isValidUrl('invalid-url')).toBe(false);
        expect(isValidUrl('example.com')).toBe(false);
        expect(isValidUrl('')).toBe(false);
      });
    });
  });

  describe('StripeValidationError', () => {
    it('should create validation error', () => {
      const error = new StripeValidationError('Test error', 'TEST_CODE');

      expect(error.name).toBe('StripeValidationError');
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_CODE');
    });
  });

  describe('VALIDATION_ERRORS', () => {
    it('should have predefined errors', () => {
      expect(VALIDATION_ERRORS.INVALID_PUBLISHABLE_KEY).toBeInstanceOf(StripeValidationError);
      expect(VALIDATION_ERRORS.INVALID_AMOUNT).toBeInstanceOf(StripeValidationError);
      expect(VALIDATION_ERRORS.INVALID_CURRENCY).toBeInstanceOf(StripeValidationError);
      expect(VALIDATION_ERRORS.INVALID_EMAIL).toBeInstanceOf(StripeValidationError);
      expect(VALIDATION_ERRORS.INVALID_URL).toBeInstanceOf(StripeValidationError);
    });

    it('should create missing field error', () => {
      const error = VALIDATION_ERRORS.MISSING_REQUIRED_FIELD('publishableKey');

      expect(error.message).toContain('publishableKey');
      expect(error.code).toBe('missing_required_field');
    });
  });
});
