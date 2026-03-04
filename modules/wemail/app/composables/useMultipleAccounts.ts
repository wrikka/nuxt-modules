export interface EmailAccount {
  id: string;
  name: string;
  email: string;
  provider: 'gmail' | 'outlook' | 'imap' | 'custom';
  type: 'oauth' | 'password';
  isDefault: boolean;
  isConnected: boolean;
  lastSync?: string;
  folders?: string[];
}

export const useMultipleAccounts = () => {
  const _accounts = ref<EmailAccount[]>([]);
  const _activeAccountId = ref<string | null>(null);
  const _isLoading = ref(false);

  const ACCOUNTS_KEY = 'wemail:accounts:v2';

  const loadAccounts = (): void => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(ACCOUNTS_KEY);
    if (stored) {
      try {
        _accounts.value = JSON.parse(stored);
        _activeAccountId.value = _accounts.value.find(a => a.isDefault)?.id || _accounts.value[0]?.id || null;
      } catch {
        _accounts.value = [];
      }
    }
  };

  const saveAccounts = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(_accounts.value));
  };

  const _generateId = (): string => `acc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const addAccount = (account: Omit<EmailAccount, 'id' | 'isConnected'>): EmailAccount => {
    const newAccount: EmailAccount = {
      ...account,
      id: _generateId(),
      isConnected: true,
    };

    // If first account, make it default
    if (_accounts.value.length === 0) {
      newAccount.isDefault = true;
      _activeAccountId.value = newAccount.id;
    }

    _accounts.value.push(newAccount);
    saveAccounts();
    return newAccount;
  };

  const removeAccount = (id: string): boolean => {
    const index = _accounts.value.findIndex(a => a.id === id);
    if (index === -1) return false;

    const wasDefault = _accounts.value[index].isDefault;
    _accounts.value.splice(index, 1);

    // If removed default and there are other accounts, set first as default
    if (wasDefault && _accounts.value.length > 0) {
      _accounts.value[0].isDefault = true;
      _activeAccountId.value = _accounts.value[0].id;
    }

    saveAccounts();
    return true;
  };

  const setActiveAccount = (id: string): boolean => {
    const account = _accounts.value.find(a => a.id === id);
    if (!account) return false;

    _activeAccountId.value = id;
    return true;
  };

  const setDefaultAccount = (id: string): boolean => {
    const account = _accounts.value.find(a => a.id === id);
    if (!account) return false;

    _accounts.value.forEach(a => a.isDefault = false);
    account.isDefault = true;
    saveAccounts();
    return true;
  };

  const activeAccount = computed(() => {
    return _accounts.value.find(a => a.id === _activeAccountId.value) || null;
  });

  const accountCount = computed(() => _accounts.value.length);

  const switchAccount = async (id: string): Promise<boolean> => {
    _isLoading.value = true;

    const success = setActiveAccount(id);
    if (success) {
      // Reload emails for new account
      await refreshNuxtData('emails');
    }

    _isLoading.value = false;
    return success;
  };

  onMounted(() => {
    loadAccounts();
  });

  return {
    accounts: _accounts,
    activeAccountId: _activeAccountId,
    activeAccount,
    accountCount,
    isLoading: _isLoading,
    loadAccounts,
    addAccount,
    removeAccount,
    setActiveAccount,
    setDefaultAccount,
    switchAccount,
  };
};
