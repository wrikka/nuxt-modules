// Chat mode types

export interface ChatMode {
  id: string
  name: string
  description: string
  icon?: string
  config?: {
    model?: string
    temperature?: number
    maxTokens?: number
    systemPrompt?: string
  }
  capabilities?: string[]
}

export interface ModeConfig {
  defaultMode: string
  availableModes: ChatMode[]
  customModes?: ChatMode[]
}

export interface ModeSwitch {
  fromMode: string
  toMode: string
  preserveContext?: boolean
  transferSettings?: string[]
}
