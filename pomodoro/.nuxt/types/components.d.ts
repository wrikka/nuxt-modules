
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T> = DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>> & T

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }> & T

interface _GlobalComponents {
  WPomodoroWFocusOverlay: typeof import("../../src/runtime/components/WFocusOverlay.vue")['default']
  WPomodoroWMiniTimer: typeof import("../../src/runtime/components/WMiniTimer.vue")['default']
  WPomodoroWNotificationToast: typeof import("../../src/runtime/components/WNotificationToast.vue")['default']
  WPomodoroContainer: typeof import("../../src/runtime/components/WPomodoroContainer.vue")['default']
  WPomodoroWSettingsPanel: typeof import("../../src/runtime/components/WSettingsPanel.vue")['default']
  WPomodoroWShortcutHelp: typeof import("../../src/runtime/components/WShortcutHelp.vue")['default']
  WPomodoroWSoundscapePlayer: typeof import("../../src/runtime/components/WSoundscapePlayer.vue")['default']
  WPomodoroWStatsCard: typeof import("../../src/runtime/components/WStatsCard.vue")['default']
  WPomodoroWStatusBadge: typeof import("../../src/runtime/components/WStatusBadge.vue")['default']
  WPomodoroWTaskSelect: typeof import("../../src/runtime/components/WTaskSelect.vue")['default']
  WPomodoroWTimer: typeof import("../../src/runtime/components/WTimer.vue")['default']
  WPomodoroWTimerControls: typeof import("../../src/runtime/components/WTimerControls.vue")['default']
  WPomodoroWWeeklyChart: typeof import("../../src/runtime/components/WWeeklyChart.vue")['default']
  UnoIcon: typeof import("../../../../node_modules/.bun/@unocss+nuxt@66.6.0+0563dc395fa0b43b/node_modules/@unocss/nuxt/runtime/UnoIcon.vue")['default']
  NuxtWelcome: typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/welcome.vue")['default']
  NuxtLayout: typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/nuxt-layout")['default']
  NuxtErrorBoundary: typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
  ClientOnly: typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/client-only")['default']
  DevOnly: typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/dev-only")['default']
  ServerPlaceholder: typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/server-placeholder")['default']
  NuxtLink: typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/nuxt-link")['default']
  NuxtLoadingIndicator: typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
  NuxtTime: typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
  NuxtRouteAnnouncer: typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
  NuxtImg: typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
  NuxtPicture: typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
  NuxtPage: typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/pages/runtime/page-placeholder")['default']
  NoScript: typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/head/runtime/components")['NoScript']
  Link: typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/head/runtime/components")['Link']
  Base: typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/head/runtime/components")['Base']
  Title: typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/head/runtime/components")['Title']
  Meta: typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/head/runtime/components")['Meta']
  Style: typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/head/runtime/components")['Style']
  Head: typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/head/runtime/components")['Head']
  Html: typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/head/runtime/components")['Html']
  Body: typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/head/runtime/components")['Body']
  NuxtIsland: typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/nuxt-island")['default']
  LazyWPomodoroWFocusOverlay: LazyComponent<typeof import("../../src/runtime/components/WFocusOverlay.vue")['default']>
  LazyWPomodoroWMiniTimer: LazyComponent<typeof import("../../src/runtime/components/WMiniTimer.vue")['default']>
  LazyWPomodoroWNotificationToast: LazyComponent<typeof import("../../src/runtime/components/WNotificationToast.vue")['default']>
  LazyWPomodoroContainer: LazyComponent<typeof import("../../src/runtime/components/WPomodoroContainer.vue")['default']>
  LazyWPomodoroWSettingsPanel: LazyComponent<typeof import("../../src/runtime/components/WSettingsPanel.vue")['default']>
  LazyWPomodoroWShortcutHelp: LazyComponent<typeof import("../../src/runtime/components/WShortcutHelp.vue")['default']>
  LazyWPomodoroWSoundscapePlayer: LazyComponent<typeof import("../../src/runtime/components/WSoundscapePlayer.vue")['default']>
  LazyWPomodoroWStatsCard: LazyComponent<typeof import("../../src/runtime/components/WStatsCard.vue")['default']>
  LazyWPomodoroWStatusBadge: LazyComponent<typeof import("../../src/runtime/components/WStatusBadge.vue")['default']>
  LazyWPomodoroWTaskSelect: LazyComponent<typeof import("../../src/runtime/components/WTaskSelect.vue")['default']>
  LazyWPomodoroWTimer: LazyComponent<typeof import("../../src/runtime/components/WTimer.vue")['default']>
  LazyWPomodoroWTimerControls: LazyComponent<typeof import("../../src/runtime/components/WTimerControls.vue")['default']>
  LazyWPomodoroWWeeklyChart: LazyComponent<typeof import("../../src/runtime/components/WWeeklyChart.vue")['default']>
  LazyUnoIcon: LazyComponent<typeof import("../../../../node_modules/.bun/@unocss+nuxt@66.6.0+0563dc395fa0b43b/node_modules/@unocss/nuxt/runtime/UnoIcon.vue")['default']>
  LazyNuxtWelcome: LazyComponent<typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/welcome.vue")['default']>
  LazyNuxtLayout: LazyComponent<typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
  LazyNuxtErrorBoundary: LazyComponent<typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
  LazyClientOnly: LazyComponent<typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/client-only")['default']>
  LazyDevOnly: LazyComponent<typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/dev-only")['default']>
  LazyServerPlaceholder: LazyComponent<typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/server-placeholder")['default']>
  LazyNuxtLink: LazyComponent<typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/nuxt-link")['default']>
  LazyNuxtLoadingIndicator: LazyComponent<typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
  LazyNuxtTime: LazyComponent<typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
  LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
  LazyNuxtImg: LazyComponent<typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
  LazyNuxtPicture: LazyComponent<typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
  LazyNuxtPage: LazyComponent<typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/pages/runtime/page-placeholder")['default']>
  LazyNoScript: LazyComponent<typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/head/runtime/components")['NoScript']>
  LazyLink: LazyComponent<typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/head/runtime/components")['Link']>
  LazyBase: LazyComponent<typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/head/runtime/components")['Base']>
  LazyTitle: LazyComponent<typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/head/runtime/components")['Title']>
  LazyMeta: LazyComponent<typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/head/runtime/components")['Meta']>
  LazyStyle: LazyComponent<typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/head/runtime/components")['Style']>
  LazyHead: LazyComponent<typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/head/runtime/components")['Head']>
  LazyHtml: LazyComponent<typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/head/runtime/components")['Html']>
  LazyBody: LazyComponent<typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/head/runtime/components")['Body']>
  LazyNuxtIsland: LazyComponent<typeof import("../../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/nuxt-island")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}
