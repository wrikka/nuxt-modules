import { useRoute, useRouter } from '#app';
import type { Email } from '../../shared/types/email';

export const useEmailDetail = () => {
  const route = useRoute();
  const router = useRouter();
  const id = computed(() => Number(route.params.id));
  const { data: email, pending, error } = useFetch<Email>(`/api/emails/${id.value}`);

  useHead({
    title: computed(() => email.value?.subject || 'Email'),
  });

  async function markAsUnread() {
    if (!email.value) return;
    await $fetch(`/api/emails/${email.value.id}`, {
      method: 'PATCH',
      body: { read: false },
    });
    router.push('/');
  }

  async function deleteEmail() {
    if (!email.value) return;
    await $fetch(`/api/emails/${email.value.id}`, {
      method: 'PATCH',
      body: { folder: 'trash' },
    });
    router.push('/');
  }

  async function toggleStar() {
    if (!email.value) return;
    await $fetch(`/api/emails/${email.value.id}`, {
      method: 'PATCH',
      body: { starred: !email.value.starred },
    });
    email.value.starred = !email.value.starred;
  }

  return {
    email,
    pending,
    error,
    markAsUnread,
    deleteEmail,
    toggleStar,
  };
};
