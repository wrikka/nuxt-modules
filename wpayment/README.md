# @wrikka/wpayment

> 🚀 **Type-safe Nuxt module for Stripe payment integration with comprehensive composables and server utilities**

[![npm version](https://img.shields.io/npm/v/@wrikka/wpayment.svg)](https://www.npmjs.com/package/@wrikka/wpayment)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## ✨ Features

- 🎯 **Type-safe** - Full TypeScript support with comprehensive types
- 🚀 **Easy Setup** - Simple configuration with auto-injection of Stripe
- 💳 **Payment Elements** - Support for all Stripe Elements
- 🔧 **Server Utils** - Server-side Stripe API utilities
- 🎨 **Composables** - Vue 3 composables for client-side integration
- 📦 **Auto-imports** - No need to manually import composables
- 🛡️ **Error Handling** - Comprehensive error handling and validation
- 🧪 **Tested** - Full test coverage with Vitest
- 📚 **Documentation** - Complete API documentation and examples

## 📦 Installation

```bash
bun add @wrikka/wpayment
```

## 🚀 Quick Start

Add the module to your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['@wrikka/wpayment'],

  wpayment: {
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY, // Optional, for server-side usage
    apiVersion: '2024-11-20.acacia', // Optional
    locale: 'auto', // Optional
    elementsOptions: {}, // Optional
    confirmParams: {}, // Optional
  },
});
```

Environment variables:

```bash
# .env
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

## 💳 Usage

### Client-side with Composables

```vue
<template>
  <div>
    <div v-if="loading">Loading Stripe...</div>
    <div v-if="error">{{ error }}</div>
    
    <div v-if="stripe">
      <form @submit.prevent="handleSubmit">
        <div ref="cardElement"></div>
        <button type="submit" :disabled="processing">
          Pay ${{ amount / 100 }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
const { stripe, loading, error, initialize, createElements, confirmPayment } = useStripe()

const cardElement = ref(null)
const processing = ref(false)
const amount = 2000 // $20.00 in cents

onMounted(async () => {
  await initialize()
  
  if (stripe.value) {
    createElements()
    const card = createElement('card')
    card.mount(cardElement.value)
  }
})

const handleSubmit = async () => {
  processing.value = true
  
  try {
    // Create payment intent on server first
    const { clientSecret } = await $fetch('/api/create-payment-intent', {
      method: 'POST',
      body: { amount, currency: 'usd' }
    })
    
    // Confirm payment on client
    const result = await confirmPayment(clientSecret)
    
    if (result.error) {
      console.error('Payment failed:', result.error.message)
    } else {
      console.log('Payment successful!')
    }
  } catch (err) {
    console.error('Payment error:', err)
  } finally {
    processing.value = false
  }
}
</script>
```

### Server-side API

```typescript
// server/api/create-payment-intent.post.ts
import { createPaymentIntent } from '#stripe/utils/stripe-server';

export default defineEventHandler(async event => {
  const body = await readBody(event);

  try {
    const paymentIntent = await createPaymentIntent({
      amount: body.amount,
      currency: body.currency || 'usd',
      metadata: body.metadata,
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    });
  }
});
```

### Checkout Sessions

```typescript
// server/api/create-checkout-session.post.ts
import { createCheckoutSession } from '#stripe/utils/stripe-server';

export default defineEventHandler(async event => {
  const body = await readBody(event);

  try {
    const session = await createCheckoutSession({
      success_url: `${getRequestURL(event)}/success`,
      cancel_url: `${getRequestURL(event)}/cancel`,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Product Name',
              description: 'Product description',
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
    });

    return { url: session.url };
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message,
    });
  }
});
```

## 🎨 Components

### StripeCard Component

```vue
<template>
  <StripeCard
    :options="{ hidePostalCode: false }"
    theme="stripe"
    @ready="onCardReady"
    @change="onCardChange"
    @error="onCardError"
  />
</template>
```

