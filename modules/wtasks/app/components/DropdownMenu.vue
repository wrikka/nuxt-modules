<script setup lang="ts">
defineProps<{
	triggerClass?: string;
}>();

const model = defineModel<boolean>();
const menu = ref(null);

onClickOutside(menu, () => {
	model.value = false;
});

function close() {
	model.value = false;
}

</script>

<template>
  <div class="relative" ref="menu">
    <button :class="triggerClass" ~/click="model = !model">
      <slot name="trigger" />
    </button>
    <Transition
      enter-active-class="transition-opacity duration-150 ease-out"
      leave-active-class="transition-opacity duration-150 ease-in"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div v-if="model" class="absolute right-0 mt-2 w-56 bg-[#1a1a1c] border border-gray-700 rounded-md shadow-lg z-20 p-2">
        <slot name="content" :close="close" />
      </div>
    </Transition>
  </div>
</template>
