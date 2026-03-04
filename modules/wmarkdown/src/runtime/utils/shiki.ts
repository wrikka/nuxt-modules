import { createHighlighterCore, type HighlighterCore } from 'shiki/core'
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'

let highlighter: HighlighterCore | null = null
let isInitializing = false
let initPromise: Promise<HighlighterCore> | null = null

const bundledLangs = [
  () => import('shiki/langs/javascript.mjs'),
  () => import('shiki/langs/typescript.mjs'),
  () => import('shiki/langs/vue.mjs'),
  () => import('shiki/langs/bash.mjs'),
  () => import('shiki/langs/json.mjs'),
  () => import('shiki/langs/yaml.mjs'),
  () => import('shiki/langs/css.mjs'),
  () => import('shiki/langs/html.mjs'),
  () => import('shiki/langs/rust.mjs'),
  () => import('shiki/langs/python.mjs'),
  () => import('shiki/langs/markdown.mjs'),
  () => import('shiki/langs/sql.mjs'),
  () => import('shiki/langs/dockerfile.mjs'),
  () => import('shiki/langs/nix.mjs'),
  () => import('shiki/langs/regex.mjs'),
]

const bundledThemes = [
  () => import('shiki/themes/github-light.mjs'),
  () => import('shiki/themes/github-dark.mjs'),
  () => import('shiki/themes/vitesse-light.mjs'),
  () => import('shiki/themes/vitesse-dark.mjs'),
  () => import('shiki/themes/catppuccin-latte.mjs'),
  () => import('shiki/themes/catppuccin-mocha.mjs'),
]

export async function initHighlighter(): Promise<HighlighterCore> {
  if (highlighter) return highlighter

  if (isInitializing && initPromise) {
    return initPromise
  }

  isInitializing = true
  initPromise = createHighlighterCore({
    themes: bundledThemes.map(load => load()),
    langs: bundledLangs.map(load => load()),
    engine: createOnigurumaEngine(() => import('shiki/wasm')
  })

  highlighter = await initPromise
  isInitializing = false
  return highlighter
}

export function useHighlighter(): HighlighterCore | null {
  return highlighter
}

export async function highlightCode(
  code: string,
  lang: string,
  theme: string = 'github-light'
): Promise<string> {
  const instance = await initHighlighter()

  const loadedLangs = instance.getLoadedLanguages()
  if (!loadedLangs.includes(lang)) {
    const bundledLang = bundledLangs.find(l => {
      const mod = l()
      return mod.id === lang || mod.aliases?.includes(lang)
    })

    if (bundledLang) {
      await instance.loadLanguage(await bundledLang())
    } else {
      lang = 'text'
    }
  }

  const loadedThemes = instance.getLoadedThemes()
  if (!loadedThemes.includes(theme)) {
    await instance.loadTheme(await import(`shiki/themes/${theme}.mjs`))
  }

  return instance.codeToHtml(code, {
    lang,
    theme,
    transformers: [
      {
        pre(node) {
          node.properties.class = `shiki ${theme}`
        },
        code(node) {
          node.properties['data-lang'] = lang
        }
      }
    ]
  })
}

export async function highlightCodeWithMultipleThemes(
  code: string,
  lang: string,
  themes: { light: string; dark: string }
): Promise<{ light: string; dark: string }> {
  const [light, dark] = await Promise.all([
    highlightCode(code, lang, themes.light),
    highlightCode(code, lang, themes.dark)
  ])

  return { light, dark }
}

export function getAvailableLanguages(): string[] {
  return highlighter?.getLoadedLanguages() || []
}

export function getAvailableThemes(): string[] {
  return highlighter?.getLoadedThemes() || []
}

export async function loadAdditionalLanguage(lang: string): Promise<boolean> {
  if (!highlighter) return false

  try {
    const mod = await import(`shiki/langs/${lang}.mjs`)
    await highlighter.loadLanguage(mod)
    return true
  } catch {
    return false
  }
}

export async function loadAdditionalTheme(theme: string): Promise<boolean> {
  if (!highlighter) return false

  try {
    const mod = await import(`shiki/themes/${theme}.mjs`)
    await highlighter.loadTheme(mod)
    return true
  } catch {
    return false
  }
}
