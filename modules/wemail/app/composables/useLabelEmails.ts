import type { Ref } from 'vue';
import { computed } from 'vue';
import type { Email } from '../../shared/types/email';

export const useLabelEmails = (labelName: Ref<string>) => {
  const { data: emails, pending, error } = useFetch<Email[]>(() => `/api/emails?label=${labelName.value}`);

  const emptyState = computed(() => ({
    icon: 'mdi:label-outline',
    title: `No emails with label '${labelName.value}'`,
    message: 'Check back later or apply this label to some emails.',
  }));

  return {
    emails,
    pending,
    error,
    emptyState,
  };
};
