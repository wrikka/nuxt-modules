import { ref, computed } from 'vue'

export interface ContentShape {
  type: 'text' | 'code' | 'table' | 'list' | 'markdown' | 'json' | 'yaml' | 'xml'
  confidence: number
  metadata?: Record<string, any>
}

export interface DetectionResult {
  shape: ContentShape
  startIndex: number
  endIndex: number
  content: string
}

export function useContentShapeDetection() {
  const isDetecting = ref(false)
  const detectionResults = ref<DetectionResult[]>([])

  const codePatterns = [
    { pattern: /```[\s\S]*?```/g, type: 'code' as const },
    { pattern: /`[^`]+`/g, type: 'code' as const },
    { pattern: /(function|const|let|var|class|import|export)\s+\w+/g, type: 'code' as const }
  ]

  const tablePatterns = [
    { pattern: /\|.*\|/g, type: 'table' as const },
    { pattern: /^\|.*\|$/gm, type: 'table' as const }
  ]

  const listPatterns = [
    { pattern: /^[-*+]\s+/gm, type: 'list' as const },
    { pattern: /^\d+\.\s+/gm, type: 'list' as const }
  ]

  const jsonPattern = { pattern: /\{[\s\S]*\}/g, type: 'json' as const }
  const yamlPattern = { pattern: /^[\s\S]*:/gm, type: 'yaml' as const }
  const xmlPattern = { pattern: /<[^>]+>[\s\S]*<\/[^>]+>/g, type: 'xml' as const }

  const detectShapes = (content: string): DetectionResult[] => {
    const results: DetectionResult[] = []
    const patterns = [
      ...codePatterns,
      ...tablePatterns,
      ...listPatterns,
      jsonPattern,
      yamlPattern,
      xmlPattern
    ]

    patterns.forEach(({ pattern, type }) => {
      let match
      while ((match = pattern.exec(content)) !== null) {
        results.push({
          shape: {
            type,
            confidence: calculateConfidence(match[0], type),
            metadata: getMetadata(match[0], type)
          },
          startIndex: match.index,
          endIndex: match.index + match[0].length,
          content: match[0]
        })
      }
    })

    return results.sort((a, b) => a.startIndex - b.startIndex)
  }

  const calculateConfidence = (content: string, type: ContentShape['type']): number => {
    switch (type) {
      case 'code':
        return content.includes('```') ? 0.9 : 0.6
      case 'table':
        return content.split('|').length > 3 ? 0.8 : 0.5
      case 'list':
        return /^[-*+\d]/.test(content.trim()) ? 0.9 : 0.4
      case 'json':
        try {
          JSON.parse(content)
          return 0.95
        } catch {
          return 0.3
        }
      default:
        return 0.5
    }
  }

  const getMetadata = (content: string, type: ContentShape['type']): Record<string, any> => {
    const metadata: Record<string, any> = {}
    
    if (type === 'code') {
      const langMatch = content.match(/```(\w+)/)
      if (langMatch) {
        metadata.language = langMatch[1]
      }
    }
    
    if (type === 'table') {
      metadata.columns = content.split('|').length - 1
    }
    
    if (type === 'list') {
      metadata.items = content.split('\n').filter(line => /^[-*+\d]/.test(line.trim())).length
    }
    
    return metadata
  }

  const detectContentShapes = async (content: string) => {
    isDetecting.value = true
    try {
      detectionResults.value = detectShapes(content)
    } finally {
      isDetecting.value = false
    }
  }

  const getShapeAtPosition = (position: number): DetectionResult | null => {
    return detectionResults.value.find(result => 
      position >= result.startIndex && position <= result.endIndex
    ) || null
  }

  const getShapesByType = (type: ContentShape['type']): DetectionResult[] => {
    return detectionResults.value.filter(result => result.shape.type === type)
  }

  return {
    isDetecting,
    detectionResults,
    detectContentShapes,
    getShapeAtPosition,
    getShapesByType
  }
}
