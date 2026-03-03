import {
  addComponentsDir,
  addImportsDir,
  addPlugin,
  addServerHandler,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit';
import { z } from 'zod';

const onboardingModuleOptionsSchema = z.object({
  enabled: z.boolean().default(true),
  autoStart: z.boolean().default(true),
  persistProgress: z.boolean().default(true),
  steps: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    icon: z.string().optional(),
    required: z.boolean().default(true),
  })).optional(),
  skipable: z.boolean().default(true),
  showProgress: z.boolean().default(true),
  debug: z.boolean().default(false),
});

export type OnboardingModuleOptions = z.infer<typeof onboardingModuleOptionsSchema>;

export default defineNuxtModule({
  meta: {
    name: '@wrikka/onboarding',
    configKey: 'onboarding',
    version: '0.0.1',
    compatibility: {
      nuxt: '^3.0.0 || ^4.0.0',
    },
  },
  defaults: {
    enabled: true,
    autoStart: true,
    persistProgress: true,
    skipable: true,
    showProgress: true,
    debug: false,
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    if (!options.enabled) {
      return;
    }

    // Register runtime directory
    nuxt.options.alias['#onboarding'] = resolver.resolve('./runtime');

    // Register composables
    addImportsDir(resolver.resolve('./runtime/composables'));

    // Register components
    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
      prefix: 'Onboarding',
    });

    // Register plugins
    addPlugin(resolver.resolve('./runtime/plugins/onboarding'));

    // Add server API handlers
    addServerHandler({
      route: '/api/onboarding/status',
      handler: resolver.resolve('./runtime/server/api/status.get'),
    });

    addServerHandler({
      route: '/api/onboarding/complete',
      handler: resolver.resolve('./runtime/server/api/complete.post'),
      method: 'post',
    });

    addServerHandler({
      route: '/api/onboarding/skip',
      handler: resolver.resolve('./runtime/server/api/skip.post'),
      method: 'post',
    });

    // Add public runtime config
    nuxt.options.runtimeConfig.public.onboarding = {
      enabled: options.enabled,
      autoStart: options.autoStart,
      persistProgress: options.persistProgress,
      skipable: options.skipable,
      showProgress: options.showProgress,
      debug: options.debug,
    };
  },
});
