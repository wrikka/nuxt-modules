import { defineNuxtModule, addComponentsDir, addImportsDir, addPlugin, createResolver } from '@nuxt/kit'
import { defu } from 'defu'

export interface ChatModuleOptions {
  apiEndpoint?: string
  enableE2EE?: boolean
  enableVoiceCalls?: boolean
  enableVideoCalls?: boolean
  enableBots?: boolean
  enableMiniApps?: boolean
  enableAI?: boolean
  maxFileSize?: number
  enableCloudSync?: boolean
  enableSecretChats?: boolean
  enableChannels?: boolean
  enableSupergroups?: boolean
  enableReactions?: boolean
  enableStickers?: boolean
  enableScreenSharing?: boolean
  enableLiveStreaming?: boolean
  enableVoiceTranscription?: boolean
}

export default defineNuxtModule<ChatModuleOptions>({
  meta: {
    name: 'wchat',
    configKey: 'wchat',
    description: 'Telegram-like chat module with 33+ features - E2EE, Voice/Video calls, Bots, Channels, Supergroups, Cloud sync',
    compatibility: {
      nuxt: '^4.0.0'
    }
  },
  defaults: {
    apiEndpoint: '/api/chat',
    enableE2EE: true,
    enableVoiceCalls: true,
    enableVideoCalls: true,
    enableBots: true,
    enableMiniApps: true,
    enableAI: true,
    maxFileSize: 4 * 1024 * 1024 * 1024, // 4GB
    enableCloudSync: true,
    enableSecretChats: true,
    enableChannels: true,
    enableSupergroups: true,
    enableReactions: true,
    enableStickers: true,
    enableScreenSharing: true,
    enableLiveStreaming: true,
    enableVoiceTranscription: true
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.runtimeConfig = defu(nuxt.options.runtimeConfig, {
      public: {
        wchat: {
          apiEndpoint: options.apiEndpoint,
          enableE2EE: options.enableE2EE,
          enableVoiceCalls: options.enableVoiceCalls,
          enableVideoCalls: options.enableVideoCalls,
          enableBots: options.enableBots,
          enableMiniApps: options.enableMiniApps,
          enableAI: options.enableAI,
          maxFileSize: options.maxFileSize,
          enableCloudSync: options.enableCloudSync,
          enableSecretChats: options.enableSecretChats,
          enableChannels: options.enableChannels,
          enableSupergroups: options.enableSupergroups,
          enableReactions: options.enableReactions,
          enableStickers: options.enableStickers,
          enableScreenSharing: options.enableScreenSharing,
          enableLiveStreaming: options.enableLiveStreaming,
          enableVoiceTranscription: options.enableVoiceTranscription
        }
      }
    })

    addComponentsDir({
      path: resolver.resolve('./app/components'),
      prefix: 'WChat',
      pathPrefix: false
    })

    addImportsDir(resolver.resolve('./app/composables'))

    addPlugin(resolver.resolve('./app/plugins/chat.client'))
    addPlugin(resolver.resolve('./app/plugins/encryption.client'))
    addPlugin(resolver.resolve('./app/plugins/webrtc.client'))
    addPlugin(resolver.resolve('./app/plugins/bots.client'))

    nuxt.options.css.push(resolver.resolve('./app/assets/chat.css'))

    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.handlers ||= []
      nitroConfig.handlers.push(
        { route: '/api/chat/messages', handler: resolver.resolve('./server/api/messages') },
        { route: '/api/chat/rooms', handler: resolver.resolve('./server/api/rooms') },
        { route: '/api/chat/rooms/:id', handler: resolver.resolve('./server/api/rooms/[id]') },
        { route: '/api/chat/channels', handler: resolver.resolve('./server/api/channels') },
        { route: '/api/chat/groups', handler: resolver.resolve('./server/api/groups') },
        { route: '/api/chat/upload', handler: resolver.resolve('./server/api/upload') },
        { route: '/api/chat/calls', handler: resolver.resolve('./server/api/calls') },
        { route: '/api/chat/bots', handler: resolver.resolve('./server/api/bots') },
        { route: '/api/chat/sync', handler: resolver.resolve('./server/api/sync') },
        { route: '/api/chat/search', handler: resolver.resolve('./server/api/search') },
        { route: '/ws/chat', handler: resolver.resolve('./server/api/websocket') }
      )
    })
  }
})
