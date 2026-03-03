import {
  addComponentsDir,
  addImportsDir,
  addPlugin,
  addServerHandler,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit';
import { z } from 'zod';

const notificationsModuleOptionsSchema = z.object({
  enabled: z.boolean().default(true),
  channels: z.object({
    inApp: z.object({
      enabled: z.boolean().default(true),
      position: z.enum(['top-right', 'top-left', 'bottom-right', 'bottom-left']).default('top-right'),
      maxVisible: z.number().default(5),
    }).default({
      enabled: true,
      position: 'top-right',
      maxVisible: 5,
    }),
    email: z.object({
      enabled: z.boolean().default(false),
      provider: z.enum(['resend', 'sendgrid', 'postmark', 'custom']).optional(),
    }).optional(),
    push: z.object({
      enabled: z.boolean().default(false),
      vapidPublicKey: z.string().optional(),
    }).optional(),
  }).default({
    inApp: {
      enabled: true,
      position: 'top-right',
      maxVisible: 5,
    },
  }),
  persistence: z.enum(['memory', 'localStorage', 'database']).default('localStorage'),
  realtime: z.boolean().default(false),
  debug: z.boolean().default(false),
});

export type NotificationsModuleOptions = z.infer<typeof notificationsModuleOptionsSchema>;

export default defineNuxtModule<NotificationsModuleOptions>({
  meta: {
    name: '@wrikka/notifications',
    configKey: 'notifications',
    version: '0.0.1',
    compatibility: {
      nuxt: '^3.0.0 || ^4.0.0',
    },
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    if (!options.enabled) {
      return;
    }

    // Register runtime directory
    nuxt.options.alias['#notifications'] = resolver.resolve('./runtime');

    // Register composables
    addImportsDir(resolver.resolve('./app/composables'));

    // Register components
    addComponentsDir({
      path: resolver.resolve('./app/components'),
      prefix: 'Notifications',
    });

    // Register plugins
    addPlugin(resolver.resolve('./app/plugins/notifications'));

    // Add server API handlers
    addServerHandler({
      route: '/api/notifications',
      handler: resolver.resolve('./app/server/api/index.get'),
    });

    addServerHandler({
      route: '/api/notifications',
      handler: resolver.resolve('./app/server/api/index.post'),
      method: 'post',
    });

    addServerHandler({
      route: '/api/notifications/:id/read',
      handler: resolver.resolve('./app/server/api/read.put'),
      method: 'put',
    });

    addServerHandler({
      route: '/api/notifications/preferences',
      handler: resolver.resolve('./app/server/api/preferences.get'),
    });

    // Add public runtime config
    nuxt.options.runtimeConfig.public.notifications = {
      enabled: options.enabled,
      channels: options.channels,
      persistence: options.persistence,
      realtime: options.realtime,
      debug: options.debug,
    };
  },
});
