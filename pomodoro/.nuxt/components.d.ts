
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


export const WPomodoroWFocusOverlay: typeof import("../src/runtime/components/WFocusOverlay.vue")['default']
export const WPomodoroWMiniTimer: typeof import("../src/runtime/components/WMiniTimer.vue")['default']
export const WPomodoroWNotificationToast: typeof import("../src/runtime/components/WNotificationToast.vue")['default']
export const WPomodoroContainer: typeof import("../src/runtime/components/WPomodoroContainer.vue")['default']
export const WPomodoroWSettingsPanel: typeof import("../src/runtime/components/WSettingsPanel.vue")['default']
export const WPomodoroWShortcutHelp: typeof import("../src/runtime/components/WShortcutHelp.vue")['default']
export const WPomodoroWSoundscapePlayer: typeof import("../src/runtime/components/WSoundscapePlayer.vue")['default']
export const WPomodoroWStatsCard: typeof import("../src/runtime/components/WStatsCard.vue")['default']
export const WPomodoroWStatusBadge: typeof import("../src/runtime/components/WStatusBadge.vue")['default']
export const WPomodoroWTaskSelect: typeof import("../src/runtime/components/WTaskSelect.vue")['default']
export const WPomodoroWTimer: typeof import("../src/runtime/components/WTimer.vue")['default']
export const WPomodoroWTimerControls: typeof import("../src/runtime/components/WTimerControls.vue")['default']
export const WPomodoroWWeeklyChart: typeof import("../src/runtime/components/WWeeklyChart.vue")['default']
export const UnoIcon: typeof import("../../../node_modules/.bun/@unocss+nuxt@66.6.0+0563dc395fa0b43b/node_modules/@unocss/nuxt/runtime/UnoIcon.vue")['default']
export const NuxtWelcome: typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const NuxtPage: typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/pages/runtime/page-placeholder")['default']
export const NoScript: typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const LazyWPomodoroWFocusOverlay: LazyComponent<typeof import("../src/runtime/components/WFocusOverlay.vue")['default']>
export const LazyWPomodoroWMiniTimer: LazyComponent<typeof import("../src/runtime/components/WMiniTimer.vue")['default']>
export const LazyWPomodoroWNotificationToast: LazyComponent<typeof import("../src/runtime/components/WNotificationToast.vue")['default']>
export const LazyWPomodoroContainer: LazyComponent<typeof import("../src/runtime/components/WPomodoroContainer.vue")['default']>
export const LazyWPomodoroWSettingsPanel: LazyComponent<typeof import("../src/runtime/components/WSettingsPanel.vue")['default']>
export const LazyWPomodoroWShortcutHelp: LazyComponent<typeof import("../src/runtime/components/WShortcutHelp.vue")['default']>
export const LazyWPomodoroWSoundscapePlayer: LazyComponent<typeof import("../src/runtime/components/WSoundscapePlayer.vue")['default']>
export const LazyWPomodoroWStatsCard: LazyComponent<typeof import("../src/runtime/components/WStatsCard.vue")['default']>
export const LazyWPomodoroWStatusBadge: LazyComponent<typeof import("../src/runtime/components/WStatusBadge.vue")['default']>
export const LazyWPomodoroWTaskSelect: LazyComponent<typeof import("../src/runtime/components/WTaskSelect.vue")['default']>
export const LazyWPomodoroWTimer: LazyComponent<typeof import("../src/runtime/components/WTimer.vue")['default']>
export const LazyWPomodoroWTimerControls: LazyComponent<typeof import("../src/runtime/components/WTimerControls.vue")['default']>
export const LazyWPomodoroWWeeklyChart: LazyComponent<typeof import("../src/runtime/components/WWeeklyChart.vue")['default']>
export const LazyUnoIcon: LazyComponent<typeof import("../../../node_modules/.bun/@unocss+nuxt@66.6.0+0563dc395fa0b43b/node_modules/@unocss/nuxt/runtime/UnoIcon.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyNuxtPage: LazyComponent<typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/pages/runtime/page-placeholder")['default']>
export const LazyNoScript: LazyComponent<typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../../../node_modules/.bun/nuxt@4.3.1+b47c1926ebcf4be5/node_modules/nuxt/dist/app/components/nuxt-island")['default']>

export const componentNames: string[]
