// Refund UI Types
export interface RefundFormData {
  paymentIntentId: string;
  amount?: number;
  reason: RefundReason;
  reasonDescription?: string;
  refundApplicationFee?: boolean;
  reverseTransfer?: boolean;
  metadata?: Record<string, string>;
}

export type RefundReason = 'duplicate' | 'fraudulent' | 'requested_by_customer' | 'expired_uncaptured_charge' | 'other';

export interface RefundPreview {
  originalAmount: number;
  refundAmount: number;
  currency: string;
  applicationFeeRefund?: number;
  transferReversal?: number;
  netRefund: number;
}

export interface RefundSummary {
  id: string;
  paymentIntent: string;
  charge: string;
  amount: number;
  currency: string;
  reason: RefundReason;
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  created: number;
  receiptNumber?: string;
}

export interface RefundDetail extends RefundSummary {
  reasonDescription?: string;
  failureReason?: string;
  failureBalanceTransaction?: string;
  sourceHasBalanceTransaction?: string;
  metadata: Record<string, string>;
}

export interface RefundFilter {
  status?: ('pending' | 'succeeded' | 'failed' | 'canceled')[];
  reason?: RefundReason;
  dateRange?: '7d' | '30d' | '90d' | '1y' | 'custom';
  search?: string;
}

export interface RefundStats {
  totalRefunds: number;
  totalAmount: number;
  pendingRefunds: number;
  failedRefunds: number;
  averageRefundTime: number;
}

export interface RefundPolicy {
  allowPartialRefunds: boolean;
  maxRefundDays: number;
  requireReason: boolean;
  requireApproval: boolean;
  approvalThreshold?: number;
}
