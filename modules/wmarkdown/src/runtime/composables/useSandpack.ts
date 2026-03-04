import { ref, computed } from 'vue'

interface SandpackTemplate {
  name: string
  files: Record<string, string>
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

const templates: Record<string, SandpackTemplate> = {
  vanilla: {
    name: 'Vanilla JS',
    files: {
      'index.html': `<!DOCTYPE html>
<html>
  <body>
    <div id="app"></div>
    <script src="index.js"></script>
  </body>
</html>`,
      'index.js': `document.getElementById('app').innerHTML = '<h1>Hello World</h1>';`,
      'styles.css': `body { font-family: sans-serif; }`
    }
  },
  vue: {
    name: 'Vue',
    files: {
      'index.html': `<!DOCTYPE html>
<html>
  <body>
    <div id="app"></div>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script src="index.js"></script>
  </body>
</html>`,
      'index.js': `const { createApp } = Vue;

createApp({
  template: '<h1>Hello Vue</h1>'
}).mount('#app');`
    },
    dependencies: {
      vue: '^3.0.0'
    }
  },
  react: {
    name: 'React',
    files: {
      'index.html': `<!DOCTYPE html>
<html>
  <body>
    <div id="root"></div>
    <script src="index.js"></script>
  </body>
</html>`,
      'index.js': `import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return <h1>Hello React</h1>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`
    },
    dependencies: {
      react: '^18.0.0',
      'react-dom': '^18.0.0'
    }
  },
  typescript: {
    name: 'TypeScript',
    files: {
      'index.ts': `console.log('Hello TypeScript');`,
      'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true
  }
}`
    }
  }
}

export function useSandpack() {
  const isRunning = ref(false)
  const output = ref('')
  const error = ref<string | null>(null)
  const selectedTemplate = ref<string>('vanilla')
  const customFiles = ref<Record<string, string>>({})

  const currentTemplate = computed(() => {
    return templates[selectedTemplate.value] || templates.vanilla
  })

  const allFiles = computed(() => {
    return {
      ...currentTemplate.value.files,
      ...customFiles.value
    }
  })

  const runCode = async (code: string, language: string = 'javascript') => {
    isRunning.value = true
    error.value = null
    output.value = ''

    try {
      if (language === 'javascript' || language === 'js') {
        const consoleOutput: string[] = []
        const mockConsole = {
          log: (...args: unknown[]) => {
            consoleOutput.push(args.map(arg => String(arg)).join(' '))
          },
          error: (...args: unknown[]) => {
            consoleOutput.push('Error: ' + args.map(arg => String(arg)).join(' '))
          }
        }

        const fn = new Function('console', code)
        fn(mockConsole)

        output.value = consoleOutput.join('\n')
      } else if (language === 'typescript' || language === 'ts') {
        output.value = 'TypeScript compilation not supported in browser. Use the preview iframe instead.'
      } else {
        output.value = 'Running preview in iframe...'
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Execution failed'
    } finally {
      isRunning.value = false
    }
  }

  const selectTemplate = (template: string) => {
    if (templates[template]) {
      selectedTemplate.value = template
      customFiles.value = {}
    }
  }

  const updateFile = (filename: string, content: string) => {
    customFiles.value[filename] = content
  }

  const getPreviewUrl = () => {
    const blob = new Blob([
      allFiles.value['index.html'] || '<h1>No HTML file</h1>'
    ], { type: 'text/html' })
    return URL.createObjectURL(blob)
  }

  const reset = () => {
    customFiles.value = {}
    output.value = ''
    error.value = null
  }

  return {
    isRunning,
    output,
    error,
    selectedTemplate,
    customFiles,
    templates,
    currentTemplate,
    allFiles,
    runCode,
    selectTemplate,
    updateFile,
    getPreviewUrl,
    reset
  }
}
