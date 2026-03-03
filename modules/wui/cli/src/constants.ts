export const MESSAGES = {
  intro: {
    create: '✨ Create WUI Component',
    dev: '🚀 WUI Development Server',
    build: '🔨 Build WUI Packages',
    status: '📊 WUI Project Status',
    clean: '🧹 Clean Project',
    main: '🚀 WUI CLI - Interactive tool for WUI development'
  },
  outro: {
    create: 'Creation completed',
    dev: 'Development session ended',
    build: 'Build process completed',
    status: 'Status check completed',
    clean: 'Cleaning completed',
    main: 'Goodbye! 👋'
  },
  select: {
    action: 'What would you like to do?',
    createType: 'What do you want to create?',
    category: 'Select category:',
    devMode: 'Select development mode:',
    buildTarget: 'Select packages to build:',
    buildMode: 'Build mode:',
    cleanTarget: 'Select what to clean:'
  },
  text: {
    componentName: (type: string) => `${type.charAt(0).toUpperCase() + type.slice(1)} name:`,
    placeholder: (type: string) => `my-${type}`,
    port: 'Port number:',
    command: 'Enter command to run:',
    customCommand: 'bun run dev'
  },
  confirm: {
    create: (type: string, name: string) => `Create ${type} "${name}" with selected features?`,
    build: (targets: string[], mode: string) => `Build ${targets.join(', ')} in ${mode} mode?`,
    clean: 'Clean selected targets? This action cannot be undone.'
  },
  note: {
    createdFiles: (name: string, category: string) => `Created files:\n• src/${category}/${name}.vue\n• src/${category}/${name}.test.ts\n• docs/components/${name}.md`,
    startingServer: (mode: string, port: string) => `Starting ${mode} on port ${port}`,
    gitChanges: 'Git changes detected. Consider committing before building.',
    restoreDeps: 'Run "bun install" to restore dependencies if needed.'
  },
  spinner: {
    creating: 'Creating component...',
    building: (target: string) => `Building ${target}...`,
    cleaning: (target: string) => `Cleaning ${target}...`,
    runningCommand: (command: string, args: string[]) => `Running ${command} ${args.join(' ')}`
  },
  success: {
    created: (type: string, name: string) => `✅ ${type} "${name}" created successfully!`,
    built: (target: string) => `✅ ${target} built successfully`,
    cleaned: (target: string) => `✅ ${target} cleaned`,
    commandCompleted: (command: string) => `${command} completed successfully`
  },
  error: {
    commandFailed: (command: string) => `${command} failed`,
    buildFailed: (target: string) => `❌ ${target} build failed`,
    cleanFailed: (target: string) => `❌ Failed to clean ${target}`,
    devServerFailed: 'Failed to start development server',
    statusFailed: 'Failed to get project status'
  }
} as const;

export const OPTIONS = {
  actions: [
    { value: 'dev', label: '🚀 Start development server' },
    { value: 'create', label: '✨ Create new component/project' },
    { value: 'build', label: '🔨 Build packages' },
    { value: 'status', label: '📊 Show project status' },
    { value: 'clean', label: '🧹 Clean project' }
  ] as const,
  createTypes: [
    { value: 'component', label: '🧩 Component' },
    { value: 'composable', label: '🔗 Composable' },
    { value: 'plugin', label: '🔌 Plugin' },
    { value: 'theme', label: '🎨 Theme' }
  ] as const,
  categories: [
    { value: 'atoms', label: '⚛️  Atoms' },
    { value: 'molecules', label: '🔬 Molecules' },
    { value: 'organisms', label: '🧬 Organisms' },
    { value: 'templates', label: '📋 Templates' },
    { value: 'pages', label: '📄 Pages' }
  ] as const,
  features: [
    { value: 'typescript', label: '📘 TypeScript' },
    { value: 'tests', label: '🧪 Unit Tests' },
    { value: 'stories', label: '📖 Storybook Stories' },
    { value: 'docs', label: '📚 Documentation' }
  ] as const,
  devModes: [
    { value: 'docs', label: '📚 Documentation (VitePress)' },
    { value: 'playground', label: '🎮 Component Playground' },
    { value: 'storybook', label: '📖 Storybook' },
    { value: 'custom', label: '⚙️  Custom command' }
  ],
  buildTargets: [
    { value: 'wui', label: '🎯 WUI Core' },
    { value: 'cli', label: '💻 CLI Tool' },
    { value: 'docs', label: '📚 Documentation' },
    { value: 'all', label: '📦 All Packages' }
  ],
  buildModes: [
    { value: 'development', label: '🛠️  Development' },
    { value: 'production', label: '🚀 Production' },
    { value: 'analyze', label: '📊 Bundle Analysis' }
  ],
  cleanTargets: [
    { value: 'node_modules', label: '📦 Node Modules' },
    { value: 'dist', label: '🗂️  Build Outputs' },
    { value: 'cache', label: '💾 Cache Files' },
    { value: 'logs', label: '📝 Log Files' }
  ]
} as const;

export const CONFIG = {
  defaultPort: '3000',
  creationTimeout: 1500,
  cleaningDelay: 500
} as const;
