import { addComponentsDir, addImportsDir, addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit';
import { z } from 'zod';

const wpaymentModuleOptionsSchema = z.object({
  publishableKey: z.string().min(1, 'Stripe publishable key is required'),
  secretKey: z.string().optional(),
  apiVersion: z.string().default('2024-11-20.acacia'),
  locale: z.string().default('auto'),
  elementsOptions: z.record(z.any()).default({}),
  confirmParams: z.record(z.any()).default({}),
});

const workosModuleOptionsSchema = z.object({
  clientId: z.string().optional(),
  apiKey: z.string().optional(),
  baseUrl: z.string().optional(),
  environment: z.enum(['production', 'development']).optional(),
});

export type WpaymentModuleOptions = z.infer<typeof wpaymentModuleOptionsSchema>;
export type WorkOSModuleOptions = z.infer<typeof workosModuleOptionsSchema>;

export interface CombinedModuleOptions extends WpaymentModuleOptions {
  workos?: WorkOSModuleOptions;
}

export default defineNuxtModule<WpaymentModuleOptions>({
  meta: {
    name: '@wrikka/wpayment',
    configKey: 'wpayment',
    version: '0.0.1',
    compatibility: {
      nuxt: '^3.0.0 || ^4.0.0',
    },
  },
  schema: wpaymentModuleOptionsSchema,
  defaults: {
    apiVersion: '2024-11-20.acacia',
    locale: 'auto',
    elementsOptions: {},
    confirmParams: {},
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    // Validate publishable key
    if (!options.publishableKey) {
      throw new Error('Stripe publishable key is required');
    }

    // Register runtime directory
    nuxt.options.alias['#wpayment'] = resolver.resolve('./runtime');

    // Register types
    nuxt.hook('prepare:types', ({ references }) => {
      references.push({ types: 'wpayment/types' });
    });

    // Register composables
    addImportsDir(resolver.resolve('./app/composables'));

    // Register components
    addComponentsDir({
      path: resolver.resolve('./app/components'),
      prefix: 'Wpayment',
    });

    // Register plugins
    addPlugin(resolver.resolve('./app/plugins/wpayment.client'));
    addPlugin(resolver.resolve('./app/plugins/wpayment.server'));

    // Add runtime config for secret key
    if (options.secretKey) {
      nuxt.options.runtimeConfig.private = nuxt.options.runtimeConfig.private || {};
      nuxt.options.runtimeConfig.private.wpaymentSecretKey = options.secretKey;
    }

    // Add public runtime config for publishable key
    nuxt.options.runtimeConfig.public.wpayment = {
      publishableKey: options.publishableKey,
      apiVersion: options.apiVersion,
      locale: options.locale,
      elementsOptions: options.elementsOptions,
      confirmParams: options.confirmParams,
    };

    // Setup WorkOS if enabled
    if (options.workos) {
      const workosOptions = workosModuleOptionsSchema.parse(options.workos);
      const workosResolver = createResolver(import.meta.url);

      // Register WorkOS aliases
      nuxt.options.alias['#workos'] = workosResolver.resolve('./app/workos');
      nuxt.options.alias['#workos/types'] = workosResolver.resolve('./app/workos/shared/types/index');
      nuxt.options.alias['#workos/composables'] = workosResolver.resolve('./app/workos/composables/index');
      nuxt.options.alias['#workos/utils'] = workosResolver.resolve('./app/workos/utils/index');

      // Register WorkOS composables
      addImportsDir(workosResolver.resolve('./app/workos/composables'));

      // Register WorkOS plugins
      addPlugin(workosResolver.resolve('./app/workos/plugins/workos.client'));
      addPlugin(workosResolver.resolve('./app/workos/plugins/workos.server'));

      // Initialize WorkOS runtime config
      if (!nuxt.options.runtimeConfig.public.workos) {
        nuxt.options.runtimeConfig.public.workos = {} as any;
      }
      if (!nuxt.options.runtimeConfig.workos) {
        nuxt.options.runtimeConfig.workos = {} as any;
      }

      // Register WorkOS runtime config
      nuxt.options.runtimeConfig.public.workos = {
        clientId: workosOptions.clientId || process.env['WORKOS_CLIENT_ID'],
        baseUrl: workosOptions.baseUrl || 'https://api.workos.com',
        environment: workosOptions.environment || 'development',
      };

      nuxt.options.runtimeConfig.workos = {
        apiKey: workosOptions.apiKey || process.env['WORKOS_API_KEY'],
      };
    }
  },
});
