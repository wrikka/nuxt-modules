// Stripe Connect Types
export interface ConnectAccount {
  id: string;
  object: 'account';
  business_type?: 'individual' | 'company' | 'non_profit' | 'government_entity';
  capabilities?: ConnectCapabilities;
  charges_enabled: boolean;
  country: string;
  created: number;
  default_currency?: string;
  details_submitted: boolean;
  email?: string;
  external_accounts?: ConnectExternalAccounts;
  metadata?: Record<string, string>;
  payouts_enabled: boolean;
  requirements?: ConnectRequirements;
  settings?: ConnectSettings;
  type: 'standard' | 'express' | 'custom';
}

export interface ConnectCapabilities {
  card_payments?: 'active' | 'inactive' | 'pending';
  transfers?: 'active' | 'inactive' | 'pending';
  legacy_payments?: 'active' | 'inactive' | 'pending';
}

export interface ConnectRequirements {
  currently_due?: string[];
  eventually_due?: string[];
  past_due?: string[];
  pending_verification?: string[];
}

export interface ConnectSettings {
  branding?: ConnectBranding;
  dashboard?: ConnectDashboard;
  payments?: ConnectPayments;
  payouts?: ConnectPayouts;
}

export interface ConnectBranding {
  icon?: string;
  logo?: string;
  primary_color?: string;
  secondary_color?: string;
}

export interface ConnectDashboard {
  display_name?: string;
  timezone?: string;
}

export interface ConnectPayments {
  statement_descriptor?: string;
  statement_descriptor_kana?: string;
  statement_descriptor_kanji?: string;
}

export interface ConnectPayouts {
  debit_negative_balances?: boolean;
  schedule?: ConnectPayoutSchedule;
  statement_descriptor?: string;
}

export interface ConnectPayoutSchedule {
  delay_days?: number;
  interval: 'daily' | 'weekly' | 'monthly' | 'manual';
  monthly_anchor?: number;
  weekly_anchor?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
}

export interface ConnectExternalAccounts {
  object: 'list';
  data: ConnectBankAccount[];
  has_more: boolean;
  url: string;
}

export interface ConnectBankAccount {
  id: string;
  object: 'bank_account' | 'card';
  account_holder_name?: string;
  account_holder_type?: 'individual' | 'company';
  bank_name?: string;
  country: string;
  currency: string;
  default_for_currency?: boolean;
  last4: string;
  routing_number?: string;
  status: 'new' | 'validated' | 'verified' | 'verification_failed' | 'errored';
}

export interface ConnectOnboardingLink {
  object: 'account_link';
  created: number;
  expires_at: number;
  url: string;
}

export interface ConnectLoginLink {
  object: 'login_link';
  created: number;
  url: string;
}

export interface ConnectTransfer {
  id: string;
  object: 'transfer';
  amount: number;
  currency: string;
  created: number;
  destination: string;
  destination_payment?: string;
  reversed?: boolean;
  source_transaction?: string;
  transfer_group?: string;
  metadata?: Record<string, string>;
}

export interface ConnectTransferData {
  destination: string;
  amount?: number;
}

export interface ConnectApplicationFee {
  id: string;
  object: 'application_fee';
  amount: number;
  currency: string;
  created: number;
  account: string;
  application: string;
  balance_transaction?: string;
  charge: string;
  payment?: string;
  refund?: string;
  metadata?: Record<string, string>;
}

export interface ConnectAccountSummary {
  accountId: string;
  businessName?: string;
  email?: string;
  status: 'pending' | 'verified' | 'restricted' | 'rejected';
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  balance: number;
  pendingBalance: number;
}
