export const useContextMenuStore = defineStore('contextMenu', () => {
  const isOpen = ref(false);
  const x = ref(0);
  const y = ref(0);
  const selectedItem = ref<Email | MenuItem | null>(null);

  const open = (event: MouseEvent, item: Email | MenuItem) => {
    isOpen.value = true;
    x.value = event.clientX;
    y.value = event.clientY;
    selectedItem.value = item;
  };

  const close = () => {
    isOpen.value = false;
    selectedItem.value = null;
  };

  return {
    isOpen,
    x,
    y,
    selectedItem,
    open,
    close,
  };
});
