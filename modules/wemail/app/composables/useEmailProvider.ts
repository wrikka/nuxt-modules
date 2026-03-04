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

export interface GmailCredentials {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface ImapCredentials {
  host: string;
  port: number;
  username: string;
  password: string;
  useSSL: boolean;
}

const ACCOUNTS_STORAGE_KEY = 'wemail:accounts';

export const useEmailProvider = () => {
  const _accounts = ref<EmailAccount[]>([]);
  const _currentAccount = ref<EmailAccount | null>(null);
  const _isConnecting = ref(false);
  const _connectionError = ref<string | null>(null);

  const loadAccounts = (): void => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (stored) {
      try {
        _accounts.value = JSON.parse(stored);
        _currentAccount.value = _accounts.value.find(a => a.isDefault) || _accounts.value[0] || null;
      } catch {
        _accounts.value = [];
      }
    }
  };

  const saveAccounts = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(_accounts.value));
  };

  const _generateId = (): string => `acc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const addAccount = async (account: Omit<EmailAccount, 'id' | 'isConnected'>): Promise<boolean> => {
    _isConnecting.value = true;
    _connectionError.value = null;

    try {
      // Test connection
      const result = await $fetch('/api/accounts/test', {
        method: 'POST',
        body: {
          provider: account.provider,
          email: account.email,
        },
      }) as { success: boolean; error?: string };

      if (!result.success) {
        _connectionError.value = result.error || 'Connection failed';
        _isConnecting.value = false;
        return false;
      }

      const newAccount: EmailAccount = {
        ...account,
        id: _generateId(),
        isConnected: true,
        isDefault: _accounts.value.length === 0,
      };

      _accounts.value.push(newAccount);
      if (newAccount.isDefault) {
        _currentAccount.value = newAccount;
      }
      saveAccounts();
      _isConnecting.value = false;
      return true;
    } catch (err) {
      _connectionError.value = err instanceof Error ? err.message : 'Connection error';
      _isConnecting.value = false;
      return false;
    }
  };

  const removeAccount = (id: string): boolean => {
    const index = _accounts.value.findIndex(a => a.id === id);
    if (index === -1) return false;

    const wasDefault = _accounts.value[index].isDefault;
    _accounts.value.splice(index, 1);

    if (wasDefault && _accounts.value.length > 0) {
      _accounts.value[0].isDefault = true;
      _currentAccount.value = _accounts.value[0];
    }

    saveAccounts();
    return true;
  };

  const setDefaultAccount = (id: string): boolean => {
    const account = _accounts.value.find(a => a.id === id);
    if (!account) return false;

    _accounts.value.forEach(a => a.isDefault = false);
    account.isDefault = true;
    _currentAccount.value = account;
    saveAccounts();
    return true;
  };

  const switchAccount = (id: string): boolean => {
    const account = _accounts.value.find(a => a.id === id);
    if (!account || !account.isConnected) return false;

    _currentAccount.value = account;
    return true;
  };

  const syncAccount = async (id: string): Promise<boolean> => {
    const account = _accounts.value.find(a => a.id === id);
    if (!account) return false;

    try {
      await $fetch('/api/accounts/sync', {
        method: 'POST',
        body: { accountId: id },
      });

      account.lastSync = new Date().toISOString();
      saveAccounts();
      return true;
    } catch {
      return false;
    }
  };

  const connectGmail = async (): Promise<void> => {
    // Redirect to Google OAuth
    const { url } = await $fetch('/api/auth/gmail') as { url: string };
    window.location.href = url;
  };

  const connectOutlook = async (): Promise<void> => {
    // Redirect to Microsoft OAuth
    const { url } = await $fetch('/api/auth/outlook') as { url: string };
    window.location.href = url;
  };

  const connectImap = async (credentials: ImapCredentials): Promise<boolean> => {
    return addAccount({
      name: credentials.username,
      email: credentials.username,
      provider: 'imap',
      type: 'password',
      isDefault: false,
    });
  };

  onMounted(() => {
    loadAccounts();
  });

  return {
    accounts: _accounts,
    currentAccount: _currentAccount,
    isConnecting: _isConnecting,
    connectionError: _connectionError,
    loadAccounts,
    addAccount,
    removeAccount,
    setDefaultAccount,
    switchAccount,
    syncAccount,
    connectGmail,
    connectOutlook,
    connectImap,
  };
};
