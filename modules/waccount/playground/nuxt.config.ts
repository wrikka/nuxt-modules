export default defineNuxtConfig({
  preset: 'bun',
  modules: [
    '@wrikka/waccount'
  ],

  // Module configuration
  waccount: {
    // Add your waccount module configuration here
    // This will depend on what options the module supports
  },

  devtools: { enabled: true }
})
