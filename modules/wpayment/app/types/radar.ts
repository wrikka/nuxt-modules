import type { Ref } from 'vue';

// Radar Early Fraud Warning
export interface EarlyFraudWarning {
  id: string;
  object: 'radar.early_fraud_warning';
  actionable?: boolean;
  charge?: string;
  created: number;
  fraud_type?:
    | 'card_never_received'
    | 'fraudulent_card_application'
    | 'made_with_counterfeit_card'
    | 'made_with_lost_card'
    | 'made_with_stolen_card'
    | 'miscellaneous_fraud'
    | 'unauthorized_use_of_card';
  livemode: boolean;
  payment_intent?: string;
}

// Radar Value List
export interface ValueList {
  id: string;
  object: 'radar.value_list';
  alias: string;
  created: number;
  created_by?: string;
  item_type: ValueType;
  list_items: ValueListItem[];
  livemode: boolean;
  metadata?: Record<string, string>;
  name: string;
}

export type ValueType =
  | 'card_fingerprint'
  | 'card_bin'
  | 'email'
  | 'ip_address'
  | 'country'
  | 'string'
  | 'case_sensitive_string'
  | 'customer_id'
  | 'sepa_debit_fingerprint'
  | 'us_bank_account_fingerprint';

export interface ValueListItem {
  id: string;
  object: 'radar.value_list_item';
  created: number;
  created_by?: string;
  livemode: boolean;
  value: string;
  value_list: string;
}

// Create Value List Params
export interface CreateValueListParams {
  alias: string;
  item_type: ValueType;
  name: string;
  metadata?: Record<string, string>;
}

// Create Value List Item Params
export interface CreateValueListItemParams {
  value_list: string;
  value: string;
}

// Radar Rule
export interface RadarRule {
  id: string;
  object: 'radar.rule';
  created: number;
  default_action?: 'allow' | 'block' | 'review' | 'three_d_secure';
  deleted?: boolean;
  editable?: boolean;
  fraud_reason?: string;
  id_alias?: string;
  livemode: boolean;
  predicate: string;
  title?: string;
  type?: 'built_in' | 'custom';
}

// Create Radar Rule Params
export interface CreateRadarRuleParams {
  predicate: string;
  action?: 'allow' | 'block' | 'review' | 'three_d_secure';
  title?: string;
  description?: string;
}

// Update Radar Rule Params
export interface UpdateRadarRuleParams {
  ruleId: string;
  action?: 'allow' | 'block' | 'review' | 'three_d_secure';
}

// Risk Assessment
export interface RiskAssessment {
  id: string;
  object: 'radar.risk_assessment';
  created: number;
  livemode: boolean;
  payment_intent?: string;
  risk_score: number;
  risk_level: 'normal' | 'elevated' | 'highest' | 'not_assessed' | 'unknown';
  risk_reasons?: RiskReason[];
  session?: string;
}

export interface RiskReason {
  type: string;
  reason: string;
  additional_info?: Record<string, string>;
}

// Radar Session
export interface RadarSession {
  id: string;
  object: 'radar.session';
  created: number;
  livemode: boolean;
  payload?: string;
}

// Risk Settings
export interface RiskSettings {
  default_risk_threshold?: number;
  block_anonymous_ips?: boolean;
  block_disposable_emails?: boolean;
  block_proxy_ips?: boolean;
  block_tor_ips?: boolean;
  block_vpn_ips?: boolean;
  enable_machine_learning?: boolean;
  custom_rules_enabled?: boolean;
}

// Composable Return Types
export interface UseRadarReturn {
  earlyFraudWarnings: Readonly<Ref<EarlyFraudWarning[]>>;
  valueLists: Readonly<Ref<ValueList[]>>;
  rules: Readonly<Ref<RadarRule[]>>;
  riskAssessment: Readonly<Ref<RiskAssessment | null>>;
  loading: Readonly<Ref<boolean>>;
  error: Readonly<Ref<string | null>>;
  // Early Fraud Warnings
  listEarlyFraudWarnings: (params?: ListEarlyFraudWarningsParams) => Promise<EarlyFraudWarning[]>;
  retrieveEarlyFraudWarning: (warningId: string) => Promise<EarlyFraudWarning>;
  // Value Lists
  createValueList: (params: CreateValueListParams) => Promise<ValueList>;
  retrieveValueList: (valueListId: string) => Promise<ValueList>;
  updateValueList: (valueListId: string, params: UpdateValueListParams) => Promise<ValueList>;
  deleteValueList: (valueListId: string) => Promise<void>;
  listValueLists: () => Promise<ValueList[]>;
  // Value List Items
  createValueListItem: (params: CreateValueListItemParams) => Promise<ValueListItem>;
  deleteValueListItem: (itemId: string) => Promise<void>;
  listValueListItems: (valueListId: string) => Promise<ValueListItem[]>;
  // Rules
  createRule: (params: CreateRadarRuleParams) => Promise<RadarRule>;
  retrieveRule: (ruleId: string) => Promise<RadarRule>;
  updateRule: (params: UpdateRadarRuleParams) => Promise<RadarRule>;
  deleteRule: (ruleId: string) => Promise<void>;
  listRules: () => Promise<RadarRule[]>;
  // Risk Assessment
  assessRisk: (paymentIntentId: string) => Promise<RiskAssessment>;
  createSession: () => Promise<RadarSession>;
}

export interface ListEarlyFraudWarningsParams {
  charge?: string;
  payment_intent?: string;
  limit?: number;
  starting_after?: string;
  ending_before?: string;
}

export interface UpdateValueListParams {
  alias?: string;
  name?: string;
  metadata?: Record<string, string>;
}

// Risk Score Display Props
export interface RiskScoreDisplayProps {
  score: number;
  level: 'normal' | 'elevated' | 'highest' | 'not_assessed' | 'unknown';
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
