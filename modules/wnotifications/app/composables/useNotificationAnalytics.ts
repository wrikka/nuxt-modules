import { computed } from 'vue';
import { useNotifications } from '.';
import type { Notification } from '../types';

export interface NotificationAnalytics {
  total: number;
  unread: number;
  read: number;
  byType: Record<string, number>;
  byPriority: Record<string, number>;
  byDay: Record<string, number>;
  byWeek: Record<string, number>;
  readRate: number;
  avgPerDay: number;
}

export const useNotificationAnalytics = () => {
  const { notifications } = useNotifications();

  const analytics = computed<NotificationAnalytics>(() => {
    const total = notifications.value.length;
    const unread = notifications.value.filter((n: Notification) => !n.read).length;
    const read = total - unread;

    const byType: Record<string, number> = {};
    const byPriority: Record<string, number> = {};
    const byDay: Record<string, number> = {};
    const byWeek: Record<string, number> = {};

    notifications.value.forEach((notification: Notification) => {
      const type = notification.type;
      const priority = notification.priority;
      const date = new Date(notification.createdAt);
      const dayKey = date.toISOString().split('T')[0];
      const weekKey = getWeekKey(date);

      byType[type] = (byType[type] || 0) + 1;
      byPriority[priority] = (byPriority[priority] || 0) + 1;
      byDay[dayKey] = (byDay[dayKey] || 0) + 1;
      byWeek[weekKey] = (byWeek[weekKey] || 0) + 1;
    });

    const readRate = total > 0 ? (read / total) * 100 : 0;
    const uniqueDays = Object.keys(byDay).length;
    const avgPerDay = uniqueDays > 0 ? total / uniqueDays : 0;

    return {
      total,
      unread,
      read,
      byType,
      byPriority,
      byDay,
      byWeek,
      readRate,
      avgPerDay,
    };
  });

  const getTrend = (days: number = 7) => {
    const now = new Date();
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const recentNotifications = notifications.value.filter(
      (n: Notification) => new Date(n.createdAt) >= startDate,
    );

    const previousStartDate = new Date(startDate.getTime() - days * 24 * 60 * 60 * 1000);
    const previousNotifications = notifications.value.filter(
      (n: Notification) => new Date(n.createdAt) >= previousStartDate && new Date(n.createdAt) < startDate,
    );

    const recentCount = recentNotifications.length;
    const previousCount = previousNotifications.length;

    if (previousCount === 0) {
      return recentCount > 0 ? 100 : 0;
    }

    return ((recentCount - previousCount) / previousCount) * 100;
  };

  const getTopTypes = (limit: number = 5) => {
    const sorted = Object.entries(analytics.value.byType).sort((a, b) => b[1] - a[1]);
    return sorted.slice(0, limit).map(([type, count]) => ({ type, count }));
  };

  const getTopPriorities = (limit: number = 5) => {
    const sorted = Object.entries(analytics.value.byPriority).sort((a, b) => b[1] - a[1]);
    return sorted.slice(0, limit).map(([priority, count]) => ({ priority, count }));
  };

  const getDailyData = (days: number = 7) => {
    const data: Array<{ date: string; count: number; }> = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateKey = date.toISOString().split('T')[0];
      data.push({
        date: dateKey,
        count: analytics.value.byDay[dateKey] || 0,
      });
    }

    return data;
  };

  return {
    analytics,
    getTrend,
    getTopTypes,
    getTopPriorities,
    getDailyData,
  };
};

function getWeekKey(date: Date): string {
  const year = date.getFullYear();
  const week = getWeekNumber(date);
  return `${year}-W${week}`;
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}
