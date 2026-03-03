// Chat configuration settings
export const CHAT_CONFIG = {
  // Message limits
  MAX_MESSAGE_LENGTH: 4000,
  MAX_SESSION_MESSAGES: 100,
  
  // UI settings
  SCROLL_BEHAVIOR: 'smooth' as const,
  AUTO_SCROLL_TO_BOTTOM: true,
  
  // Performance
  DEBOUNCE_DELAY: 300,
  TYPING_INDICATOR_DELAY: 1000,
  
  // Storage
  STORAGE_KEY: 'wai-chat-sessions',
  BACKUP_INTERVAL: 5 * 60 * 1000, // 5 minutes
} as const

export type ChatConfig = typeof CHAT_CONFIG
