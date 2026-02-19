import { createSharedComposable, useConfirmDialog } from "@vueuse/core";
import { reactive } from "vue";
export const useConfirmationDialog = createSharedComposable(() => {
  const { isRevealed, reveal, confirm, cancel, onReveal, onConfirm, onCancel } = useConfirmDialog();
  const state = reactive({
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    isDestructive: false
  });
  const show = (options) => {
    state.title = options.title;
    state.message = options.message;
    state.confirmText = options.confirmText ?? "Confirm";
    state.cancelText = options.cancelText ?? "Cancel";
    state.isDestructive = options.isDestructive ?? false;
    return reveal();
  };
  return {
    isRevealed,
    reveal: show,
    confirm,
    cancel,
    onReveal,
    onConfirm,
    onCancel,
    state
  };
});
