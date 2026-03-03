import { addImportsDir, addServerHandler, createResolver, defineNuxtModule } from '@nuxt/kit';
import { z } from 'zod';

const webhooksModuleOptionsSchema = z.object({
  enabled: z.boolean().default(true),
  secret: z.string().optional(),
  providers: z.object({
    stripe: z.object({
      enabled: z.boolean().default(false),
      secret: z.string().optional(),
    }).optional(),
    github: z.object({
      enabled: z.boolean().default(false),
      secret: z.string().optional(),
    }).optional(),
    slack: z.object({
      enabled: z.boolean().default(false),
      secret: z.string().optional(),
    }).optional(),
    custom: z.object({
      enabled: z.boolean().default(false),
      secret: z.string().optional(),
    }).optional(),
  }).default({}),
  retryAttempts: z.number().default(3),
  retryDelay: z.number().default(1000),
  debug: z.boolean().default(false),
});

export type WebhooksModuleOptions = z.infer<typeof webhooksModuleOptionsSchema>;

export default defineNuxtModule<WebhooksModuleOptions>({
  meta: {
    name: '@wrikka/webhooks',
    configKey: 'webhooks',
    version: '0.0.1',
    compatibility: {
      nuxt: '^3.0.0 || ^4.0.0',
    },
  },
  defaults: {
    enabled: true,
    providers: {},
    retryAttempts: 3,
    retryDelay: 1000,
    debug: false,
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    if (!options.enabled) {
      return;
    }

    // Register runtime directory
    nuxt.options.alias['#webhooks'] = resolver.resolve('./runtime');

    // Register composables
    addImportsDir(resolver.resolve('./app/composables'));

    // Add server API handlers
    addServerHandler({
      route: '/api/webhooks/stripe',
      handler: resolver.resolve('./app/server/api/stripe.post'),
    });

    addServerHandler({
      route: '/api/webhooks/github',
      handler: resolver.resolve('./app/server/api/github.post'),
    });

    addServerHandler({
      route: '/api/webhooks/slack',
      handler: resolver.resolve('./app/server/api/slack.post'),
    });

    addServerHandler({
      route: '/api/webhooks/custom',
      handler: resolver.resolve('./app/server/api/custom.post'),
    });

    addServerHandler({
      route: '/api/webhooks/events',
      handler: resolver.resolve('./app/server/api/events.get'),
    });

    // Add runtime config
    const privateConfig = nuxt.options.runtimeConfig.private as Record<string, unknown>;
    nuxt.options.runtimeConfig.private = privateConfig || {};
    (nuxt.options.runtimeConfig.private as Record<string, unknown>).webhooksSecret = options.secret;
    (nuxt.options.runtimeConfig.private as Record<string, unknown>).webhooksProviders = options.providers;

    nuxt.options.runtimeConfig.public.webhooks = {
      enabled: options.enabled,
      retryAttempts: options.retryAttempts,
      retryDelay: options.retryDelay,
      debug: options.debug,
    };
  },
});
