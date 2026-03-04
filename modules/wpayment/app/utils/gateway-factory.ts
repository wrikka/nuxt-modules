import type { PaymentGatewayAdapter, GatewayConfig } from '../types/gateway-adapter';
import { StripeGatewayAdapter } from './stripe-adapter';
import { PayPalGatewayAdapter } from './paypal-adapter';
import { LemonSqueezyGatewayAdapter } from './lemonsqueezy-adapter';
import { PaddleGatewayAdapter } from './paddle-adapter';

export class GatewayFactory {
  private static adapters: Map<string, PaymentGatewayAdapter> = new Map();

  static getAdapter(gateway: string, config?: GatewayConfig): PaymentGatewayAdapter {
    if (this.adapters.has(gateway)) {
      return this.adapters.get(gateway)!;
    }

    let adapter: PaymentGatewayAdapter;

    switch (gateway) {
      case 'stripe':
        adapter = new StripeGatewayAdapter(config?.stripe);
        break;
      case 'paypal':
        adapter = new PayPalGatewayAdapter(config?.paypal);
        break;
      case 'lemonsqueezy':
        adapter = new LemonSqueezyGatewayAdapter(config?.lemonsqueezy);
        break;
      case 'paddle':
        adapter = new PaddleGatewayAdapter(config?.paddle);
        break;
      default:
        throw new Error(`Unsupported payment gateway: ${gateway}`);
    }

    this.adapters.set(gateway, adapter);
    return adapter;
  }

  static clearAdapters(): void {
    this.adapters.clear();
  }

  static getAvailableGateways(config?: GatewayConfig): string[] {
    const gateways: string[] = [];

    if (config?.stripe?.secretKey) gateways.push('stripe');
    if (config?.paypal?.clientId) gateways.push('paypal');
    if (config?.lemonsqueezy?.apiKey) gateways.push('lemonsqueezy');
    if (config?.paddle?.vendorId) gateways.push('paddle');

    return gateways;
  }

  static getDefaultGateway(config?: GatewayConfig): string {
    const available = this.getAvailableGateways(config);
    return available[0] || 'stripe';
  }
}
