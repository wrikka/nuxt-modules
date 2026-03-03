import { addComponent, addImportsDir, addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit';
import { z } from 'zod';

const wformModuleOptionsSchema = z.object({
  enabled: z.boolean().default(true),
  validateOnMount: z.boolean().default(false),
  validateOnChange: z.boolean().default(true),
  validateOnBlur: z.boolean().default(true),
  debounceMs: z.number().default(300),
  debug: z.boolean().default(false),
  components: z.object({
    prefix: z.string().default('W'),
    global: z.boolean().default(true),
  }).default({}),
});

export type WformModuleOptions = z.infer<typeof wformModuleOptionsSchema>;

export default defineNuxtModule<WformModuleOptions>({
  meta: {
    name: '@wrikka/wform',
    configKey: 'wform',
    version: '0.0.1',
    compatibility: {
      nuxt: '^3.0.0 || ^4.0.0',
    },
  },
  schema: wformModuleOptionsSchema,
  defaults: {
    enabled: true,
    validateOnMount: false,
    validateOnChange: true,
    validateOnBlur: true,
    debounceMs: 300,
    debug: false,
    components: {
      prefix: 'W',
      global: true,
    },
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    if (!options.enabled) {
      return;
    }

    // Register runtime directory alias
    nuxt.options.alias['#wform'] = resolver.resolve('./runtime');

    // Register composables
    addImportsDir(resolver.resolve('./runtime/composables'));

    // Register plugin
    addPlugin(resolver.resolve('./runtime/plugins/wform'));

    // Register components with prefix
    const componentPrefix = options.components?.prefix ?? 'W';

    addComponent({
      name: `${componentPrefix}Form`,
      filePath: resolver.resolve('./runtime/components/WForm.vue'),
      global: options.components?.global,
    });

    addComponent({
      name: `${componentPrefix}Field`,
      filePath: resolver.resolve('./runtime/components/WField.vue'),
      global: options.components?.global,
    });

    addComponent({
      name: `${componentPrefix}FieldArray`,
      filePath: resolver.resolve('./runtime/components/WFieldArray.vue'),
      global: options.components?.global,
    });

    addComponent({
      name: `${componentPrefix}ErrorMessage`,
      filePath: resolver.resolve('./runtime/components/WErrorMessage.vue'),
      global: options.components?.global,
    });

    addComponent({
      name: `${componentPrefix}FormWizard`,
      filePath: resolver.resolve('./runtime/components/WFormWizard.vue'),
      global: options.components?.global,
    });

    // Add public runtime config
    nuxt.options.runtimeConfig.public.wform = {
      enabled: options.enabled,
      validateOnMount: options.validateOnMount,
      validateOnChange: options.validateOnChange,
      validateOnBlur: options.validateOnBlur,
      debounceMs: options.debounceMs,
      debug: options.debug,
    };
  },
});
