# WQuality Checker Example

The WQuality Checker is a comprehensive Vite plugin that enforces code quality across multiple dimensions including Vue component structure, theme consistency, performance, security, and TypeScript best practices. It integrates seamlessly into your development and build processes to maintain high code standards.

## Installation

```bash
bun add @wrikka/wquality-checker
```

## Usage

Add the plugin to your `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import { createWQualityChecker } from '@wrikka/wquality-checker'

export default defineConfig({
  plugins: [
    // your other plugins
    ...createWQualityChecker()
  ]
})
```

The plugin will automatically scan all relevant files during development and build processes, reporting violations across all quality dimensions.

## Features

- **Vue Component Structure**: Ensures `<script>` tags are placed above `<template>` tags and enforces component naming conventions
- **Theme Consistency**: Validates CSS classes against UnoCSS theme colors and border radii, prevents dark mode classes
- **Side Effect Reduction**: Reduces console logs and global mutations for cleaner code
- **Architecture Validation**: Enforces proper file placement and naming conventions
- **Security Checks**: Prevents dangerous practices like `eval()` and `innerHTML`
- **Performance Monitoring**: Detects large objects and recursive functions that may impact performance
- **TypeScript Quality**: Ensures utility function purity, proper library exports, and server-side safety

## Example Output

When violations are detected, the plugin outputs detailed warnings to the terminal during build or dev:

```
Script must be above template in src/components/Button.vue
Component name "button" should be PascalCase in src/components/Button.vue
Theme validation errors in src/components/Button.vue:
  - Class "bg-red-500" does not match theme in src/components/Button.vue. Must use theme-defined colors or radii.
  - Found 'dark' in class "dark:bg-gray-800" in src/components/Button.vue. Dark classes are not allowed.
Found console.log in src/utils/helpers.ts. Console logs should be removed in production.
Found eval() usage in src/components/Dangerous.vue. Eval is not allowed for security reasons.
Large object detected in src/data/constants.ts. Consider breaking into smaller modules.
Recursive function detected in src/utils/math.ts. Ensure it has proper termination conditions.
```

This helps maintain comprehensive code quality and prevents deployment of code with quality violations.
