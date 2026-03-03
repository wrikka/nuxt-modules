// Invoice UI Types
export interface InvoiceTemplate {
  id: string;
  name: string;
  headerImage?: string;
  logo?: string;
  primaryColor?: string;
  fontFamily?: string;
  showBusinessInfo: boolean;
  showPaymentTerms: boolean;
  paymentTermsText?: string;
  footerText?: string;
}

export interface InvoiceFormData {
  customerEmail: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: InvoiceAddress;
  items: InvoiceFormItem[];
  dueDate?: string;
  paymentTerms?: 'due_on_receipt' | 'net_7' | 'net_15' | 'net_30' | 'net_60' | 'custom';
  notes?: string;
  metadata?: Record<string, string>;
}

export interface InvoiceFormItem {
  id: string;
  description: string;
  quantity: number;
  unitAmount: number;
  currency: string;
  taxRate?: string;
  discount?: number;
}

export interface InvoiceAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export interface InvoicePreview {
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
}

export interface InvoicePDFConfig {
  format: 'a4' | 'letter';
  orientation: 'portrait' | 'landscape';
  includeLogo: boolean;
  includePaymentQR: boolean;
}

export interface InvoiceSendConfig {
  method: 'email' | 'sms' | 'link';
  recipientEmail?: string;
  recipientPhone?: string;
  message?: string;
  includeReceipt: boolean;
}

export interface InvoiceHistoryItem {
  id: string;
  number: string;
  customerEmail: string;
  customerName?: string;
  amount: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  createdAt: number;
  dueDate?: number;
  paidAt?: number;
}

export interface InvoiceFilter {
  status?: ('draft' | 'open' | 'paid' | 'uncollectible' | 'void')[];
  customer?: string;
  dateRange?: '7d' | '30d' | '90d' | '1y' | 'custom';
  customStartDate?: string;
  customEndDate?: string;
  search?: string;
}
