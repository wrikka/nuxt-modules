import { readonly, ref } from 'vue'

export type TransformType =
  | 'uppercase'
  | 'lowercase'
  | 'capitalize'
  | 'camelCase'
  | 'kebab-case'
  | 'snake_case'
  | 'base64-encode'
  | 'base64-decode'
  | 'url-encode'
  | 'url-decode'
  | 'slug'
  | 'reverse'
  | 'trim'

export interface TransformResult {
  original: string
  transformed: string
  type: TransformType
}

/**
 * Text Transformation - Transform text case and encoding
 */
export function useTextTransform() {
  const lastResult = ref<TransformResult | null>(null)

  const transforms: Record<TransformType, (text: string) => string> = {
    'uppercase': (t) => t.toUpperCase(),
    'lowercase': (t) => t.toLowerCase(),
    'capitalize': (t) => t.replace(/\b\w/g, c => c.toUpperCase()),
    'camelCase': (t) => t.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()),
    'kebab-case': (t) => t.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    'snake_case': (t) => t.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''),
    'base64-encode': (t) => btoa(t),
    'base64-decode': (t) => { try { return atob(t) } catch { return t } },
    'url-encode': (t) => encodeURIComponent(t),
    'url-decode': (t) => { try { return decodeURIComponent(t) } catch { return t } },
    'slug': (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    'reverse': (t) => t.split('').reverse().join(''),
    'trim': (t) => t.trim().replace(/\s+/g, ' ')
  }

  const transform = (text: string, type: TransformType): TransformResult => {
    const transformed = transforms[type](text)
    const result: TransformResult = { original: text, transformed, type }
    lastResult.value = result
    return result
  }

  const autoDetectAndTransform = (text: string): TransformResult | null => {
    const patterns: { type: TransformType; pattern: RegExp }[] = [
      { type: 'camelCase', pattern: /^[a-z]+([A-Z][a-z]+)+$/ },
      { type: 'kebab-case', pattern: /^[a-z]+(-[a-z]+)+$/ },
      { type: 'snake_case', pattern: /^[a-z]+(_[a-z]+)+$/ },
      { type: 'base64-decode', pattern: /^[A-Za-z0-9+/]*={0,2}$/ }
    ]

    for (const { type, pattern } of patterns) {
      if (pattern.test(text)) {
        const opposite: TransformType = type === 'base64-decode' ? 'base64-encode' : 'camelCase'
        return transform(text, opposite)
      }
    }

    return null
  }

  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text)
      return true
    }
    catch {
      return false
    }
  }

  const getAllTransforms = (text: string): TransformResult[] => {
    return (Object.keys(transforms) as TransformType[])
      .filter(t => t !== 'base64-decode' || /^[A-Za-z0-9+/]*={0,2}$/.test(text))
      .filter(t => t !== 'url-decode' || text.includes('%'))
      .map(type => transform(text, type))
  }

  return {
    lastResult: readonly(lastResult),
    transform,
    autoDetectAndTransform,
    copyToClipboard,
    getAllTransforms,
    availableTransforms: Object.keys(transforms) as TransformType[]
  }
}
