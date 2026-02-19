export interface QuickToggleConfig {
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  collapsed: boolean;
  pinnedFlags: string[];
  recentFlags: string[];
  maxRecent: number;
  showSearch: boolean;
  showFilters: boolean;
  theme: 'light' | 'dark' | 'auto';
}

export interface QuickToggleState {
  isOpen: boolean;
  searchQuery: string;
  filter: 'all' | 'enabled' | 'disabled';
  sortBy: 'name' | 'recent' | 'status';
}

export interface QuickToggleFlag {
  key: string;
  enabled: boolean;
  description?: string;
  lastToggled?: number;
  toggleCount: number;
}

export const DEFAULT_QUICK_TOGGLE_CONFIG: QuickToggleConfig = {
  position: 'bottom-right',
  collapsed: true,
  pinnedFlags: [],
  recentFlags: [],
  maxRecent: 5,
  showSearch: true,
  showFilters: true,
  theme: 'auto',
};
