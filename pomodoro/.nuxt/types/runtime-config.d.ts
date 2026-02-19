import { RuntimeConfig as UserRuntimeConfig, PublicRuntimeConfig as UserPublicRuntimeConfig } from 'nuxt/schema'
  interface SharedRuntimeConfig {
   app: {
      buildId: string,

      baseURL: string,

      buildAssetsDir: string,

      cdnURL: string,
   },

   nitro: {
      envPrefix: string,
   },
  }
  interface SharedPublicRuntimeConfig {
   pomodoro: {
      workDuration: number,

      shortBreakDuration: number,

      longBreakDuration: number,

      longBreakInterval: number,

      autoStartBreaks: boolean,

      autoStartPomodoros: boolean,

      enableAudio: boolean,

      enableNotifications: boolean,

      enableSoundscapes: boolean,

      enableFocusMode: boolean,

      enableMiniTimer: boolean,

      enableStats: boolean,

      enableKeyboardShortcuts: boolean,

      enableTaskIntegration: boolean,

      workSound: string,

      breakSound: string,

      completeSound: string,

      volume: number,
   },
  }
declare module '@nuxt/schema' {
  interface RuntimeConfig extends UserRuntimeConfig {}
  interface PublicRuntimeConfig extends UserPublicRuntimeConfig {}
}
declare module 'nuxt/schema' {
  interface RuntimeConfig extends SharedRuntimeConfig {}
  interface PublicRuntimeConfig extends SharedPublicRuntimeConfig {}
}
declare module 'vue' {
        interface ComponentCustomProperties {
          $config: UserRuntimeConfig
        }
      }