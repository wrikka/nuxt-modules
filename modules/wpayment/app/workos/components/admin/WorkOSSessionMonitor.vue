<template>
  <div class="session-monitor">
    <div class="monitor-header">
      <h2>Session Activity</h2>
      <div class="header-actions">
        <WorkOSButton variant="danger" @click="revokeAllSessions">
          Revoke All Sessions
        </WorkOSButton>
        <WorkOSButton variant="secondary" @click="refreshSessions">Refresh</WorkOSButton>
      </div>
    </div>

    <div class="current-session">
      <div class="session-badge">Current Session</div>
      <div class="session-info">
        <div class="device-icon">💻</div>
        <div class="session-details">
          <h4>{{ currentSession.device }}</h4>
          <p>{{ currentSession.browser }} • {{ currentSession.os }}</p>
          <p class="session-meta">
            <span class="location">📍 {{ currentSession.location }}</span>
            <span class="ip">IP: {{ currentSession.ip }}</span>
          </p>
        </div>
        <div class="session-status">
          <span class="status-dot active"></span>
          <span>Active now</span>
        </div>
      </div>
    </div>

    <div class="other-sessions">
      <h3>Other Sessions ({{ otherSessions.length }})</h3>
      <div v-if="otherSessions.length === 0" class="empty-state">
        <p>No other active sessions</p>
      </div>
      <div v-else class="sessions-list">
        <div
          v-for="session in otherSessions"
          :key="session.id"
          class="session-item"
          :class="{ warning: session.isSuspicious }"
        >
          <div class="device-icon">{{ getDeviceIcon(session.deviceType) }}</div>
          <div class="session-details">
            <h4>{{ session.device }}</h4>
            <p>{{ session.browser }} • {{ session.os }}</p>
            <p class="session-meta">
              <span class="location">📍 {{ session.location }}</span>
              <span class="ip">IP: {{ session.ip }}</span>
            </p>
            <p class="last-active">Last active: {{ formatLastActive(session.lastActive) }}</p>
          </div>
          <div class="session-actions">
            <span v-if="session.isSuspicious" class="warning-badge">⚠️ Suspicious</span>
            <WorkOSButton variant="danger" sm @click="revokeSession(session.id)">
              Revoke
            </WorkOSButton>
          </div>
        </div>
      </div>
    </div>

    <div class="session-history">
      <h3>Recent Activity</h3>
      <div class="activity-timeline">
        <div
          v-for="activity in recentActivity"
          :key="activity.id"
          class="activity-item"
        >
          <div :class="['activity-icon', activity.type]">
            {{ getActivityIcon(activity.type) }}
          </div>
          <div class="activity-content">
            <p class="activity-text">{{ activity.description }}</p>
            <p class="activity-time">{{ formatTime(activity.timestamp) }}</p>
          </div>
        </div>
      </div>
    </div>

    <WorkOSModal
      :show="showRevokeModal"
      title="Revoke Session"
      @close="showRevokeModal = false"
    >
      <p>Are you sure you want to revoke this session? The user will be signed out immediately.</p>
      <template #footer>
        <WorkOSButton variant="secondary" @click="showRevokeModal = false">
          Cancel
        </WorkOSButton>
        <WorkOSButton variant="danger" @click="confirmRevoke">Revoke</WorkOSButton>
      </template>
    </WorkOSModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import WorkOSButton from "./base/WorkOSButton.vue"
import WorkOSModal from "./base/WorkOSModal.vue"

interface Session {
  id: string
  device: string
  deviceType: "desktop" | "mobile" | "tablet"
  browser: string
  os: string
  location: string
  ip: string
  lastActive: Date
  isSuspicious?: boolean
}

interface Activity {
  id: string
  type: "login" | "logout" | "password_change" | "device_added" | "suspicious"
  description: string
  timestamp: Date
}

const showRevokeModal = ref(false)
const sessionToRevoke = ref<string | null>(null)

const currentSession = ref<Session>({
  id: "current",
  device: "MacBook Pro",
  deviceType: "desktop",
  browser: "Chrome 120",
  os: "macOS Sonoma",
  location: "Bangkok, Thailand",
  ip: "192.168.1.1",
  lastActive: new Date(),
})

