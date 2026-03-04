interface ReadReceipt {
  emailId: number;
  recipient: string;
  readAt: string;
  ipAddress?: string;
  userAgent?: string;
}

const READ_RECEIPTS_KEY = 'wemail:read-receipts';

export const useReadReceipts = () => {
  const _receipts = ref<ReadReceipt[]>([]);
  const _isLoaded = ref(false);
  const _requestingFor = ref<Set<number>>(new Set());

  const loadReceipts = (): void => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(READ_RECEIPTS_KEY);
    if (stored) {
      try {
        _receipts.value = JSON.parse(stored);
      } catch {
        _receipts.value = [];
      }
    }
    _isLoaded.value = true;
  };

  const saveReceipts = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(READ_RECEIPTS_KEY, JSON.stringify(_receipts.value));
  };

  const requestReadReceipt = (emailId: number): void => {
    _requestingFor.value.add(emailId);
  };

  const isReadReceiptRequested = (emailId: number): boolean => {
    return _requestingFor.value.has(emailId);
  };

  const trackEmailRead = (emailId: number, recipient: string): void => {
    const receipt: ReadReceipt = {
      emailId,
      recipient,
      readAt: new Date().toISOString(),
      ipAddress: undefined, // Would be set server-side
      userAgent: navigator.userAgent,
    };

    _receipts.value.push(receipt);
    saveReceipts();

    // Notify server
    $fetch('/api/emails/track', {
      method: 'POST',
      body: {
        emailId,
        recipient,
        event: 'read',
        timestamp: receipt.readAt,
      },
    }).catch(() => {
      // Silently fail
    });
  };

  const getReadStatus = (emailId: number): {
    isRead: boolean;
    readAt?: string;
    readCount: number;
  } => {
    const receipts = _receipts.value.filter(r => r.emailId === emailId);
    const firstReceipt = receipts[0];

    return {
      isRead: receipts.length > 0,
      readAt: firstReceipt?.readAt,
      readCount: receipts.length,
    };
  };

  const getReceiptsForEmail = (emailId: number): ReadReceipt[] => {
    return _receipts.value.filter(r => r.emailId === emailId);
  };

  // Generate tracking pixel for emails
  const generateTrackingPixel = (emailId: number): string => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const trackingUrl = `${baseUrl}/api/track/pixel?id=${emailId}`;
    return `<img src="${trackingUrl}" width="1" height="1" alt="" style="display:block;visibility:hidden;" />`;
  };

  // Add tracking to email body
  const addTrackingToEmail = (emailId: number, body: string): string => {
    if (!_requestingFor.value.has(emailId)) return body;

    const pixel = generateTrackingPixel(emailId);
    return `${body}${pixel}`;
  };

  onMounted(() => {
    loadReceipts();
  });

  return {
    receipts: _receipts,
    isLoaded: _isLoaded,
    requestingFor: _requestingFor,
    loadReceipts,
    requestReadReceipt,
    isReadReceiptRequested,
    trackEmailRead,
    getReadStatus,
    getReceiptsForEmail,
    generateTrackingPixel,
    addTrackingToEmail,
  };
};
