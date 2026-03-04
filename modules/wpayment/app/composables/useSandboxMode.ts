import { readonly, ref } from 'vue';
import type {
  PaymentResult,
  TestCard,
  TestScenario,
  UseSandboxModeReturn,
} from '#wpayment/types';

const testCards: TestCard[] = [
  {
    brand: 'Visa',
    number: '4242 4242 4242 4242',
    cvc: '123',
    expiry: '12/25',
    description: 'Successful payment',
  },
  {
    brand: 'Visa',
    number: '4000 0000 0000 0002',
    cvc: '123',
    expiry: '12/25',
    description: 'Card declined',
  },
  {
    brand: 'Visa',
    number: '4000 0000 0000 9995',
    cvc: '123',
    expiry: '12/25',
    description: 'Insufficient funds',
  },
  {
    brand: 'Visa',
    number: '4000 0000 0000 9987',
    cvc: '123',
    expiry: '12/25',
    description: 'Lost card',
  },
  {
    brand: 'Visa',
    number: '4000 0000 0000 9979',
    cvc: '123',
    expiry: '12/25',
    description: 'Stolen card',
  },
  {
    brand: 'Visa',
    number: '4000 0000 0000 9235',
    cvc: '123',
    expiry: '12/25',
    description: '3D Secure required',
  },
  {
    brand: 'Visa',
    number: '4000 0000 0000 3220',
    cvc: '123',
    expiry: '12/25',
    description: '3D Secure frictionless',
  },
];

const testScenarios: TestScenario[] = [
  { id: 'success', name: 'Successful Payment', description: 'A standard successful payment', expectedResult: 'success' },
  { id: '3ds_required', name: '3D Secure Required', description: 'Payment requiring 3D Secure authentication', expectedResult: '3ds_required' },
  { id: 'card_declined', name: 'Card Declined', description: 'Payment declined by the card issuer', expectedResult: 'failure' },
  { id: 'insufficient_funds', name: 'Insufficient Funds', description: 'Card has insufficient funds', expectedResult: 'failure' },
  { id: 'fraud_review', name: 'Fraud Review', description: 'Payment flagged for manual review', expectedResult: 'review' },
];

export function useSandboxMode(): UseSandboxModeReturn {
  const config = useRuntimeConfig();
  const isSandbox = ref(config.public.wpayment?.publishableKey?.startsWith('pk_test_') ?? false);

  const enable = (): void => {
    isSandbox.value = true;
  };

  const disable = (): void => {
    isSandbox.value = false;
  };

  const toggle = (): void => {
    isSandbox.value = !isSandbox.value;
  };

  const simulateScenario = async (scenarioId: string): Promise<PaymentResult> => {
    try {
      await $fetch('/api/sandbox/simulate', {
        method: 'POST',
        body: { scenarioId },
      });

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to simulate scenario';
      return { success: false, error: { code: 'simulation_failed', message, retryable: false } };
    }
  };

  const resetTestData = async (): Promise<void> => {
    await $fetch('/api/sandbox/reset', {
      method: 'POST',
    });
  };

  return {
    isSandbox: readonly(isSandbox),
    testCards,
    testScenarios,
    enable,
    disable,
    toggle,
    simulateScenario,
    resetTestData,
  };
}
