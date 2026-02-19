export const useModalStore = defineStore('modal', () => {
  const isSnoozeModalOpen = ref(false);
  const selectedEmail = ref<Email | null>(null);

  const openSnoozeModal = (email: Email) => {
    selectedEmail.value = email;
    isSnoozeModalOpen.value = true;
  };

  const closeSnoozeModal = () => {
    isSnoozeModalOpen.value = false;
    selectedEmail.value = null;
  };

  return {
    isSnoozeModalOpen,
    selectedEmail,
    openSnoozeModal,
    closeSnoozeModal,
  };
});
