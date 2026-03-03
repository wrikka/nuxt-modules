<script setup lang="ts">
import { ref, computed } from '#imports';
import type { ScheduledEvent, CalendarEvent } from '#feature-flags/types';

const currentDate = ref(new Date());
const events = ref<ScheduledEvent[]>([]);
const isLoading = ref(false);
const selectedEvent = ref<ScheduledEvent | null>(null);

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const loadEvents = () => {
  isLoading.value = true;

  setTimeout(() => {
    const year = currentDate.value.getFullYear();
    const month = currentDate.value.getMonth();

    events.value = [
      {
        id: '1',
        flagKey: 'holiday-promo',
        action: 'enable',
        scheduledAt: new Date(year, month, 15).getTime(),
        status: 'pending',
        createdBy: 'admin',
        environment: 'production',
      },
      {
        id: '2',
        flagKey: 'holiday-promo',
        action: 'disable',
        scheduledAt: new Date(year, month, 28).getTime(),
        status: 'pending',
        createdBy: 'admin',
        environment: 'production',
      },
      {
        id: '3',
        flagKey: 'new-feature',
        action: 'enable',
        scheduledAt: new Date(year, month, 10).getTime(),
        status: 'executed',
        executedAt: new Date(year, month, 10, 9, 0).getTime(),
        createdBy: 'developer',
        environment: 'staging',
      },
      {
        id: '4',
        flagKey: 'maintenance-mode',
        action: 'enable',
        scheduledAt: new Date(year, month, 20, 2, 0).getTime(),
        status: 'pending',
        createdBy: 'ops',
        environment: 'production',
        notification: { enabled: true, channels: ['email', 'slack'], recipients: ['team@example.com'], leadTime: 3600000 },
      },
    ];

    isLoading.value = false;
  }, 300);
};

const currentMonth = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  const days: { date: Date; isCurrentMonth: boolean }[] = [];

  for (let i = 0; i < startDayOfWeek; i++) {
    const prevMonthDay = new Date(year, month, -startDayOfWeek + i + 1);
    days.push({ date: prevMonthDay, isCurrentMonth: false });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ date: new Date(year, month, i), isCurrentMonth: true });
  }

  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
  }

  return days;
});

const getEventsForDay = (date: Date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const end = start + 86400000;

  return events.value.filter((e) => e.scheduledAt >= start && e.scheduledAt < end);
};

const getActionColor = (action: string) => {
  const colors: Record<string, string> = {
    enable: '#10b981',
    disable: '#ef4444',
    'update-rollout': '#f59e0b',
    'update-targeting': '#8b5cf6',
  };
  return colors[action] || '#6b7280';
};

const getStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    pending: 'background: #fef3c7; color: #92400e',
    executed: 'background: #d1fae5; color: #065f46',
    failed: 'background: #fee2e2; color: #991b1b',
    cancelled: 'background: #e5e7eb; color: #374151',
  };
  return styles[status] || '';
};

const prevMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1);
};

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1);
};

const selectEvent = (event: ScheduledEvent) => {
  selectedEvent.value = event;
};

const isToday = (date: Date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};
</script>

