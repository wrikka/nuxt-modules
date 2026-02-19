# @wrikka/pomodoro

Pomodoro Timer Nuxt Module - เครื่องมือจัดการเวลาแบบ Pomodoro Technique สำหรับ Nuxt.js

## Features

### Core Features
- **Timer Core** - 25min work / 5min short break / 15min long break
- **Timer States** - idle → running → paused → completed
- **Audio Notifications** - เสียงแจ้งเตือนเมื่อหมดเวลา
- **Visual Notifications** - แจ้งเตือนบนหน้าจอ + progress ring

### Task Integration
- **Task Selection** - เลือก task ก่อนเริ่ม pomodoro
- **Pomodoro Counter** - นับจำนวน pomodoros ที่ทำเสร็จต่อวัน

### Settings
- **Custom Durations** - ปรับเวลา work/break ได้เอง
- **Long Break Interval** - กำหนดจำนวน pomodoros ก่อน long break (default: 4)
- **Auto-start Options** - เลือก auto-start break/pomodoro
- **Volume Control** - ปรับระดับเสียง

### Productivity Features
- **Stats Dashboard** - สถิติรายวัน/สัปดาห์/เดือน
- **Focus Mode** - Block การแจ้งเตือนอื่นๆ ขณะ focus
- **Soundscapes** - เสียง background (rain, cafe, forest, waves, fire, white noise)
- **Mini Timer (PiP)** - Floating timer ย่อยจอมุม

### Keyboard Shortcuts
- `Space` - เริ่ม/หยุด timer
- `R` - รีเซ็ต timer
- `S` - ข้าม phase
- `F` - เปิด/ปิด focus mode
- `M` - เปิด/ปิด mini timer
- `?` - แสดง help

## Installation

```bash
bun install @wrikka/pomodoro
```

## Usage

### Module Setup

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@wrikka/pomodoro'],
  pomodoro: {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false,
  }
})
```

### Using Components

```vue
<template>
  <WPomodoroContainer />
</template>
```

### Using Composables

```ts
import {
  useTimer,
  useSettings,
  useAudio,
  usePomodoroStats,
  useSoundscapes,
  useFocusMode,
  useMiniTimer
} from '#pomodoro'

const timer = useTimer()
const settings = useSettings()
const audio = useAudio()
const stats = usePomodoroStats()
```

### Individual Components

```vue
<template>
  <div class="pomodoro-timer">
    <WPomodoroTimer />
    <WPomodoroTimerControls />
    <WPomodoroStatusBadge />
  </div>

  <div class="stats">
    <WPomodoroStatsCard />
    <WPomodoroWeeklyChart />
  </div>

  <div class="extras">
    <WPomodoroSettingsPanel />
    <WPomodoroSoundscapePlayer />
    <WPomodoroFocusOverlay />
  </div>
</template>
```

## API

### Composables

#### `useTimer()`
- `timeLeft` - เวลาที่เหลือ (seconds)
- `totalTime` - เวลาทั้งหมด (seconds)
- `state` - สถานะ timer (idle/running/paused/completed)
- `phase` - phase ปัจจุบัน (work/shortBreak/longBreak)
- `formattedTime` - เวลาในรูปแบบ MM:SS
- `progress` - ความคืบหน้า (%)
- `start()`, `pause()`, `reset()`, `skipPhase()`, `nextPhase()`

#### `useSettings()`
- `settings` - การตั้งค่าทั้งหมด
- `updateSettings()`, `updateDurations()`, `updateAutoStart()`, `updateAudio()`
- `loadSettings()`, `resetToDefaults()`

#### `useAudio()`
- `playSound(name, volume)` - เล่นเสียง
- `playBeep(volume)` - เล่น beep
- `requestNotificationPermission()` - ขอสิทธิ์ notification
- `showNotification(title, body)` - แสดง notification

#### `usePomodoroStats()`
- `stats` - สถิติทั้งหมด
- `todayPomodoros` - จำนวน pomodoros วันนี้
- `todayFocusTime` - เวลาโฟกัสวันนี้ (นาที)
- `loadStats()`, `recordSession(pomodoros, focusTime)`

#### `useSoundscapes()`
- `soundscapes` - รายการ soundscape ทั้งหมด
- `currentSoundscape` - soundscape ที่กำลังเล่น
- `play(soundscape)`, `stop()`, `setVolume()`, `toggleMute()`

#### `useFocusMode()`
- `isFocusMode` - สถานะ focus mode
- `enableFocusMode()`, `disableFocusMode()`, `toggleFocusMode()`

#### `useMiniTimer()`
- `isMini` - สถานะ mini timer
- `toggleMini()`, `enableMini()`, `disableMini()`

## Development

```bash
cd plugins/nuxt-modules/pomodoro
bun install
bun run dev
```

## License

MIT
