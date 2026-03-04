import { readonly, ref } from 'vue'

export interface MathResult {
  expression: string
  result: number
  formatted: string
}

/**
 * Quick Math - Calculate expressions in search box
 */
export function useQuickMath() {
  const lastResult = ref<MathResult | null>(null)

  const isMathExpression = (query: string): boolean => {
    return /^[\d\s\+\-\*\/\%\^\(\)\.\,]+$/.test(query) && /[\+\-\*\/\%\^]/.test(query)
  }

  const evaluate = (expression: string): MathResult | null => {
    try {
      const sanitized = expression
        .replace(/\^/g, '**')
        .replace(/,/g, '')
        .replace(/[^\d\s\+\-\*\/\%\(\)\.]/g, '')

      if (!sanitized || !/[\+\-\*\/\%\*]/.test(sanitized)) return null

      const result = Function(`"use strict"; return (${sanitized})`)()

      if (typeof result !== 'number' || !isFinite(result)) return null

      lastResult.value = {
        expression,
        result,
        formatted: result.toLocaleString()
      }

      return lastResult.value
    }
    catch {
      return null
    }
  }

  const getCommonCalculations = (): MathResult[] => {
    return [
      { expression: '10 * 10', result: 100, formatted: '100' },
      { expression: '1024 / 8', result: 128, formatted: '128' },
      { expression: '60 * 60 * 24', result: 86400, formatted: '86,400' }
    ]
  }

  return {
    lastResult: readonly(lastResult),
    isMathExpression,
    evaluate,
    getCommonCalculations
  }
}
