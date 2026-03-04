# WQuality Checker

A comprehensive quality assurance package for Vue, Nuxt, and web projects, utilizing programmable AST-based checks with @ast-grep/napi for precise code analysis.

## Installation

```bash
bun add @wrikka/wquality-checker
```

This installs all quality rules at once.

## Usage

### For Vite Projects

Use the auto-detection function in your `vite.config.ts`:

```ts
import { createWQualityChecker } from '@wrikka/wquality-checker'

export default defineConfig({
  plugins: createWQualityChecker()
})
```

This automatically detects your project type and applies all relevant quality rules.

### Manual Configuration (Optional)

If you prefer manual control, import individual rules:

```ts
import {
  vueScriptOrder, vueComponentNaming,
  wuiThemeValidator, wuiNoDarkClasses,
  reduceConsoleLogs, reduceGlobalMutations,
  architectureFilePlacement, architectureNamingConvention,
  securityEvalCheck, securityInnerHTMLCheck,
  performanceLargeObjects, performanceRecursiveFunctions,
  tsUtilsPurity, tsLibExports, tsServerSafety
} from '@wrikka/wquality-checker'

export default defineConfig({
  plugins: [
    vueScriptOrder(),
    vueComponentNaming(),
    wuiThemeValidator(),
    wuiNoDarkClasses(),
    reduceConsoleLogs(),
    reduceGlobalMutations(),
    architectureFilePlacement(),
    architectureNamingConvention(),
    securityEvalCheck(),
    securityInnerHTMLCheck(),
    performanceLargeObjects(),
    performanceRecursiveFunctions(),
    tsUtilsPurity(),
    tsLibExports(),
    tsServerSafety()
  ]
})
```

### For Nuxt Projects

Add the Nuxt module to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: [
    '@wrikka/wquality-checker/nuxt'
  ]
})
```

## Automatic Detection and Configuration

The package automatically detects the project framework and applies relevant rules based on file types:

- **Vue Rules**: Applied to `.vue` files (component structure, theme compliance)
- **Nuxt Rules**: Activated when `nuxt.config.ts` is detected (Vue checks via Nuxt module)
- **WUI Theme Rules**: Enabled for `.vue` and `.tsx` files when UnoCSS configuration is present
- **General Rules**: Applied to `.js`, `.ts`, and `.vue` files (side effects, architecture, security, performance, TypeScript checks)

Unused rules are not executed and do not report, optimizing performance. When running the program, Vite automatically configures and applies all relevant rules based on your project structure.

## Rules

- **vueChecker**: Enforces Vue SFC structure by ensuring `<script>` tags precede `<template>` tags
- **nuxtChecker**: Nuxt module wrapper for Vue SFC checks
- **wuiThemeChecker**: Validates CSS classes against UnoCSS theme definitions (colors, border radii)
- **reduceSideEffectChecker**: Detects side effects like `console.log` statements
- **architectureChecker**: Performs basic architectural checks (e.g., file placement conventions)
- **securityChecker**: Identifies security vulnerabilities such as `eval` usage and `innerHTML` assignments
- **performanceChecker**: Flags potential performance issues including large object literals and recursive patterns

All rules leverage AST-grep for programmable, context-aware analysis that minimizes false positives.
