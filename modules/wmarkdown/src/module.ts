import { defineNuxtModule, createResolver, addImports, addComponentsDir, addServerHandler, addPlugin } from '@nuxt/kit'
import { defu } from 'defu'
import type { ModuleOptions } from './runtime/types'

export type { ModuleOptions }

const defaults: ModuleOptions = {
  shiki: {
    theme: 'github-light',
    darkTheme: 'github-dark',
    langs: ['typescript', 'javascript', 'vue', 'bash', 'json', 'yaml', 'css', 'html', 'rust', 'python']
  },
  features: {
    linkPreview: true,
    toc: true,
    tables: true,
    interactive: true,
    mermaid: true,
    katex: true,
    callout: true,
    embed: true,
    taskList: true,
    emoji: true,
    autolink: true,
    footnote: true,
    diffHighlight: true,
    copyButton: true
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@wrikka/wmarkdown',
    configKey: 'wmarkdown'
  },
  defaults,
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Add runtime config
    nuxt.options.runtimeConfig.public.wmarkdown = defu(
      nuxt.options.runtimeConfig.public.wmarkdown,
      options
    )

    // Add plugin
    addPlugin({
      src: resolver.resolve('./runtime/plugins/shiki')
    })

    addPlugin({
      src: resolver.resolve('./runtime/plugins/mermaid-katex'),
      mode: 'client'
    })

    addPlugin({
      src: resolver.resolve('./runtime/plugins/copy-button'),
      mode: 'client'
    })

    // Add composables
    addImports([
      { name: 'useMarkdownParser', from: resolver.resolve('./runtime/composables/useMarkdownParser') },
      { name: 'useShikiHighlighter', from: resolver.resolve('./runtime/composables/useShikiHighlighter') },
      { name: 'useToc', from: resolver.resolve('./runtime/composables/useToc') },
      { name: 'useLinkPreview', from: resolver.resolve('./runtime/composables/useLinkPreview') },
      { name: 'useMermaid', from: resolver.resolve('./runtime/composables/useMermaid') },
      { name: 'useKatex', from: resolver.resolve('./runtime/composables/useKatex') },
      // New composables for features 3-20
      { name: 'useBlockEditor', from: resolver.resolve('./runtime/composables/useBlockEditor') },
      { name: 'useCollaborativeEditor', from: resolver.resolve('./runtime/composables/useCollaborativeEditor') },
      { name: 'usePluginSystem', from: resolver.resolve('./runtime/composables/usePluginSystem') },
      { name: 'useImageUpload', from: resolver.resolve('./runtime/composables/useImageUpload') },
      { name: 'useTocScrollSpy', from: resolver.resolve('./runtime/composables/useTocScrollSpy') },
      { name: 'useSandpack', from: resolver.resolve('./runtime/composables/useSandpack') },
      { name: 'useCallout', from: resolver.resolve('./runtime/composables/useCallout') },
      { name: 'useFootnotes', from: resolver.resolve('./runtime/composables/useFootnotes') },
      { name: 'useTaskList', from: resolver.resolve('./runtime/composables/useTaskList') },
      { name: 'useAutolink', from: resolver.resolve('./runtime/composables/useAutolink') },
      { name: 'useEmoji', from: resolver.resolve('./runtime/composables/useEmoji') },
      { name: 'useEmbed', from: resolver.resolve('./runtime/composables/useEmbed') },
      { name: 'useDiffHighlight', from: resolver.resolve('./runtime/composables/useDiffHighlight') },
      { name: 'useCopyButton', from: resolver.resolve('./runtime/composables/useCopyButton') },
      { name: 'useWordCount', from: resolver.resolve('./runtime/composables/useWordCount') },
      { name: 'useReadingTime', from: resolver.resolve('./runtime/composables/useReadingTime') },
      { name: 'useExport', from: resolver.resolve('./runtime/composables/useExport') },
      { name: 'useComments', from: resolver.resolve('./runtime/composables/useComments') },
      // Additional composables for idea features 1-22
      { name: 'useAIAutocomplete', from: resolver.resolve('./runtime/composables/useAIAutocomplete') },
      { name: 'useSmartSearch', from: resolver.resolve('./runtime/composables/useSmartSearch') },
      { name: 'useVersionHistory', from: resolver.resolve('./runtime/composables/useVersionHistory') },
      { name: 'useDragDropBlocks', from: resolver.resolve('./runtime/composables/useDragDropBlocks') },
      { name: 'useMindMapView', from: resolver.resolve('./runtime/composables/useMindMapView') },
      { name: 'useGraphView', from: resolver.resolve('./runtime/composables/useGraphView') },
      { name: 'useWebClipper', from: resolver.resolve('./runtime/composables/useWebClipper') },
      { name: 'useVoiceDictation', from: resolver.resolve('./runtime/composables/useVoiceDictation') },
      { name: 'useOCR', from: resolver.resolve('./runtime/composables/useOCR') },
      { name: 'usePresentationMode', from: resolver.resolve('./runtime/composables/usePresentationMode') },
      { name: 'useDatabaseView', from: resolver.resolve('./runtime/composables/useDatabaseView') },
      { name: 'usePomodoroTimer', from: resolver.resolve('./runtime/composables/usePomodoroTimer') },
      { name: 'useDailyJournal', from: resolver.resolve('./runtime/composables/useDailyJournal') },
      { name: 'useFlashcards', from: resolver.resolve('./runtime/composables/useFlashcards') },
      { name: 'useSpacedRepetition', from: resolver.resolve('./runtime/composables/useSpacedRepetition') },
      { name: 'useRSSGenerator', from: resolver.resolve('./runtime/composables/useRSSGenerator') },
      { name: 'useCommandPalette', from: resolver.resolve('./runtime/composables/useCommandPalette') },
      { name: 'useZenMode', from: resolver.resolve('./runtime/composables/useZenMode') }
    ])

    // Add components
    addComponentsDir({
      path: resolver.resolve('./runtime/components'),
      prefix: 'WMarkdown',
      pathPrefix: false
    })

    // Add server handlers
    addServerHandler({
      route: '/api/wmarkdown/parse',
      handler: resolver.resolve('./runtime/server/api/parse.post')
    })

    addServerHandler({
      route: '/api/wmarkdown/preview',
      handler: resolver.resolve('./runtime/server/api/preview.get')
    })
  }
})
