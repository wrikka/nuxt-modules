import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  typescript: {
    strict: true,
    typeCheck: true,
  },
  preset: 'bun',
  modules: [
    '@unocss/nuxt',
  ],
})