<template>
  <div class="sc-container">
    <div class="sc-header">
      <h3>Scheduled Rollouts</h3>
      <button
        class="sc-btn sc-btn-sm"
        :disabled="isLoading"
        @click="loadEvents"
      >
        {{ isLoading ? 'Loading...' : 'Refresh' }}
      </button>
    </div>

    <div v-if="events.length === 0 && !isLoading" class="sc-empty">
      <button class="sc-btn sc-btn-primary" @click="loadEvents">
        Load Schedule
      </button>
    </div>

    <template v-else>
      <div class="sc-calendar">
        <div class="sc-calendar-header">
          <button class="sc-btn sc-btn-icon" @click="prevMonth">‹</button>
          <span class="sc-month-title">
            {{ monthNames[currentDate.getMonth()] }} {{ currentDate.getFullYear() }}
          </span>
          <button class="sc-btn sc-btn-icon" @click="nextMonth">›</button>
        </div>

        <div class="sc-weekdays">
          <span v-for="day in dayNames" :key="day">{{ day }}</span>
        </div>

        <div class="sc-days">
          <div
            v-for="(day, i) in currentMonth"
            :key="i"
            class="sc-day"
            :class="{
              'sc-other-month': !day.isCurrentMonth,
              'sc-today': isToday(day.date)
            }"
          >
            <span class="sc-day-number">{{ day.date.getDate() }}</span>
            <div class="sc-day-events">
              <div
                v-for="event in getEventsForDay(day.date)"
                :key="event.id"
                class="sc-event-dot"
                :style="{ background: getActionColor(event.action) }"
                @click="selectEvent(event)"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="sc-upcoming">
        <h4>Upcoming</h4>
        <div class="sc-event-list">
          <div
            v-for="event in events.filter(e => e.status === 'pending').slice(0, 5)"
            :key="event.id"
            class="sc-event-item"
            @click="selectEvent(event)"
          >
            <div
              class="sc-event-indicator"
              :style="{ background: getActionColor(event.action) }"
            />
            <div class="sc-event-info">
              <span class="sc-event-flag">{{ event.flagKey }}</span>
              <span class="sc-event-action">{{ event.action }}</span>
            </div>
            <div class="sc-event-meta">
              <span class="sc-event-date">{{ new Date(event.scheduledAt).toLocaleDateString() }}</span>
              <span class="sc-event-env">{{ event.environment }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="selectedEvent" class="sc-detail-panel">
        <div class="sc-detail-header">
          <h4>{{ selectedEvent.flagKey }}</h4>
          <button class="sc-btn sc-btn-icon" @click="selectedEvent = null">×</button>
        </div>
        <div class="sc-detail-content">
          <div class="sc-detail-row">
            <span>Action:</span>
            <span :style="{ color: getActionColor(selectedEvent.action) }">
              {{ selectedEvent.action }}
            </span>
          </div>
          <div class="sc-detail-row">
            <span>Scheduled:</span>
            <span>{{ new Date(selectedEvent.scheduledAt).toLocaleString() }}</span>
          </div>
          <div class="sc-detail-row">
            <span>Status:</span>
            <span class="sc-status-badge" :style="getStatusBadge(selectedEvent.status)">
              {{ selectedEvent.status }}
            </span>
          </div>
          <div class="sc-detail-row">
            <span>Environment:</span>
            <span>{{ selectedEvent.environment }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.sc-container {
  font-family: system-ui, -apple-system, sans-serif;
  padding: 1rem;
}

.sc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.sc-header h3 {
  margin: 0;
  font-size: 1.125rem;
}

.sc-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
}

.sc-btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

.sc-btn-icon {
  padding: 0.25rem 0.5rem;
  font-size: 1rem;
  min-width: 32px;
}

.sc-btn-primary {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.sc-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.sc-empty {
  text-align: center;
  padding: 2rem;
}

.sc-calendar {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.sc-calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.sc-month-title {
  font-weight: 600;
  font-size: 0.875rem;
}

.sc-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: 0.5rem 0.25rem;
  border-bottom: 1px solid #e5e7eb;
}

.sc-weekdays span {
  text-align: center;
  font-size: 0.75rem;
  color: #6b7280;
}

.sc-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #e5e7eb;
}

.sc-day {
  background: white;
  padding: 0.25rem;
  min-height: 40px;
  cursor: pointer;
}

.sc-day.sc-other-month {
  background: #f9fafb;
}

.sc-day.sc-today {
  background: #eff6ff;
}

.sc-day-number {
  font-size: 0.75rem;
  display: block;
  text-align: center;
}

.sc-day.sc-today .sc-day-number {
  background: #3b82f6;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin: 0 auto;
  line-height: 20px;
}

.sc-day-events {
  display: flex;
  justify-content: center;
  gap: 2px;
  margin-top: 2px;
}

.sc-event-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  cursor: pointer;
}

.sc-upcoming {
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin-bottom: 1rem;
}

.sc-upcoming h4 {
  margin: 0 0 0.5rem;
  font-size: 0.875rem;
}

.sc-event-list {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.sc-event-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: white;
  border-radius: 0.25rem;
  cursor: pointer;
}

.sc-event-indicator {
  width: 4px;
  height: 24px;
  border-radius: 2px;
}

.sc-event-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.sc-event-flag {
  font-size: 0.75rem;
  font-weight: 500;
}

.sc-event-action {
  font-size: 0.625rem;
  color: #6b7280;
  text-transform: capitalize;
}

.sc-event-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.sc-event-date {
  font-size: 0.75rem;
}

.sc-event-env {
  font-size: 0.625rem;
  color: #6b7280;
}

.sc-detail-panel {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.75rem;
}

.sc-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.sc-detail-header h4 {
  margin: 0;
  font-size: 0.875rem;
}

.sc-detail-content {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.sc-detail-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
}

.sc-detail-row span:first-child {
  color: #6b7280;
}

.sc-status-badge {
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.625rem;
  text-transform: uppercase;
}
</style>
