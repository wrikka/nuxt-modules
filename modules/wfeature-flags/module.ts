import { addImportsDir, addPlugin, addServerHandler, createResolver, defineNuxtModule } from '@nuxt/kit';
import { z } from 'zod';

const featureFlagsModuleOptionsSchema = z.object({
  enabled: z.boolean().default(true),
  providers: z.object({
    launchdarkly: z.object({
      sdkKey: z.string().optional(),
      clientSideId: z.string().optional(),
    }).optional(),
    flagsmith: z.object({
      environmentId: z.string().optional(),
      apiHost: z.string().default('https://api.flagsmith.com/api/v1'),
    }).optional(),
    unleash: z.object({
      url: z.string().optional(),
      appName: z.string().default('default'),
    }).optional(),
    local: z.object({
      flags: z.record(z.any()).default({}),
    }).optional(),
  }).default({}),
  defaultFlags: z.record(z.boolean()).default({}),
  persistInStorage: z.boolean().default(true),
  debug: z.boolean().default(false),
  realtime: z.object({
    enabled: z.boolean().default(false),
    reconnectInterval: z.number().default(3000),
    maxReconnectAttempts: z.number().default(5),
  }).optional(),
});

export type FeatureFlagsModuleOptions = z.infer<typeof featureFlagsModuleOptionsSchema>;

export default defineNuxtModule<FeatureFlagsModuleOptions>({
  meta: {
    name: '@wrikka/feature-flags',
    configKey: 'featureFlags',
    version: '0.0.1',
    compatibility: {
      nuxt: '^3.0.0 || ^4.0.0',
    },
  },
  schema: featureFlagsModuleOptionsSchema,
  defaults: {
    enabled: true,
    providers: {},
    defaultFlags: {},
    persistInStorage: true,
    debug: false,
    realtime: {
      enabled: false,
      reconnectInterval: 3000,
      maxReconnectAttempts: 5,
    },
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    if (!options.enabled) {
      return;
    }

    // Register runtime directory
    nuxt.options.alias['#feature-flags'] = resolver.resolve('./runtime');

    // Register composables
    addImportsDir(resolver.resolve('./app/composables'));

    // Register plugins
    addPlugin(resolver.resolve('./app/plugins/feature-flags'));

    // Add server API handlers
    addServerHandler({
      route: '/api/feature-flags',
      handler: resolver.resolve('./app/server/api/flags.get'),
    });

    addServerHandler({
      route: '/api/feature-flags/evaluate',
      handler: resolver.resolve('./app/server/api/evaluate.post'),
    });

    addServerHandler({
      route: '/api/feature-flags/stream',
      handler: resolver.resolve('./app/server/api/stream.get'),
    });

    addServerHandler({
      route: '/api/feature-flags/experiments',
      handler: resolver.resolve('./app/server/api/experiments/index.get'),
    });

    addServerHandler({
      route: '/api/feature-flags/experiments/metrics',
      handler: resolver.resolve('./app/server/api/experiments/metrics.post'),
    });

    addServerHandler({
      route: '/api/feature-flags/health',
      handler: resolver.resolve('./app/server/api/health.get'),
    });

    addServerHandler({
      route: '/api/feature-flags/simulate',
      handler: resolver.resolve('./app/server/api/simulate.post'),
    });

    addServerHandler({
      route: '/api/feature-flags/impact',
      handler: resolver.resolve('./app/server/api/impact.post'),
    });

    addServerHandler({
      route: '/api/feature-flags/bulk',
      handler: resolver.resolve('./app/server/api/bulk.post'),
    });

    addServerHandler({
      route: '/api/feature-flags/dependencies',
      handler: resolver.resolve('./app/server/api/dependencies.get'),
    });

    addServerHandler({
      route: '/api/feature-flags/changelog',
      handler: resolver.resolve('./app/server/api/changelog.get'),
    });

    addServerHandler({
      route: '/api/feature-flags/env-diff',
      handler: resolver.resolve('./app/server/api/env-diff.post'),
    });

    addServerHandler({
      route: '/api/feature-flags/annotations',
      handler: resolver.resolve('./app/server/api/annotations.get'),
    });

    // Add public runtime config
    nuxt.options.runtimeConfig.public.featureFlags = {
      enabled: options.enabled,
      providers: options.providers,
      defaultFlags: options.defaultFlags,
      persistInStorage: options.persistInStorage,
      debug: options.debug,
      realtime: options.realtime,
    };
  },
});
