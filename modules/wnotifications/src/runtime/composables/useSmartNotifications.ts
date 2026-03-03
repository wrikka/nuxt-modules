import { ref } from 'vue';
import type { Notification } from '../types';

export interface NotificationActivity {
  notificationId: string;
  openedAt: Date;
  type: string;
  priority: string;
}

export interface SmartSchedule {
  hour: number;
  minute: number;
  score: number;
  reason: string;
}

export const useSmartNotifications = () => {
  const notificationActivities = ref<NotificationActivity[]>([]);
  const enabled = ref(true);

  const recordActivity = (notification: Notification) => {
    notificationActivities.value.push({
      notificationId: notification.id,
      openedAt: new Date(),
      type: notification.type,
      priority: notification.priority,
    });

    if (notificationActivities.value.length > 1000) {
      notificationActivities.value = notificationActivities.value.slice(-1000);
    }
  };

  const getActivityByHour = () => {
    const activityByHour: Record<number, number> = {};

    notificationActivities.value.forEach(activity => {
      const hour = activity.openedAt.getHours();
      activityByHour[hour] = (activityByHour[hour] || 0) + 1;
    });

    return activityByHour;
  };

  const getActivityByDayOfWeek = () => {
    const activityByDay: Record<number, number> = {};

    notificationActivities.value.forEach(activity => {
      const day = activity.openedAt.getDay();
      activityByDay[day] = (activityByDay[day] || 0) + 1;
    });

    return activityByDay;
  };

  const getOptimalSendTime = (currentDate: Date = new Date()): SmartSchedule => {
    const activityByHour = getActivityByHour();
    const activityByDay = getActivityByDayOfWeek();
    const currentHour = currentDate.getHours();
    const currentDay = currentDate.getDay();

    if (Object.keys(activityByHour).length === 0) {
      return {
        hour: 9,
        minute: 0,
        score: 50,
        reason: 'Default time (no activity data)',
      };
    }

    const scores: Array<{ hour: number; score: number; reason: string; }> = [];

    for (let hour = 8; hour <= 20; hour++) {
      let score = 0;
      const reasons: string[] = [];

      const hourActivity = activityByHour[hour] || 0;
      score += hourActivity * 10;
      if (hourActivity > 0) {
        reasons.push(`High activity at ${hour}:00 (${hourActivity} opens)`);
      }

      const dayActivity = activityByDay[currentDay] || 0;
      score += dayActivity * 5;
      if (dayActivity > 0) {
        reasons.push(`High activity on this day (${dayActivity} opens)`);
      }

      if (hour >= 9 && hour <= 11) {
        score += 15;
        reasons.push('Morning peak (9-11 AM)');
      } else if (hour >= 14 && hour <= 16) {
        score += 15;
        reasons.push('Afternoon peak (2-4 PM)');
      }

      if (hour === currentHour) {
        score -= 20;
        reasons.push('Same as current time (avoid immediate)');
      }

      if (Math.abs(hour - currentHour) <= 1) {
        score -= 10;
        reasons.push('Too close to current time');
      }

      scores.push({
        hour,
        score,
        reason: reasons.join(', '),
      });
    }

    scores.sort((a, b) => b.score - a.score);

    const best = scores[0];
    return {
      hour: best.hour,
      minute: 0,
      score: best.score,
      reason: best.reason,
    };
  };

  const getEngagementRate = () => {
    if (notificationActivities.value.length === 0) {
      return 0;
    }

    const last7Days = notificationActivities.value.filter(
      a => a.openedAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    );

    const uniqueNotifications = new Set(last7Days.map(a => a.notificationId)).size;
    const totalActivities = last7Days.length;

    if (uniqueNotifications === 0) {
      return 0;
    }

    return (totalActivities / uniqueNotifications) * 100;
  };

  const getBestDays = (): Array<{ day: number; name: string; count: number; }> => {
    const activityByDay = getActivityByDayOfWeek();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return Object.entries(activityByDay)
      .map(([day, count]) => ({
        day: parseInt(day),
        name: dayNames[parseInt(day)],
        count: count as number,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  };

  const getBestHours = (): Array<{ hour: number; count: number; }> => {
    const activityByHour = getActivityByHour();

    return Object.entries(activityByHour)
      .map(([hour, count]) => ({
        hour: parseInt(hour),
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  };

  return {
    notificationActivities,
    enabled,
    recordActivity,
    getOptimalSendTime,
    getEngagementRate,
    getBestDays,
    getBestHours,
  };
};
