<script setup lang="ts">
import { ref } from 'vue';

interface SuspiciousActivity {
  id: string;
  type: 'self_referral' | 'fake_account' | 'suspicious_pattern' | 'ip_mismatch';
  userId: string;
  user: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
  description: string;
  status: 'pending' | 'investigating' | 'resolved' | 'blocked';
}

const activities = ref<SuspiciousActivity[]>([
  {
    id: '1',
    type: 'self_referral',
    userId: 'user-1',
    user: 'John Doe',
    severity: 'high',
    timestamp: new Date('2024-02-17'),
    description: 'User referred themselves using different email',
    status: 'pending',
  },
  {
    id: '2',
    type: 'fake_account',
    userId: 'user-2',
    user: 'Jane Smith',
    severity: 'medium',
    timestamp: new Date('2024-02-16'),
    description: 'Multiple accounts from same IP address',
    status: 'investigating',
  },
  {
    id: '3',
    type: 'suspicious_pattern',
    userId: 'user-3',
    user: 'Bob Johnson',
    severity: 'low',
    timestamp: new Date('2024-02-15'),
    description: 'Unusual referral pattern detected',
    status: 'pending',
  },
]);

const stats = ref({
  totalDetected: 45,
  blocked: 32,
  investigating: 8,
  resolved: 5,
});

function getStatusColor(status: string) {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    investigating: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
    blocked: 'bg-red-100 text-red-800',
  };
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
}

function getSeverityColor(severity: string) {
  const colors = {
    low: 'text-green-600',
    medium: 'text-yellow-600',
    high: 'text-red-600',
  };
  return colors[severity as keyof typeof colors] || 'text-gray-600';
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Referral Fraud Detection</h1>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-500">Total Detected</div>
        <div class="text-2xl font-bold text-blue-600">{{ stats.totalDetected }}</div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-500">Blocked</div>
        <div class="text-2xl font-bold text-red-600">{{ stats.blocked }}</div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-500">Investigating</div>
        <div class="text-2xl font-bold text-yellow-600">{{ stats.investigating }}</div>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <div class="text-sm text-gray-500">Resolved</div>
        <div class="text-2xl font-bold text-green-600">{{ stats.resolved }}</div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Suspicious Activities</h2>
      <div class="space-y-3">
        <div
          v-for="activity in activities"
          :key="activity.id"
          class="p-4 rounded-lg border border-gray-200"
        >
          <div class="flex justify-between items-start mb-2">
            <div>
              <h3 class="font-semibold">{{ activity.user }}</h3>
              <p class="text-sm text-gray-600">{{ activity.description }}</p>
            </div>
            <span
              class="px-2 py-1 rounded-full text-xs font-medium"
              :class="getStatusColor(activity.status)"
            >
              {{ activity.status }}
            </span>
          </div>
          <div class="flex justify-between text-xs text-gray-500">
            <span>{{ new Date(activity.timestamp).toLocaleString() }}</span>
            <span :class="getSeverityColor(activity.severity)">
              {{ activity.severity.toUpperCase() }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
