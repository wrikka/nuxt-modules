<script setup lang="ts">
import { useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const props = defineProps({
  modelValue: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue,
  extensions: [StarterKit],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
  editorProps: {
    attributes: {
      class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-64 p-4',
    },
  },
})

watch(props, (newProps) => {
  if (editor.value && editor.value.getHTML() !== newProps.modelValue) {
    editor.value.commands.setContent(newProps.modelValue, { emitUpdate: false })
  }
})

onUnmounted(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})

const _toolbarButtons = computed(() => {
  const e = editor.value
  if (!e) return []
  return [
    { name: 'bold', action: () => e.chain().focus().toggleBold().run(), icon: 'mdi:format-bold', isActive: () => e.isActive('bold') },
    { name: 'italic', action: () => e.chain().focus().toggleItalic().run(), icon: 'mdi:format-italic', isActive: () => e.isActive('italic') },
    { name: 'strike', action: () => e.chain().focus().toggleStrike().run(), icon: 'mdi:format-strikethrough', isActive: () => e.isActive('strike') },
    { name: 'code', action: () => e.chain().focus().toggleCode().run(), icon: 'mdi:code-tags', isActive: () => e.isActive('code') },
  ]
})

</script>

<template>
  <div class="border border-slate-200 dark:border-zinc-700 rounded-lg">
    <div class="flex items-center p-2 border-b border-slate-200 dark:border-zinc-700">
      <button
        v-if="editor"
        v-for="button in _toolbarButtons"
        :key="button.name"
        @click="button.action"
        class="p-2 rounded hover:bg-slate-100 dark:hover:bg-zinc-800"
        :class="{ 'bg-slate-200 dark:bg-zinc-700': button.isActive() }"
      >
        <Icon :name="button.icon" class="h-5 w-5" />
      </button>
    </div>
    <EditorContent :editor="editor" />
  </div>
</template>
