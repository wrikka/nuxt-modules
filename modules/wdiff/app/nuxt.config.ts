import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  typescript: {
    strict: true,
    typeCheck: true,
  },
  compatibilityDate: "2026-02-25",
  modules: ["@wrikka/diff", "@unocss/nuxt", "@pinia/nuxt"],
});
