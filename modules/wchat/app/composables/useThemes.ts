import type { ChatTheme, ThemePreset } from '../types'

// Chat Themes - Wallpaper, colors, fonts
export const useChatThemes = () => {
  const config = useRuntimeConfig()
  const currentTheme = useLocalStorage<ChatTheme>('wchat:theme', {
    id: 'default',
    name: 'Default',
    wallpaper: null,
    bubbleColors: {
      own: '#007AFF',
      other: '#E9ECEF'
    },
    fontSize: 16,
    fontFamily: 'system-ui',
    darkMode: false,
    blurEffects: true,
    animations: true
  })

  // Preset themes
  const presets: ThemePreset[] = [
    {
      id: 'default',
      name: 'Default',
      preview: '#007AFF',
      theme: currentTheme.value
    },
    {
      id: 'dark',
      name: 'Dark',
      preview: '#1C1C1E',
      theme: {
        ...currentTheme.value,
        id: 'dark',
        name: 'Dark',
        wallpaper: null,
        bubbleColors: {
          own: '#0A84FF',
          other: '#3A3A3C'
        },
        darkMode: true
      }
    },
    {
      id: 'midnight',
      name: 'Midnight',
      preview: '#000000',
      theme: {
        ...currentTheme.value,
        id: 'midnight',
        name: 'Midnight',
        wallpaper: null,
        bubbleColors: {
          own: '#32D74B',
          other: '#1C1C1E'
        },
        darkMode: true
      }
    },
    {
      id: 'sunset',
      name: 'Sunset',
      preview: '#FF6B6B',
      theme: {
        ...currentTheme.value,
        id: 'sunset',
        name: 'Sunset',
        wallpaper: '/wallpapers/sunset.jpg',
        bubbleColors: {
          own: '#FF6B6B',
          other: '#FFE66D'
        },
        darkMode: false
      }
    },
    {
      id: 'ocean',
      name: 'Ocean',
      preview: '#4ECDC4',
      theme: {
        ...currentTheme.value,
        id: 'ocean',
        name: 'Ocean',
        wallpaper: '/wallpapers/ocean.jpg',
        bubbleColors: {
          own: '#4ECDC4',
          other: '#95E1D3'
        },
        darkMode: false
      }
    },
    {
      id: 'forest',
      name: 'Forest',
      preview: '#2ECC71',
      theme: {
        ...currentTheme.value,
        id: 'forest',
        name: 'Forest',
        wallpaper: '/wallpapers/forest.jpg',
        bubbleColors: {
          own: '#2ECC71',
          other: '#D5F5E3'
        },
        darkMode: false
      }
    }
  ]

  // Apply preset
  const applyPreset = (presetId: string): void => {
    const preset = presets.find(p => p.id === presetId)
    if (preset) {
      currentTheme.value = { ...preset.theme }
    }
  }

  // Set wallpaper
  const setWallpaper = (url: string | null): void => {
    currentTheme.value.wallpaper = url
  }

  // Upload custom wallpaper
  const uploadWallpaper = async (file: File): Promise<string | null> => {
    const formData = new FormData()
    formData.append('wallpaper', file)

    const { url } = await $fetch<{ url: string }>('/api/chat/themes/wallpaper', {
      method: 'POST',
      body: formData
    })

    setWallpaper(url)
    return url
  }

  // Set bubble color
  const setBubbleColor = (type: 'own' | 'other', color: string): void => {
    currentTheme.value.bubbleColors[type] = color
  }

  // Set font size
  const setFontSize = (size: number): void => {
    currentTheme.value.fontSize = Math.max(12, Math.min(24, size))
  }

  // Toggle dark mode
  const toggleDarkMode = (enabled?: boolean): void => {
    currentTheme.value.darkMode = enabled !== undefined ? enabled : !currentTheme.value.darkMode
  }

  // Toggle blur effects
  const toggleBlur = (enabled?: boolean): void => {
    currentTheme.value.blurEffects = enabled !== undefined ? enabled : !currentTheme.value.blurEffects
  }

  // Toggle animations
  const toggleAnimations = (enabled?: boolean): void => {
    currentTheme.value.animations = enabled !== undefined ? enabled : !currentTheme.value.animations
  }

  // Reset to default
  const resetToDefault = (): void => {
    applyPreset('default')
  }

  // CSS variables based on theme
  const cssVariables = computed(() => {
    const theme = currentTheme.value
    return {
      '--wchat-bubble-own': theme.bubbleColors.own,
      '--wchat-bubble-other': theme.bubbleColors.other,
      '--wchat-font-size': `${theme.fontSize}px`,
      '--wchat-font-family': theme.fontFamily,
      '--wchat-wallpaper': theme.wallpaper ? `url(${theme.wallpaper})` : 'none'
    }
  })

  // Chat-specific themes
  const chatThemes = useLocalStorage<Record<string, ChatTheme>>('wchat:chat-themes', {})

  const setChatTheme = (chatId: string, theme: Partial<ChatTheme>): void => {
    chatThemes.value[chatId] = { ...currentTheme.value, ...theme }
  }

  const getChatTheme = (chatId: string): ChatTheme => {
    return chatThemes.value[chatId] || currentTheme.value
  }

  return {
    currentTheme: readonly(currentTheme),
    presets: readonly(presets),
    cssVariables: readonly(cssVariables),
    chatThemes: readonly(chatThemes),
    applyPreset,
    setWallpaper,
    uploadWallpaper,
    setBubbleColor,
    setFontSize,
    toggleDarkMode,
    toggleBlur,
    toggleAnimations,
    resetToDefault,
    setChatTheme,
    getChatTheme
  }
}

// Message Effects - Send animations
export const useMessageEffects = () => {
  const config = useRuntimeConfig()
  const selectedEffect = useLocalStorage<string | null>('wchat:message-effect', null)

  const effects = [
    { id: 'none', name: 'None', icon: 'i-lucide-circle' },
    { id: 'slide', name: 'Slide', icon: 'i-lucide-arrow-right' },
    { id: 'bounce', name: 'Bounce', icon: 'i-lucide-move-vertical' },
    { id: 'explode', name: 'Explode', icon: 'i-lucide-sparkles' },
    { id: 'fade', name: 'Fade', icon: 'i-lucide-sun' },
    { id: 'zoom', name: 'Zoom', icon: 'i-lucide-maximize-2' }
  ]

  const setEffect = (effectId: string | null): void => {
    selectedEffect.value = effectId
  }

  const applyEffect = (element: HTMLElement, effectId: string): void => {
    if (!config.public.wchat?.enableMessageEffects) return

    const animations: Record<string, string> = {
      slide: 'slideInRight 0.3s ease-out',
      bounce: 'bounce 0.5s ease-out',
      explode: 'explode 0.5s ease-out',
      fade: 'fadeIn 0.3s ease-out',
      zoom: 'zoomIn 0.3s ease-out'
    }

    const animation = animations[effectId]
    if (animation) {
      element.style.animation = animation
      setTimeout(() => {
        element.style.animation = ''
      }, 500)
    }
  }

  return {
    effects: readonly(effects),
    selectedEffect: readonly(selectedEffect),
    setEffect,
    applyEffect
  }
}
