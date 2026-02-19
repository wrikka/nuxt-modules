import type { Email } from '../../shared/types/email';

export const useInbox = () => {
  const tabs = ['Primary', 'Promotions', 'Updates'];
  const activeTab = ref(tabs[0]);

  const { data: filteredEmails, pending, error } = useFetch<Email[]>(() => `/api/emails?folder=inbox&tab=${activeTab.value}`);

  return {
    tabs,
    activeTab,
    pending,
    error,
    filteredEmails,
  };
};
