import { defineNuxtConfig } from 'nuxt/config';
import checker from 'vite-plugin-checker';

export default defineNuxtConfig({
  modules: ["@unocss/nuxt"],
  typescript: {
    strict: true,
    typeCheck: true,
  },
  vite: {
    plugins: [
      checker({
        overlay: {
          initialIsOpen: false,
        },
        typescript: true,
        vueTsc: true,
      }) as any,
    ],
  },
})