const otherSessions = ref<Session[]>([
  {
    id: "1",
    device: "iPhone 15 Pro",
    deviceType: "mobile",
    browser: "Safari",
    os: "iOS 17",
    location: "Bangkok, Thailand",
    ip: "192.168.1.2",
    lastActive: new Date(Date.now() - 3600000),
  },
  {
    id: "2",
    device: "Windows PC",
    deviceType: "desktop",
    browser: "Firefox",
    os: "Windows 11",
    location: "Singapore",
    ip: "203.0.113.1",
    lastActive: new Date(Date.now() - 86400000),
    isSuspicious: true,
  },
])

const recentActivity = ref<Activity[]>([
  {
    id: "1",
    type: "login",
    description: "Signed in from MacBook Pro in Bangkok, Thailand",
    timestamp: new Date(),
  },
  {
    id: "2",
    type: "device_added",
    description: "New device added: iPhone 15 Pro",
    timestamp: new Date(Date.now() - 86400000),
  },
  {
    id: "3",
    type: "suspicious",
    description: "Suspicious login attempt from Singapore blocked",
    timestamp: new Date(Date.now() - 172800000),
  },
  {
    id: "4",
    type: "password_change",
    description: "Password changed successfully",
    timestamp: new Date(Date.now() - 259200000),
  },
])

const getDeviceIcon = (type: Session["deviceType"]) => {
  const icons = {
    desktop: "💻",
    mobile: "📱",
    tablet: "📟",
  }
  return icons[type]
}

const getActivityIcon = (type: Activity["type"]) => {
  const icons = {
    login: "🔑",
    logout: "🚪",
    password_change: "🔒",
    device_added: "📱",
    suspicious: "⚠️",
  }
  return icons[type]
}

const formatLastActive = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `${minutes} minutes ago`
  if (hours < 24) return `${hours} hours ago`
  return `${days} days ago`
}

const formatTime = (date: Date) => {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

const refreshSessions = async () => {
  // Refresh logic
}

const revokeSession = (sessionId: string) => {
  sessionToRevoke.value = sessionId
  showRevokeModal.value = true
}

const confirmRevoke = async () => {
  if (sessionToRevoke.value) {
    otherSessions.value = otherSessions.value.filter(s => s.id !== sessionToRevoke.value)
    showRevokeModal.value = false
    sessionToRevoke.value = null
  }
}

const revokeAllSessions = async () => {
  otherSessions.value = []
}
</script>

<style scoped>
.session-monitor {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.monitor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.monitor-header h2 {
  margin: 0;
  color: #1f2937;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.current-session {
  background: #eff6ff;
  border: 2px solid #2563eb;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.session-badge {
  display: inline-block;
  background: #2563eb;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.session-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.device-icon {
  font-size: 2.5rem;
}

.session-details h4 {
  margin: 0;
  color: #1f2937;
}

.session-details p {
  margin: 0.25rem 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.session-meta {
  display: flex;
  gap: 1rem;
}

.session-status {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #10b981;
  font-weight: 500;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.active {
  background: #10b981;
}

.other-sessions h3 {
  margin: 0 0 1rem 0;
  color: #1f2937;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.session-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.session-item:hover {
  background: #f3f4f6;
}

.session-item.warning {
  background: #fef3c7;
  border: 1px solid #f59e0b;
}

.session-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.warning-badge {
  color: #d97706;
  font-size: 0.75rem;
  font-weight: 500;
}

.last-active {
  color: #9ca3af;
  font-size: 0.75rem;
}

.session-history {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

.session-history h3 {
  margin: 0 0 1rem 0;
  color: #1f2937;
}

.activity-timeline {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.activity-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  background: #f3f4f6;
}

.activity-icon.login {
  background: #dbeafe;
}

.activity-icon.logout {
  background: #fee2e2;
}

.activity-icon.password_change {
  background: #d1fae5;
}

.activity-icon.device_added {
  background: #fef3c7;
}

.activity-icon.suspicious {
  background: #fee2e2;
}

.activity-content {
  flex: 1;
}

.activity-text {
  margin: 0;
  color: #374151;
}

.activity-time {
  margin: 0.25rem 0 0 0;
  color: #9ca3af;
  font-size: 0.75rem;
}
</style>
