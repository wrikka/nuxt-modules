import {
    addComponentsDir,
    addImportsDir,
    createResolver,
    defineNuxtModule,
} from "@nuxt/kit";

export default defineNuxtModule({
    defaults: {
        // Default options
        enableServerApi: true,
        enableTypes: true,
        enablePlugins: true,
        cssFramework: 'unocss',
        apiPrefix: '/api/diff',
        enableDevtools: true,
        enableLogging: false,
        maxFileSize: 10 * 1024 * 1024, // 10MB
        timeout: 30000 // 30 seconds
    },
    meta: {
        configKey: "diff",
        name: "@wpackages/diff",
        version: "0.1.0",
        compatibility: {
            nuxt: '^4.3.1'
        }
    },
    setup(options, nuxt) {
        const resolver = createResolver(import.meta.url);

        // Validate options
        if (options.apiPrefix && !options.apiPrefix.startsWith('/')) {
            throw new Error('apiPrefix must start with "/"')
        }

        // Add UnoCSS module
        if (options.cssFramework === 'unocss') {
            nuxt.options.modules.push("@unocss/nuxt");
        }

        // Add runtime components
        addComponentsDir({
            path: resolver.resolve("./runtime/components"),
            pathPrefix: false,
        });

        // Add runtime composables
        addImportsDir(resolver.resolve("./runtime/composables"));

        // Add runtime utils
        addImportsDir(resolver.resolve("./runtime/utils"));

        // Add type definitions
        if (options.enableTypes) {
            nuxt.hook('prepare:types', ({ references }) => {
                references.push({ types: '@wpackages/diff' })
            })
        }

        // Add plugins
        if (options.enablePlugins) {
            nuxt.options.plugins.push(resolver.resolve('./runtime/plugins/diff.client'))
            nuxt.options.plugins.push(resolver.resolve('./runtime/plugins/diff.server'))
        }

        // Add server middleware
        if (options.enableServerApi) {
            // Route rules will be handled by Nuxt automatically
            console.log(`🚀 Diff API enabled at ${options.apiPrefix}`)
        }

        // Add logging
        if (options.enableLogging) {
            nuxt.hook('build:done', () => {
                console.log('📊 Diff module logging enabled')
            })
        }

        // Add runtime config
        nuxt.options.runtimeConfig.public.diff = {
            apiPrefix: options.apiPrefix,
            maxFileSize: options.maxFileSize,
            timeout: options.timeout
        }

        // Add build hooks
        nuxt.hook('build:before', () => {
            console.log('🔧 @wpackages/diff module building...')
        })

        nuxt.hook('build:done', () => {
            console.log('✅ @wpackages/diff module built successfully')
        })
    },
});
