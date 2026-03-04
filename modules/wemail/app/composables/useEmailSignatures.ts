export interface EmailSignature {
  id: string;
  name: string;
  content: string;
  isDefault: boolean;
  isHtml: boolean;
}

const SIGNATURES_STORAGE_KEY = 'wemail:signatures';

export const useEmailSignatures = () => {
  const _signatures = ref<EmailSignature[]>([]);
  const _isLoaded = ref(false);

  const _generateId = (): string => {
    return `sig-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  };

  const loadSignatures = (): void => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(SIGNATURES_STORAGE_KEY);
    if (stored) {
      try {
        _signatures.value = JSON.parse(stored);
      } catch {
        _signatures.value = [];
      }
    }
    _isLoaded.value = true;
  };

  const saveSignatures = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SIGNATURES_STORAGE_KEY, JSON.stringify(_signatures.value));
  };

  const createSignature = (data: Omit<EmailSignature, 'id'>): EmailSignature => {
    // If this is the first signature, make it default
    const isFirst = _signatures.value.length === 0;

    const signature: EmailSignature = {
      ...data,
      id: _generateId(),
      isDefault: isFirst || data.isDefault,
    };

    // If setting as default, remove default from others
    if (signature.isDefault) {
      _signatures.value.forEach(s => s.isDefault = false);
    }

    _signatures.value.push(signature);
    saveSignatures();
    return signature;
  };

  const updateSignature = (id: string, updates: Partial<Omit<EmailSignature, 'id'>>): EmailSignature | null => {
    const index = _signatures.value.findIndex(s => s.id === id);
    if (index === -1) return null;

    // If setting as default, remove default from others
    if (updates.isDefault) {
      _signatures.value.forEach(s => s.isDefault = false);
    }

    _signatures.value[index] = { ..._signatures.value[index], ...updates };
    saveSignatures();
    return _signatures.value[index];
  };

  const deleteSignature = (id: string): boolean => {
    const index = _signatures.value.findIndex(s => s.id === id);
    if (index === -1) return false;

    const wasDefault = _signatures.value[index].isDefault;
    _signatures.value.splice(index, 1);

    // If deleted the default, make first one default
    if (wasDefault && _signatures.value.length > 0) {
      _signatures.value[0].isDefault = true;
    }

    saveSignatures();
    return true;
  };

  const getDefaultSignature = (): EmailSignature | undefined => {
    return _signatures.value.find(s => s.isDefault);
  };

  const getSignature = (id: string): EmailSignature | undefined => {
    return _signatures.value.find(s => s.id === id);
  };

  const setDefault = (id: string): boolean => {
    return updateSignature(id, { isDefault: true }) !== null;
  };

  const appendToBody = (body: string, signatureId?: string): string => {
    const signature = signatureId
      ? getSignature(signatureId)
      : getDefaultSignature();

    if (!signature) return body;

    const separator = '<br><br>--<br>';
    return `${body}${separator}${signature.content}`;
  };

  onMounted(() => {
    loadSignatures();
  });

  return {
    signatures: _signatures,
    isLoaded: _isLoaded,
    loadSignatures,
    createSignature,
    updateSignature,
    deleteSignature,
    getSignature,
    getDefaultSignature,
    setDefault,
    appendToBody,
  };
};
