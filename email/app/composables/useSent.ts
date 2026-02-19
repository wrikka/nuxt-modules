import type { Email } from '../../shared/types/email';

export const useSent = () => {
  const { data: emails, pending, error } = useFetch<Email[]>('/api/emails?folder=sent');

  useHead({
    title: 'Sent',
  });

  return {
    emails,
    pending,
    error,
  };
};
