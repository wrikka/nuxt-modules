import { readonly, ref } from 'vue';
import type {
  ComplianceReport,
  ComplianceReportStatus,
  ComplianceReportType,
  DateRange,
  PaymentResult,
  ScheduledReportConfig,
  UseComplianceReportingReturn,
} from '#wpayment/types';

export function useComplianceReporting(): UseComplianceReportingReturn {
  const reports = ref<ComplianceReport[]>([]);
  const loading = ref(false);

  const generateReport = async (
    type: ComplianceReportType,
    dateRange: DateRange,
  ): Promise<PaymentResult<string>> => {
    loading.value = true;

    try {
      const result = await $fetch<{ reportId: string }>('/api/compliance/reports', {
        method: 'POST',
        body: {
          type,
          start: dateRange.start.toISOString(),
          end: dateRange.end.toISOString(),
        },
      });

      return { success: true, data: result.reportId };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate report';
      return { success: false, error: { code: 'generate_failed', message, retryable: true } };
    } finally {
      loading.value = false;
    }
  };

  const getReportStatus = async (reportId: string): Promise<ComplianceReportStatus> => {
    const result = await $fetch<ComplianceReportStatus>(`/api/compliance/reports/${reportId}/status`);
    return result;
  };

  const downloadReport = async (reportId: string): Promise<string> => {
    const result = await $fetch<{ url: string }>(`/api/compliance/reports/${reportId}/download`);
    return result.url;
  };

  const scheduleReport = async (config: ScheduledReportConfig): Promise<PaymentResult> => {
    loading.value = true;

    try {
      await $fetch('/api/compliance/schedule', {
        method: 'POST',
        body: config,
      });

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to schedule report';
      return { success: false, error: { code: 'schedule_failed', message, retryable: false } };
    } finally {
      loading.value = false;
    }
  };

  return {
    reports: readonly(reports),
    loading: readonly(loading),
    generateReport,
    getReportStatus,
    downloadReport,
    scheduleReport,
  };
}
