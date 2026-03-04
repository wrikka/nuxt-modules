export interface SendEmailPayload {
  to: string | string[];
  subject: string;
  body: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  attachments?: {
    filename: string;
    content: string; // base64
    contentType: string;
  }[];
}

export interface EmailProvider {
  name: string;
  send: (payload: SendEmailPayload) => Promise<{ success: boolean; messageId?: string; error?: string }>;
}

export const useEmailSender = () => {
  const _isSending = ref(false);
  const _lastError = ref<string | null>(null);
  const _lastMessageId = ref<string | null>(null);
  const _provider = ref<string>('resend');

  const _validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const _validatePayload = (payload: SendEmailPayload): string | null => {
    const toArray = Array.isArray(payload.to) ? payload.to : [payload.to];
    if (toArray.length === 0 || !toArray.every(_validateEmail)) {
      return 'Invalid recipient email address';
    }
    if (!payload.subject.trim()) {
      return 'Subject is required';
    }
    if (!payload.body.trim()) {
      return 'Email body is required';
    }
    return null;
  };

  const sendEmail = async (payload: SendEmailPayload): Promise<boolean> => {
    _isSending.value = true;
    _lastError.value = null;
    _lastMessageId.value = null;

    const validationError = _validatePayload(payload);
    if (validationError) {
      _lastError.value = validationError;
      _isSending.value = false;
      return false;
    }

    try {
      const result = await $fetch('/api/emails/send', {
        method: 'POST',
        body: {
          ...payload,
          provider: _provider.value,
        },
      }) as { success: boolean; messageId?: string; error?: string };

      if (result.success) {
        _lastMessageId.value = result.messageId || null;
        _isSending.value = false;
        return true;
      } else {
        _lastError.value = result.error || 'Failed to send email';
        _isSending.value = false;
        return false;
      }
    } catch (err) {
      _lastError.value = err instanceof Error ? err.message : 'Network error';
      _isSending.value = false;
      return false;
    }
  };

  const setProvider = (provider: string): void => {
    _provider.value = provider;
  };

  return {
    isSending: _isSending,
    lastError: _lastError,
    lastMessageId: _lastMessageId,
    provider: _provider,
    sendEmail,
    setProvider,
  };
};
