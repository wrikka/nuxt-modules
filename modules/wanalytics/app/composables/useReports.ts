import { computed, ref } from 'vue';
import type { Report, ReportConfig, ReportData, ReportRecipient, ReportSchedule, ReportType } from '#analytics/types';
import { useAnalyticsConfig } from './useAnalyticsConfig';

export const useReports = () => {
  const reportConfig = useAnalyticsConfig().reports as ReportConfig;

  const reports = ref<Report[]>([]);
  const schedules = ref<ReportSchedule[]>([]);
  const isLoading = ref(false);

  const isEnabled = computed(() => reportConfig.enabled);

  const createReport = (
    name: string,
    type: ReportType,
    options: Partial<Report> = {},
  ): Report | null => {
    if (!isEnabled.value) return null;

    const report: Report = {
      id: crypto.randomUUID(),
      name,
      type,
      format: 'pdf',
      status: 'draft',
      recipients: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      enabled: true,
      ...options,
    };

    reports.value.push(report);
    return report;
  };

  const updateReport = (reportId: string, updates: Partial<Report>): Report | null => {
    const report = reports.value.find(r => r.id === reportId);
    if (!report) return null;

    Object.assign(report, updates, { updatedAt: new Date() });
    return report;
  };

  const deleteReport = (reportId: string): boolean => {
    const index = reports.value.findIndex(r => r.id === reportId);
    if (index === -1) return false;

    reports.value.splice(index, 1);
    return true;
  };

  const getReport = (reportId: string): Report | undefined => {
    return reports.value.find(r => r.id === reportId);
  };

  const generateReport = async (reportId: string): Promise<ReportData | null> => {
    const report = getReport(reportId);
    if (!report) return null;

    isLoading.value = true;

    try {
      report.status = 'generating';

      // Mock report data
      const data: ReportData = {
        reportId,
        generatedAt: new Date(),
        period: report.period ?? { start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), end: new Date() },
        metrics: [
          { name: 'visitors', value: 50000, previousValue: 45000, change: 11.1, trend: 'up' },
          { name: 'sessions', value: 65000, previousValue: 58000, change: 12.1, trend: 'up' },
          { name: 'pageViews', value: 250000, previousValue: 220000, change: 13.6, trend: 'up' },
          { name: 'conversions', value: 500, previousValue: 450, change: 11.1, trend: 'up' },
        ],
        charts: [
          {
            type: 'line',
            title: 'Visitors Over Time',
            data: [
              { week: 'Week 1', visitors: 10000 },
              { week: 'Week 2', visitors: 12500 },
              { week: 'Week 3', visitors: 13000 },
              { week: 'Week 4', visitors: 14500 },
            ],
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          },
          {
            type: 'pie',
            title: 'Traffic Sources',
            data: [
              { source: 'Direct', value: 30 },
              { source: 'Organic', value: 40 },
              { source: 'Referral', value: 20 },
              { source: 'Social', value: 10 },
            ],
            labels: ['Direct', 'Organic', 'Referral', 'Social'],
          },
        ],
        insights: [
          'Traffic increased by 15% compared to previous period',
          'Mobile users now account for 60% of total traffic',
          'Conversion rate improved by 0.2 percentage points',
        ],
      };

      report.status = 'completed';
      report.lastGenerated = new Date();

      return data;
    } finally {
      isLoading.value = false;
    }
  };

  const scheduleReport = (
    reportId: string,
    frequency: ReportSchedule['frequency'],
    recipients: ReportRecipient[],
    options: Partial<ReportSchedule> = {},
  ): ReportSchedule | null => {
    const report = getReport(reportId);
    if (!report) return null;

    if (recipients.length > reportConfig.maxRecipients) return null;

    const schedule: ReportSchedule = {
      id: crypto.randomUUID(),
      reportId,
      frequency,
      recipients,
      nextRun: calculateNextRun(frequency),
      active: true,
      ...options,
    };

    schedules.value.push(schedule);
    return schedule;
  };

  const updateSchedule = (scheduleId: string, updates: Partial<ReportSchedule>): ReportSchedule | null => {
    const schedule = schedules.value.find(s => s.id === scheduleId);
    if (!schedule) return null;

    Object.assign(schedule, updates);
    return schedule;
  };

  const deleteSchedule = (scheduleId: string): boolean => {
    const index = schedules.value.findIndex(s => s.id === scheduleId);
    if (index === -1) return false;

    schedules.value.splice(index, 1);
    return true;
  };

  const pauseSchedule = (scheduleId: string): boolean => {
    const schedule = schedules.value.find(s => s.id === scheduleId);
    if (!schedule) return false;

    schedule.active = false;
    return true;
  };

  const resumeSchedule = (scheduleId: string): boolean => {
    const schedule = schedules.value.find(s => s.id === scheduleId);
    if (!schedule) return false;

    schedule.active = true;
    schedule.nextRun = calculateNextRun(schedule.frequency);
    return true;
  };

  const calculateNextRun = (frequency: ReportSchedule['frequency']): Date => {
    const now = new Date();
    const next = new Date(now);

    switch (frequency) {
      case 'daily':
        next.setDate(next.getDate() + 1);
        next.setHours(8, 0, 0, 0);
        break;
      case 'weekly':
        next.setDate(next.getDate() + (7 - next.getDay()));
        next.setHours(8, 0, 0, 0);
        break;
      case 'monthly':
        next.setMonth(next.getMonth() + 1);
        next.setDate(1);
        next.setHours(8, 0, 0, 0);
        break;
      case 'quarterly':
        next.setMonth(Math.floor(next.getMonth() / 3) * 3 + 3);
        next.setDate(1);
        next.setHours(8, 0, 0, 0);
        break;
    }

    return next;
  };

  const addRecipient = (reportId: string, email: string, name?: string): ReportRecipient | null => {
    const report = getReport(reportId);
    if (!report) return null;
    if (report.recipients.length >= reportConfig.maxRecipients) return null;

    const recipient: ReportRecipient = {
      id: crypto.randomUUID(),
      email,
      name,
      active: true,
    };

    report.recipients.push(recipient);
    return recipient;
  };

  const removeRecipient = (reportId: string, recipientId: string): boolean => {
    const report = getReport(reportId);
    if (!report) return false;

    const index = report.recipients.findIndex(r => r.id === recipientId);
    if (index === -1) return false;

    report.recipients.splice(index, 1);
    return true;
  };

  const getReportsByType = (type: ReportType): Report[] => {
    return reports.value.filter(r => r.type === type);
  };

  const getScheduledReports = (): ReportSchedule[] => {
    return schedules.value.filter(s => s.active);
  };

  return {
    reports,
    schedules,
    isLoading,
    isEnabled,
    createReport,
    updateReport,
    deleteReport,
    getReport,
    generateReport,
    scheduleReport,
    updateSchedule,
    deleteSchedule,
    pauseSchedule,
    resumeSchedule,
    addRecipient,
    removeRecipient,
    getReportsByType,
    getScheduledReports,
  };
};
