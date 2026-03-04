import type { TranslationCache, TranslationResult } from '../types'

// Message Translation - Real-time 100+ languages
export const useMessageTranslation = () => {
  const config = useRuntimeConfig()
  const isTranslating = ref(false)
  const supportedLanguages = ref<string[]>([])
  const translationCache = ref<Map<string, TranslationResult>>(new Map())
  const autoTranslate = ref(false)
  const preferredLanguage = ref('en')
  const translationHistory = ref<TranslationResult[]>([])

  // Load supported languages
  const loadSupportedLanguages = async (): Promise<string[]> => {
    if (!config.public.wchat?.enableTranslation) return []

    try {
      const data = await $fetch<string[]>('/api/chat/translation/languages')
      supportedLanguages.value = data
      return data
    } catch {
      // Fallback to common languages
      supportedLanguages.value = [
        'en', 'th', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ar', 'hi'
      ]
      return supportedLanguages.value
    }
  }

  // Translate text
  const translateText = async (
    text: string,
    targetLang: string,
    sourceLang?: string
  ): Promise<TranslationResult | null> => {
    if (!config.public.wchat?.enableTranslation) return null
    if (!text.trim()) return null

    // Check cache
    const cacheKey = `${text}_${sourceLang || 'auto'}_${targetLang}`
    const cached = translationCache.value.get(cacheKey)
    if (cached) return cached

    isTranslating.value = true
    try {
      const result = await $fetch<TranslationResult>('/api/chat/translation', {
        method: 'POST',
        body: {
          text,
          targetLang,
          sourceLang
        }
      })

      // Cache result
      translationCache.value.set(cacheKey, result)

      // Add to history
      translationHistory.value.unshift(result)
      if (translationHistory.value.length > 50) {
        translationHistory.value = translationHistory.value.slice(0, 50)
      }

      return result
    } catch {
      return null
    } finally {
      isTranslating.value = false
    }
  }

  // Detect language
  const detectLanguage = async (text: string): Promise<string | null> => {
    if (!config.public.wchat?.enableTranslation) return null

    try {
      const result = await $fetch<{ language: string }>('/api/chat/translation/detect', {
        method: 'POST',
        body: { text }
      })
      return result.language
    } catch {
      return null
    }
  }

  // Translate message (with caching)
  const translateMessage = async (
    messageId: string,
    text: string,
    targetLang: string
  ): Promise<TranslationResult | null> => {
    // Check if we already have this message translated
    const messageKey = `msg_${messageId}_${targetLang}`
    const cached = translationCache.value.get(messageKey)
    if (cached) return cached

    const result = await translateText(text, targetLang)
    if (result) {
      translationCache.value.set(messageKey, result)
    }
    return result
  }

  // Toggle auto-translation
  const toggleAutoTranslate = (enabled?: boolean): void => {
    autoTranslate.value = enabled !== undefined ? enabled : !autoTranslate.value
  }

  // Set preferred language
  const setPreferredLanguage = (lang: string): void => {
    preferredLanguage.value = lang
  }

  // Clear translation cache
  const clearCache = (): void => {
    translationCache.value.clear()
  }

  // Get translation for specific message
  const getTranslation = (messageId: string, targetLang: string): TranslationResult | undefined => {
    return translationCache.value.get(`msg_${messageId}_${targetLang}`)
  }

  // Check if message needs translation
  const needsTranslation = async (text: string, targetLang: string): Promise<boolean> => {
    const detected = await detectLanguage(text)
    return detected !== null && detected !== targetLang
  }

  // Bulk translate (for chat history)
  const bulkTranslate = async (
    texts: Array<{ id: string; text: string }>,
    targetLang: string
  ): Promise<Map<string, TranslationResult>> => {
    const results = new Map<string, TranslationResult>()

    await Promise.all(
      texts.map(async ({ id, text }) => {
        const translation = await translateMessage(id, text, targetLang)
        if (translation) {
          results.set(id, translation)
        }
      })
    )

    return results
  }

  // Get language name
  const getLanguageName = (code: string): string => {
    const names: Record<string, string> = {
      en: 'English',
      th: 'Thai',
      zh: 'Chinese',
      ja: 'Japanese',
      ko: 'Korean',
      es: 'Spanish',
      fr: 'French',
      de: 'German',
      it: 'Italian',
      pt: 'Portuguese',
      ru: 'Russian',
      ar: 'Arabic',
      hi: 'Hindi'
    }
    return names[code] || code
  }

  // Get flag emoji for language
  const getLanguageFlag = (code: string): string => {
    const flags: Record<string, string> = {
      en: '🇬🇧',
      th: '🇹🇭',
      zh: '🇨🇳',
      ja: '🇯🇵',
      ko: '🇰🇷',
      es: '🇪🇸',
      fr: '🇫🇷',
      de: '🇩🇪',
      it: '🇮🇹',
      pt: '🇵🇹',
      ru: '🇷🇺',
      ar: '🇸🇦',
      hi: '🇮🇳'
    }
    return flags[code] || '🌐'
  }

  return {
    isTranslating: readonly(isTranslating),
    supportedLanguages: readonly(supportedLanguages),
    translationCache: readonly(translationCache),
    autoTranslate: readonly(autoTranslate),
    preferredLanguage: readonly(preferredLanguage),
    translationHistory: readonly(translationHistory),
    loadSupportedLanguages,
    translateText,
    detectLanguage,
    translateMessage,
    toggleAutoTranslate,
    setPreferredLanguage,
    clearCache,
    getTranslation,
    needsTranslation,
    bulkTranslate,
    getLanguageName,
    getLanguageFlag
  }
}

// Quick translate hook for single messages
export const useQuickTranslate = () => {
  const { translateMessage, preferredLanguage, isTranslating } = useMessageTranslation()
  const showTranslation = ref(false)
  const translatedText = ref('')

  const toggleTranslation = async (messageId: string, originalText: string): Promise<void> => {
    if (showTranslation.value) {
      showTranslation.value = false
      translatedText.value = ''
      return
    }

    const result = await translateMessage(messageId, originalText, preferredLanguage.value)
    if (result) {
      translatedText.value = result.translatedText
      showTranslation.value = true
    }
  }

  return {
    showTranslation: readonly(showTranslation),
    translatedText: readonly(translatedText),
    isTranslating,
    toggleTranslation
  }
}
