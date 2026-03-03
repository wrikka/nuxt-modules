<template>
  <div class="user-avatar" :class="sizeClass">
    <div class="avatar-wrapper" @click="handleClick">
      <img v-if="avatarUrl" :src="avatarUrl" :alt="displayName" class="avatar-image" @error="onImageError" />
      <div v-else class="avatar-placeholder" :style="avatarStyle">
        {{ initials }}
      </div>
      
      <!-- Status Indicator -->
      <span v-if="showStatus" class="status-indicator" :class="statusClass">
        <span class="status-dot"></span>
      </span>
    </div>

    <!-- User Info -->
    <div v-if="showInfo" class="user-info">
      <span class="user-name">{{ displayName }}</span>
      <span v-if="showRole && role" class="user-role">{{ role }}</span>
    </div>

    <!-- Role Badge -->
    <span v-if="showRole && role && !showInfo" class="role-badge">{{ role }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import type { User } from "../shared/types"

interface Props {
  user?: User | null
  avatarUrl?: string
  firstName?: string
  lastName?: string
  email?: string
  role?: string
  status?: "online" | "offline" | "away" | "busy"
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  showStatus?: boolean
  showRole?: boolean
  showInfo?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  user: null,
  avatarUrl: "",
  firstName: "",
  lastName: "",
  email: "",
  role: "",
  status: "offline",
  size: "md",
  showStatus: false,
  showRole: false,
  showInfo: false,
})

const emit = defineEmits<{
  click: []
}>()

const imageError = ref(false)

const displayName = computed(() => {
  if (props.user) {
    return `${props.user.firstName || ""} ${props.user.lastName || ""}`.trim() || props.user.email
  }
  return `${props.firstName} ${props.lastName}`.trim() || props.email || "User"
})

const initials = computed(() => {
  const name = displayName.value
  const parts = name.split(" ").filter(Boolean)
  if (parts.length >= 2) {
    const firstChar = parts[0]?.[0] ?? ""
    const lastChar = parts[parts.length - 1]?.[0] ?? ""
    return (firstChar + lastChar).toUpperCase()
  }
  return (name.charAt(0) || "U").toUpperCase()
})

const avatarStyle = computed(() => {
  const colors = [
    "background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "background: linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    "background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    "background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  ]
  const index = initials.value.charCodeAt(0) % colors.length
  return colors[index]
})

const sizeClass = computed(() => `size-${props.size}`)

const statusClass = computed(() => {
  const statusMap: Record<string, string> = {
    online: "status-online",
    offline: "status-offline",
    away: "status-away",
    busy: "status-busy",
  }
  return statusMap[props.status] || "status-offline"
})

const handleClick = () => {
  emit("click")
}

const onImageError = () => {
  imageError.value = true
}
</script>

<style scoped>
.user-avatar {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.avatar-wrapper {
  position: relative;
  display: inline-flex;
  cursor: pointer;
}

.avatar-image,
.avatar-placeholder {
  border-radius: 50%;
  object-fit: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
}

/* Sizes */
.size-xs .avatar-image,
.size-xs .avatar-placeholder {
  width: 24px;
  height: 24px;
  font-size: 0.625rem;
}

.size-sm .avatar-image,
.size-sm .avatar-placeholder {
  width: 32px;
  height: 32px;
  font-size: 0.75rem;
}

.size-md .avatar-image,
.size-md .avatar-placeholder {
  width: 40px;
  height: 40px;
  font-size: 0.875rem;
}

.size-lg .avatar-image,
.size-lg .avatar-placeholder {
  width: 48px;
  height: 48px;
  font-size: 1rem;
}

.size-xl .avatar-image,
.size-xl .avatar-placeholder {
  width: 64px;
  height: 64px;
  font-size: 1.25rem;
}

/* Status Indicator */
.status-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.size-xs .status-indicator {
  width: 8px;
  height: 8px;
}

.size-sm .status-indicator {
  width: 10px;
  height: 10px;
}

.size-md .status-indicator {
  width: 12px;
  height: 12px;
}

.size-lg .status-indicator {
  width: 14px;
  height: 14px;
}

.size-xl .status-indicator {
  width: 16px;
  height: 16px;
}

.status-dot {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid white;
}

.status-online .status-dot {
  background: #10b981;
}

.status-offline .status-dot {
  background: #6b7280;
}

.status-away .status-dot {
  background: #f59e0b;
}

.status-busy .status-dot {
  background: #ef4444;
}

/* User Info */
.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
}

.user-role {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Role Badge */
.role-badge {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  background: #e0e7ff;
  color: #3730a3;
  border-radius: 9999px;
  font-size: 0.625rem;
  font-weight: 500;
  text-transform: uppercase;
}
</style>
