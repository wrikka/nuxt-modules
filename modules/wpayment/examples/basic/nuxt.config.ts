import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  preset: 'bun',
  modules: ['../../src/module'],
  stripe: {
    publishableKey: process.env['STRIPE_PUBLISHABLE_KEY'],
    secretKey: process.env['STRIPE_SECRET_KEY'],
    apiVersion: '2024-11-20.acacia',
    locale: 'auto',
  },
});
