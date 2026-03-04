<script setup lang="ts">
const activeTab = ref('preview')

const sampleMarkdown = `# 🎉 WMarkdown - Advanced Markdown for Nuxt

## ✨ Features Overview

### 1. Custom Parser (No markdown-it!)
Built from scratch for **maximum flexibility** and performance.

### 2. Shiki Syntax Highlighting
\`\`\`typescript
// Example code
const greet = (name: string): string => {
  return \`Hello, \${name}!\`
}

console.log(greet('World'))
\`\`\`

### 3. Tables
| Feature | Status | Priority |
|---------|--------|----------|
| Parser | :check: Done | High |
| Shiki | :check: Done | High |
| Editor | :check: Done | High |

### 4. Task Lists
- [x] Custom parser
- [x] Shiki highlighting
- [x] Link hover preview
- [ ] More features

### 5. Emoji Support :rocket: :fire:
Use emoji shortcodes like :smile: :heart: :thumbsup:

### 6. Auto-linking
Visit https://example.com automatically becomes a link!

### 7. Math Support
Inline: $E = mc^2$

Block:
$$\\sum_{i=1}^{n} x_i = x_1 + x_2 + \\cdots + x_n$$

### 8. Mentions
@username mentions work too!

### 9. Callouts
> :info: **Note:** This is an important note.

> :warning: **Warning:** Be careful with this!

### 10. Details/Summary
<details>
<summary>Click to expand</summary>
Hidden content here!
</details>

---

## Links & References
- [Wrikka](https://wrikka.com) - Hover to see preview!
- [GitHub](https://github.com)

## Footnotes
Here's some text with a footnote[^1].

[^1]: This is the footnote content.
`

const editorContent = ref(sampleMarkdown)

const features = [
  { name: 'Custom Parser', icon: 'lucide:cog', desc: 'No markdown-it dependency', done: true },
  { name: 'Shiki Highlight', icon: 'lucide:code-2', desc: 'Best performance highlighting', done: true },
  { name: 'Preview Mode', icon: 'lucide:eye', desc: 'Beautiful markdown preview', done: true },
  { name: 'Editor Mode', icon: 'lucide:edit-3', desc: 'Notion-like block editor', done: true },
  { name: 'Link Preview', icon: 'lucide:external-link', desc: 'Hover link previews', done: true },
  { name: 'Tables', icon: 'lucide:table', desc: 'Sortable & filterable', done: true },
  { name: 'TOC', icon: 'lucide:list', desc: 'Auto-generated with scroll spy', done: true },
  { name: 'Callouts', icon: 'lucide:info', desc: 'Info/warning/danger blocks', done: true },
  { name: 'Tabs', icon: 'lucide:folder', desc: 'Tabbed content', done: true },
  { name: 'Task Lists', icon: 'lucide:check-square', desc: 'Interactive checkboxes', done: true },
  { name: 'Math Support', icon: 'lucide:sigma', desc: 'LaTeX math expressions', done: true },
  { name: 'Footnotes', icon: 'lucide:superscript', desc: 'Reference-style notes', done: true },
  { name: 'Mentions', icon: 'lucide:at-sign', desc: '@username support', done: true },
  { name: 'Details', icon: 'lucide:chevron-down', desc: 'Collapsible sections', done: true },
  { name: 'Front Matter', icon: 'lucide:file-text', desc: 'YAML/TOML metadata', done: true },
  { name: 'Mark/Highlight', icon: 'lucide:highlighter', desc: '==highlight== syntax', done: true },
  { name: 'Sup/Sub', icon: 'lucide:subscript', desc: '^(sup) ~(sub)', done: true },
  { name: 'Strikethrough', icon: 'lucide:strikethrough', desc: '~~deleted~~', done: true },
  { name: 'Emoji', icon: 'lucide:smile', desc: ':emoji: shortcodes', done: true },
  { name: 'Auto-link', icon: 'lucide:link', desc: 'Auto URL linking', done: true }
]
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3">
            <Icon name="lucide:file-markdown" class="w-8 h-8 text-blue-600" />
            <h1 class="text-xl font-bold text-gray-900">WMarkdown</h1>
          </div>
          <div class="flex items-center gap-2">
            <button
              class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              :class="activeTab === 'preview' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'"
              @click="activeTab = 'preview'"
            >
              Preview Mode
            </button>
            <button
              class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              :class="activeTab === 'editor' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'"
              @click="activeTab = 'editor'"
            >
              Editor Mode
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Preview Mode Demo -->
      <div v-if="activeTab === 'preview'" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="space-y-4">
          <h2 class="text-lg font-semibold text-gray-900">Markdown Input</h2>
          <textarea
            v-model="editorContent"
            class="w-full h-[600px] p-4 font-mono text-sm bg-white border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter markdown here..."
          />
        </div>
        <div class="space-y-4">
          <h2 class="text-lg font-semibold text-gray-900">Preview Output</h2>
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <WMarkdownPreview :content="editorContent" />
          </div>
        </div>
      </div>

      <!-- Editor Mode Demo -->
      <div v-else class="max-w-3xl mx-auto">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Notion-like Editor</h2>
        <div class="bg-white border border-gray-200 rounded-lg">
          <WMarkdownEditor v-model="editorContent" />
        </div>
      </div>

      <!-- Features Grid -->
      <section class="mt-16">
        <h2 class="text-2xl font-bold text-gray-900 mb-8">All 20 Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="feature in features" :key="feature.name" class="bg-white p-4 rounded-lg border border-gray-200">
            <div class="flex items-center gap-2 mb-2">
              <Icon :name="feature.icon" class="w-5 h-5 text-blue-600" />
              <h3 class="font-medium text-gray-900">{{ feature.name }}</h3>
            </div>
            <p class="text-sm text-gray-600">{{ feature.desc }}</p>
            <span class="inline-block mt-2 px-2 py-1 text-xs rounded" :class="feature.done ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'">
              {{ feature.done ? 'Done' : 'Planned' }}
            </span>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