### StripePaymentButton Component

```vue
<template>
  <StripePaymentButton
    :client-secret="clientSecret"
    text="Pay Now"
    processing-text="Processing..."
    variant="default"
    size="md"
    @success="onPaymentSuccess"
    @error="onPaymentError"
  />
</template>
```

## 🔧 Available Composables

### `useStripe()`

Main composable for Stripe integration.

**Returns:**

- `stripe` - Stripe instance
- `elements` - StripeElements instance
- `loading` - Loading state
- `error` - Error state
- `initialize()` - Initialize Stripe
- `createElements(options)` - Create Stripe Elements
- `confirmPayment(clientSecret, elements?, confirmParams?)` - Confirm payment
- `confirmCardPayment(clientSecret, data?, confirmParams?)` - Confirm card payment
- `retrievePaymentIntent(clientSecret)` - Retrieve payment intent

### `useStripeElements(elements?)`

Composable for managing Stripe Elements.

**Returns:**

- `elements` - StripeElements instance
- `error` - Error state
- `createElement(type, options?)` - Create element
- `getElement(type)` - Get element
- `update(options)` - Update elements
- `clear()` - Clear elements
- `focus(type)` - Focus element
- `blur(type)` - Blur element
- `destroy(type)` - Destroy element

## 🛠️ Server Utilities

All server utilities are available from `#stripe/utils/stripe-server`:

- `getStripe(secretKey?)` - Get Stripe instance
- `createPaymentIntent(params)` - Create payment intent
- `retrievePaymentIntent(id)` - Retrieve payment intent
- `confirmPaymentIntent(id)` - Confirm payment intent
- `cancelPaymentIntent(id)` - Cancel payment intent
- `createCustomer(params)` - Create customer
- `retrieveCustomer(id)` - Retrieve customer
- `createCheckoutSession(params)` - Create checkout session
- `retrieveCheckoutSession(id)` - Retrieve checkout session

## 📚 Types

Full TypeScript support with comprehensive types:

```typescript
import type {
  CheckoutSession,
  Customer,
  LineItem,
  PaymentIntent,
  UseStripeReturn,
} from '#stripe/types';
```

## ⚙️ Configuration Options

| Option            | Type     | Default               | Description                                       |
| ----------------- | -------- | --------------------- | ------------------------------------------------- |
| `publishableKey`  | `string` | -                     | **Required**. Stripe publishable key              |
| `secretKey`       | `string` | -                     | Optional. Stripe secret key for server-side usage |
| `apiVersion`      | `string` | `'2024-11-20.acacia'` | Stripe API version                                |
| `locale`          | `string` | `'auto'`              | Locale for Stripe Elements                        |
| `elementsOptions` | `object` | `{}`                  | Default options for Stripe Elements               |
| `confirmParams`   | `object` | `{}`                  | Default parameters for payment confirmation       |

## 🧪 Testing

The module includes comprehensive test coverage:

```bash
# Run tests
bun run test

# Run tests with coverage
bun run test:coverage

# Run tests in watch mode
bun run test:watch
```

## 🔧 Development

```bash
# Install dependencies
bun install

# Run type checking
bun run typecheck

# Run linting
bun run lint

# Format code
bun run format

# Build module
bun run build

# Preview module
bun run preview
```

## 📖 Documentation

- [API Reference](./docs/api.md)
- [Examples](./docs/examples.md)
- [Migration Guide](./docs/migration.md)
- [Troubleshooting](./docs/troubleshooting.md)

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) and [Code of Conduct](./CODE_OF_CONDUCT.md).

### Development Setup

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT

## 🙏 Acknowledgments

- [Stripe](https://stripe.com/) - Payment processing platform
- [Nuxt](https://nuxt.com/) - Vue.js framework
- [Vue](https://vuejs.org/) - Progressive JavaScript framework

---

<p align="center">
  <sub>Built with ❤️ by the Wrikka team</sub>
</p>
