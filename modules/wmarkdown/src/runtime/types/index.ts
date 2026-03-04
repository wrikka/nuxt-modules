export interface ShikiOptions {
  theme: string
  darkTheme?: string
  langs?: string[]
}

export interface FeatureOptions {
  linkPreview: boolean
  toc: boolean
  tables: boolean
  interactive: boolean
  mermaid: boolean
  katex: boolean
  callout: boolean
  embed: boolean
  taskList: boolean
  emoji: boolean
  autolink: boolean
  footnote: boolean
  diffHighlight: boolean
  copyButton: boolean
}

export interface ModuleOptions {
  shiki?: ShikiOptions
  features?: FeatureOptions
}

export interface MarkdownToken {
  type: string
  content?: string
  children?: MarkdownToken[]
  props?: Record<string, unknown>
}

export interface TocItem {
  id: string
  text: string
  level: number
  children?: TocItem[]
}

export interface LinkPreview {
  url: string
  title?: string
  description?: string
  image?: string
}

export interface Plugin {
  name: string
  transform: (tokens: MarkdownToken[]) => MarkdownToken[]
}

export interface BlockEditorOptions {
  slashCommands: SlashCommand[]
}

export interface SlashCommand {
  id: string
  label: string
  icon: string
  description: string
  action: () => void
}

export interface CollaborativeOptions {
  enabled: boolean
  provider: 'yjs' | 'webrtc' | 'socketio'
  roomId?: string
}

export interface ImageUploadOptions {
  enabled: boolean
  endpoint?: string
  maxSize?: number
  allowedTypes?: string[]
}

export interface ExportOptions {
  pdf: boolean
  word: boolean
  markdown: boolean
}

export interface Comment {
  id: string
  text: string
  author: string
  timestamp: number
  position: { start: number; end: number }
}
