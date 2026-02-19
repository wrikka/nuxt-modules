<script setup lang="ts">
import { useEditor, EditorContent } from '~/tiptap/vue-3';
import StarterKit from '~/tiptap/starter-kit';

const props = defineProps<{ modelValue: string | undefined }>();
const emit = defineEmits(['update:modelValue']);

const editor = useEditor({
    content: props.modelValue || '',
    extensions: [
        StarterKit.configure({
            heading: {
                levels: [1, 2, 3],
            },
            // Disable unwanted extensions
            gapcursor: false,
            hardBreak: false,
            horizontalRule: false,
            blockquote: false,
        }),
    ],
    editorProps: {
        attributes: {
            class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[150px] p-4 border border-border rounded-md',
        },
    },
    onUpdate: () => {
        emit('update:modelValue', editor.value?.getHTML());
    },
});

watch(() => props.modelValue, (newValue) => {
    const isSame = editor.value?.getHTML() === newValue;
    if (isSame) {
        return;
    }
    editor.value?.commands.setContent(newValue || '', { emitUpdate: false });
});

onBeforeUnmount(() => {
    editor.value?.destroy();
});
</script>

<template>
    <div>
        <div v-if="editor" class="flex items-center gap-2 p-2 border border-border rounded-t-md bg-card">
            <button ~/click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }" class="p-2 rounded hover:bg-accent">
                <Icon name="mdi:format-bold" />
            </button>
            <button ~/click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }" class="p-2 rounded hover:bg-accent">
                <Icon name="mdi:format-italic" />
            </button>
            <button ~/click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }" class="p-2 rounded hover:bg-accent">
                <Icon name="mdi:format-strikethrough" />
            </button>
            <button ~/click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }" class="p-2 rounded hover:bg-accent">
                <Icon name="mdi:format-list-bulleted" />
            </button>
            <button ~/click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }" class="p-2 rounded hover:bg-accent">
                <Icon name="mdi:format-list-numbered" />
            </button>
        </div>
        <EditorContent :editor="editor" />
    </div>
</template>

<style>
.prose :where(p):not(:where([class~="not-prose"] *)) {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
}
.is-active {
    ~/apply bg-accent text-accent-foreground;
}
</style>
