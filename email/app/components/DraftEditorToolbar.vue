<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3';

defineProps<{
  editor: Editor;
}>();
</script>

<template>
  <div v-if="editor" class="p-2 border-b border-slate-200 dark:border-zinc-800 flex items-center gap-2">
    <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }" class="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-700">
      <Icon name="carbon:text-bold" />
    </button>
    <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }" class="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-700">
      <Icon name="carbon:text-italic" />
    </button>
    <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }" class="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-700">
      <Icon name="carbon:text-strikethrough" />
    </button>
    <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }" class="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-700">
      <Icon name="carbon:list-bulleted" />
    </button>
    <button @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }" class="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-zinc-700">
      <Icon name="carbon:list-numbered" />
    </button>
  </div>
</template>
