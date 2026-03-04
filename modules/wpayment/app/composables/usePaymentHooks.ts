import { readonly, ref } from 'vue';
import type {
  PaymentEventHooks,
  UsePaymentHooksReturn,
} from '#wpayment/types';

type EventHandlers = {
  [K in keyof PaymentEventHooks]: PaymentEventHooks[K][];
};

const createEventRegistry = (): EventHandlers => ({
  beforePayment: [],
  afterPayment: [],
  onPaymentSuccess: [],
  onPaymentFailure: [],
  onPaymentRetry: [],
});

const globalRegistry = createEventRegistry();

export function usePaymentHooks(): UsePaymentHooksReturn {
  const registry = createEventRegistry();

  const register = <K extends keyof PaymentEventHooks>(
    event: K,
    handler: PaymentEventHooks[K],
  ): (() => void) => {
    registry[event].push(handler);

    return () => {
      const index = registry[event].indexOf(handler);
      if (index > -1) {
        registry[event].splice(index, 1);
      }
    };
  };

  const unregister = <K extends keyof PaymentEventHooks>(
    event: K,
    handler: PaymentEventHooks[K],
  ): void => {
    const index = registry[event].indexOf(handler);
    if (index > -1) {
      registry[event].splice(index, 1);
    }
  };

  const emit = async <K extends keyof PaymentEventHooks>(
    event: K,
    ...args: Parameters<PaymentEventHooks[K]>
  ): Promise<void> => {
    const handlers = [...globalRegistry[event], ...registry[event]];

    for (const handler of handlers) {
      try {
        await (handler as (...args: unknown[]) => Promise<void>)(...args);
      } catch {
        // Continue even if one handler fails
      }
    }
  };

  return {
    register,
    unregister,
    emit,
  };
}

export function useGlobalPaymentHooks(): UsePaymentHooksReturn {
  return {
    register: <K extends keyof PaymentEventHooks>(
      event: K,
      handler: PaymentEventHooks[K],
    ): (() => void) => {
      globalRegistry[event].push(handler);

      return () => {
        const index = globalRegistry[event].indexOf(handler);
        if (index > -1) {
          globalRegistry[event].splice(index, 1);
        }
      };
    },
    unregister: <K extends keyof PaymentEventHooks>(
      event: K,
      handler: PaymentEventHooks[K],
    ): void => {
      const index = globalRegistry[event].indexOf(handler);
      if (index > -1) {
        globalRegistry[event].splice(index, 1);
      }
    },
    emit: async <K extends keyof PaymentEventHooks>(
      event: K,
      ...args: Parameters<PaymentEventHooks[K]>
    ): Promise<void> => {
      for (const handler of globalRegistry[event]) {
        try {
          await (handler as (...args: unknown[]) => Promise<void>)(...args);
        } catch {
          // Continue even if one handler fails
        }
      }
    },
  };
}
