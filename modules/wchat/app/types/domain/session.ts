// Session-related types

export interface SessionFilterMetadata {
  tags?: string[]
  category?: string
  isPinned?: boolean
  isArchived?: boolean
}

export interface SessionFilter {
  query?: string
  tags?: string[]
  category?: string
  dateRange?: {
    start: Date
    end: Date
  }
}

export interface SessionExport {
  format: 'json' | 'markdown' | 'txt'
  includeMetadata?: boolean
  messageFilter?: (message: any) => boolean
}

export interface SessionImport {
  source: 'file' | 'url' | 'clipboard'
  format: 'json' | 'markdown' | 'txt'
  mergeStrategy?: 'replace' | 'append' | 'merge'
}
