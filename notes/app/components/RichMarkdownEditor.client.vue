<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import type * as Y from 'yjs'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { schema } from 'prosemirror-schema-basic'
import { ySyncPlugin, yUndoPlugin, undo, redo } from 'y-prosemirror'
import { keymap } from 'prosemirror-keymap'

const props = defineProps<{ ydoc: Y.Doc, yXmlFragment: Y.XmlFragment }>()

const editorRef = ref<HTMLDivElement | null>(null)
let view: EditorView | null = null

onMounted(() => {
  if (!editorRef.value) return

  const state = EditorState.create({
    schema,
    plugins: [
      ySyncPlugin(props.yXmlFragment),
      // yCursorPlugin(provider.awareness), // Awareness for cursors will be added later
      yUndoPlugin(),
      keymap({
        'Mod-z': undo,
        'Mod-y': redo,
        'Mod-Shift-z': redo,
      }),
    ],
  })

  view = new EditorView(editorRef.value, {
    state,
  })
})

onUnmounted(() => {
  view?.destroy()
})
</script>

<template>
  <div ref="editorRef" class="prose dark:prose-invert p-4 border rounded-md h-full overflow-y-auto focus:outline-none"></div>
</template>

<style>
.ProseMirror {
  outline: none;
}
</style>
