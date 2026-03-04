import { ref } from 'vue'

export interface CodeExecutionResult {
  id: string
  code: string
  language: string
  output: string
  error: string | null
  executionTime: number
  executedAt: Date
}

export function useCodeExecution() {
  const isExecuting = ref(false)
  const executionHistory = ref<CodeExecutionResult[]>([])
  const currentExecution = ref<CodeExecutionResult | null>(null)

  const supportedLanguages = [
    { id: 'javascript', name: 'JavaScript', extension: 'js' },
    { id: 'typescript', name: 'TypeScript', extension: 'ts' },
    { id: 'python', name: 'Python', extension: 'py' },
    { id: 'bash', name: 'Bash', extension: 'sh' },
    { id: 'json', name: 'JSON', extension: 'json' }
  ]

  const executeCode = async (code: string, language: string): Promise<CodeExecutionResult> => {
    isExecuting.value = true
    const startTime = performance.now()

    try {
      let output = ''
      let error: string | null = null

      switch (language) {
        case 'javascript':
        case 'typescript':
          try {
            const fn = new Function('console', `let logs = [];const mockConsole = {log: (...args) => logs.push(args.join(' ')),error: (...args) => logs.push('Error: ' + args.join(' ')),warn: (...args) => logs.push('Warning: ' + args.join(' '))};${code};return logs.join('\\n');`)
            output = fn({ log: (...args: any[]) => args.join(' '), error: (...args: any[]) => `Error: ${args.join(' ')}`, warn: (...args: any[]) => `Warning: ${args.join(' ')}` })
          } catch (e) { error = e instanceof Error ? e.message : 'Execution error' }
          break
        case 'python': output = '[Python execution would run on backend]\n' + code; break
        case 'bash': output = '[Bash execution would run on backend]\n$ ' + code; break
        case 'json':
          try { output = JSON.stringify(JSON.parse(code), null, 2) } catch (e) { error = 'Invalid JSON' }
          break
        default: error = `Language "${language}" is not supported`
      }

      const result: CodeExecutionResult = { id: crypto.randomUUID(), code, language, output: output || '(no output)', error, executionTime: performance.now() - startTime, executedAt: new Date() }
      executionHistory.value.unshift(result)
      currentExecution.value = result
      return result
    } finally { isExecuting.value = false }
  }

  return { isExecuting, executionHistory, currentExecution, supportedLanguages, executeCode }
}
