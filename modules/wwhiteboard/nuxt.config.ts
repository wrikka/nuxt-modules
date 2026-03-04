import wasm from 'vite-plugin-wasm'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2025-12-17", 
    devtools: { enabled: true },
    modules: [
        "@vue-macros/nuxt",
        "@nuxtjs/color-mode",
        "@vueuse/nuxt",
        "@unocss/nuxt",
        "@pinia/nuxt",
        "nuxt-mcp-dev",
        "@nuxt/icon",
        "@nuxtjs/supabase"
    ],

    supabase: {
        redirect: false
    }, 


    nitro : {
        preset: "cloudflare_module",
        cloudflare: {
            deployConfig: true,
            nodeCompat: true,
        },
    },

    typescript: {
        strict: true,
        typeCheck: true
    },
    vite: {
        server: {
            hmr: {
                port: 24679,
                clientPort: 24679,
            },
        },
        plugins: [
            wasm(),
        ],
    }
})