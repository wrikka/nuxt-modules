<script setup lang="ts">
import { computed } from 'vue';
import { useOnboardingGamification } from '#onboarding/composables';

const props = defineProps<{
  showPoints?: boolean;
  showBadges?: boolean;
  showLevel?: boolean;
  showStreak?: boolean;
  compact?: boolean;
}>();

const { earnedPoints, totalPoints, level, streak, badges } = useOnboardingGamification();

const recentBadges = computed(() => {
  const earned = badges.value.filter(b => b.earnedAt);
  return earned.slice(-3).reverse();
});

const progressToNextLevel = computed(() => {
  const currentLevelPoints = level.value * 100;
  const nextLevelPoints = (level.value + 1) * 100;
  const pointsInLevel = earnedPoints.value - currentLevelPoints;
  const pointsNeeded = nextLevelPoints - currentLevelPoints;
  return Math.min(100, Math.round((pointsInLevel / pointsNeeded) * 100));
});
</script>

<template>
  <div 
    class="onboarding-gamification"
    :class="{ 'onboarding-gamification--compact': compact }"
  >
    <!-- Points -->
    <div v-if="showPoints !== false" class="onboarding-gamification__points">
      <span class="onboarding-gamification__points-icon">⭐</span>
      <span class="onboarding-gamification__points-value">
        {{ earnedPoints }}
      </span>
      <span class="onboarding-gamification__points-total">
        / {{ totalPoints }}
      </span>
    </div>

    <!-- Level -->
    <div v-if="showLevel !== false && !compact" class="onboarding-gamification__level">
      <div class="onboarding-gamification__level-header">
        <span class="onboarding-gamification__level-label">Level</span>
        <span class="onboarding-gamification__level-value">{{ level }}</span>
      </div>
      <div class="onboarding-gamification__level-progress">
        <div 
          class="onboarding-gamification__level-fill"
          :style="{ width: `${progressToNextLevel}%` }"
        />
      </div>
    </div>

    <!-- Streak -->
    <div v-if="showStreak !== false && streak > 0" class="onboarding-gamification__streak">
      <span class="onboarding-gamification__streak-icon">🔥</span>
      <span class="onboarding-gamification__streak-value">{{ streak }}</span>
      <span class="onboarding-gamification__streak-label">วันติดต่อกัน</span>
    </div>

    <!-- Badges -->
    <div v-if="showBadges !== false" class="onboarding-gamification__badges">
      <h5 class="onboarding-gamification__badges-title">เหรียญที่ได้รับ</h5>
      <div class="onboarding-gamification__badges-list">
        <div 
          v-for="badge in recentBadges" 
          :key="badge.id"
          class="onboarding-gamification__badge"
          :title="badge.name"
        >
          <span class="onboarding-gamification__badge-icon">
            {{ badge.icon ?? '🏅' }}
          </span>
        </div>
        <div 
          v-if="badges.length > 3"
          class="onboarding-gamification__badge onboarding-gamification__badge--more"
        >
          +{{ badges.length - 3 }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.onboarding-gamification {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, var(--onboarding-primary-light, #eff6ff), var(--onboarding-bg, #fff));
  border-radius: 0.75rem;
  border: 1px solid var(--onboarding-border, #e5e7eb);
}

.onboarding-gamification--compact {
  padding: 0.5rem;
  gap: 0.75rem;
}

/* Points */
.onboarding-gamification__points {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.onboarding-gamification__points-icon {
  font-size: 1rem;
}

.onboarding-gamification__points-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--onboarding-primary, #3b82f6);
}

.onboarding-gamification__points-total {
  font-size: 0.875rem;
  color: var(--onboarding-text-muted, #6b7280);
}

/* Level */
.onboarding-gamification__level {
  flex: 1;
  min-width: 8rem;
}

.onboarding-gamification__level-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.onboarding-gamification__level-label {
  font-size: 0.75rem;
  color: var(--onboarding-text-muted, #6b7280);
}

.onboarding-gamification__level-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--onboarding-primary, #3b82f6);
}

.onboarding-gamification__level-progress {
  height: 0.375rem;
  background: var(--onboarding-progress-bg, #e5e7eb);
  border-radius: 9999px;
  overflow: hidden;
}

.onboarding-gamification__level-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--onboarding-primary, #3b82f6), var(--onboarding-success, #10b981));
  transition: width 0.3s ease;
}

/* Streak */
.onboarding-gamification__streak {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.onboarding-gamification__streak-icon {
  font-size: 1rem;
}

.onboarding-gamification__streak-value {
  font-size: 1rem;
  font-weight: 600;
  color: var(--onboarding-warning, #f59e0b);
}

.onboarding-gamification__streak-label {
  font-size: 0.75rem;
  color: var(--onboarding-text-muted, #6b7280);
}

/* Badges */
.onboarding-gamification__badges {
  width: 100%;
}

.onboarding-gamification__badges-title {
  margin: 0 0 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--onboarding-text-muted, #6b7280);
}

.onboarding-gamification__badges-list {
  display: flex;
  gap: 0.5rem;
}

.onboarding-gamification__badge {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: var(--onboarding-bg, #fff);
  border: 2px solid var(--onboarding-warning, #f59e0b);
  display: flex;
  align-items: center;
  justify-content: center;
}

.onboarding-gamification__badge--more {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--onboarding-text-muted, #6b7280);
  border-color: var(--onboarding-border, #e5e7eb);
}

.onboarding-gamification__badge-icon {
  font-size: 1.25rem;
}
</style>
