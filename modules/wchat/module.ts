import { defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'chat',
    configKey: 'chat',
    description: 'Chat module with comprehensive chat functionality - refactored as independent package'
  },
  defaults: {},
  setup() {
    // Module setup with improved structure:
    // - Components organized by Atomic Design principles (atoms, molecules, organisms)
    // - Composables grouped by responsibility (core, features, utils)
    // - Stores maintain clean separation of concerns with dedicated chat store
    // - Types organized by domain (chat, message, session, mode)
    // - Services extracted for API and external integrations
    // - Proper exports configuration for modular imports
    // - Independent package structure for better maintainability
  }
})
