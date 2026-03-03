<script setup lang="ts">
const _props = defineProps<{
	selectedStyle: {
		bold?: boolean;
		italic?: boolean;
		underline?: boolean;
		strikethrough?: boolean;
	};
}>();

const _emit =
	defineEmits<
		(
			e: "toggleStyle",
			style: "bold" | "italic" | "underline" | "strikethrough",
		) => void
	>();
</script>

<template>
  <div class="p-2 border-b border-gray-300 dark:border-gray-700 flex gap-1 items-center">
    <ToolbarButton title="Undo">
      <Icon name="lucide:undo" size="18" />
    </ToolbarButton>
    <ToolbarButton title="Redo">
      <Icon name="lucide:redo" size="18" />
    </ToolbarButton>
    <ToolbarButton title="Print" class="hidden sm:flex">
      <Icon name="lucide:printer" size="18" />
    </ToolbarButton>

    <ToolbarSeparator />

    <!-- Font size select - Can be a new component later -->
    <select class="border border-gray-300 rounded p-1 bg-transparent">
      <option>13</option>
    </select>

    <ToolbarSeparator />

    <ToolbarButton
      title="Bold"
      :is-active="_props.selectedStyle.bold"
      @click="_emit('toggleStyle', 'bold')"
    >
      <Icon name="lucide:bold" size="18" />
    </ToolbarButton>
    <ToolbarButton
      title="Italic"
      :is-active="_props.selectedStyle.italic"
      @click="_emit('toggleStyle', 'italic')"
    >
      <Icon name="lucide:italic" size="18" />
    </ToolbarButton>
    <ToolbarButton
      title="Underline"
      :is-active="_props.selectedStyle.underline"
      @click="_emit('toggleStyle', 'underline')"
    >
      <Icon name="lucide:underline" size="18" />
    </ToolbarButton>
    <ToolbarButton
      title="Strikethrough"
      :is-active="_props.selectedStyle.strikethrough"
      @click="_emit('toggleStyle', 'strikethrough')"
    >
      <Icon name="lucide:strikethrough" size="18" />
    </ToolbarButton>

    <ToolbarSeparator />

    <ToolbarButton title="Align Left" class="hidden md:flex">
      <Icon name="lucide:align-left" size="18" />
    </ToolbarButton>
    <ToolbarButton title="Align Center" class="hidden md:flex">
      <Icon name="lucide:align-center" size="18" />
    </ToolbarButton>
    <ToolbarButton title="Align Right" class="hidden md:flex">
      <Icon name="lucide:align-right" size="18" />
    </ToolbarButton>
  </div>
</template>

