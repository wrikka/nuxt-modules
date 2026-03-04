# wrecorder

Recording Studio Module for Nuxt - Screen, webcam, and audio recording with advanced features

## Features

### Core Recording
- **Screen Recording**: Record screen with high quality (up to 4K)
- **Webcam Recording**: Record from webcam with HD support
- **Audio Recording**: Record from microphone and system audio
- **Multi-source Recording**: Record screen + webcam + audio simultaneously

### Screen Capture
- **Screenshot**: Capture full screen, window, or region
- **GIF Recording**: Record short animated GIFs with configurable FPS
- **Webcam Picture-in-Picture**: Overlay webcam on screen recording with draggable positioning

### Real-time Enhancements
- **Annotations**: Draw text, shapes, arrows, and freehand on screen while recording
- **Noise Suppression**: AI-powered audio noise reduction with Web Audio API filters
- **Virtual Background**: AI-powered background replacement for webcam
- **Teleprompter**: Read script while recording with auto-scroll

### Advanced Features
- **Live Streaming**: Stream to YouTube, Twitch
- **Auto-save Recovery**: Recover recordings after browser crash
- **Cloud Upload**: Upload to S3, YouTube, Google Drive
- **Export Formats**: MP4, WebM, MOV, GIF

### 24 New Features (v0.0.2)

#### 🔴 High Priority
- **AI Transcription**: Real-time speech-to-text with Web Speech API
- **Recording Scheduler**: Schedule automatic recordings (daily/weekly/monthly)
- **Multi-track Editing**: Independent video/audio/screen/webcam track editing
- **Global Keyboard Shortcuts**: Customizable shortcuts (Ctrl+R start, Ctrl+S stop, etc.)
- **Watermark Support**: Text/image watermarks with position and style options

#### 🟡 Medium Priority
- **Chapter Markers**: Add bookmarks during recording with VTT export
- **Green Screen**: Chroma key background replacement
- **Recording Presets**: Save/load recording settings templates
- **Auto-trim Silence**: Automatically remove silent audio segments
- **Cursor Highlight**: Visual cursor effects during screen recording
- **Zoom & Pan**: Zoom in/out while recording
- **Webhook Integration**: Send recording events to external webhooks
- **Collaboration**: Multi-user simultaneous recording
- **Analytics Dashboard**: Recording statistics and insights
- **Custom Stickers/Emoji**: Add emoji/image/text overlays

#### 🟢 Low Priority
- **Video Reactions**: Viewer reactions during live streams
- **Screen Magnifier**: Magnify screen areas while recording
- **Custom Cursor**: Change cursor styles (circle, ring, spotlight, pointer)
- **Countdown Timer**: Pre-recording countdown
- **Auto-upload**: Automatic upload to configured providers
- **Browser Extension**: Chrome extension for quick recording
- **Mobile Support**: Optimized recording on mobile devices
- **4K/8K Support**: High-resolution recording with auto-detection
- **Subtitle Export**: SRT/VTT/ASS subtitle generation and export

### Next Gen Features (v0.0.3) - Features 2-20

#### 🔴 High Priority
- **Real-time Translation**: แปลภาษา real-time ระหว่างบันทึก
- **Voice Cloning**: โคลนเสียงผู้พูดสำหรับ dubbing
- **Smart Scene Detection**: ตัด scene อัตโนมัติ
- **Eye Contact Correction**: แก้ไขสายตาให้มองกล้องเสมอ

#### 🟡 Medium Priority
- **AI Background Noise Removal**: ลบเสียงรบกวนหลังบันทึก AI
- **Video Summarization**: สรุปวิดีโอเป็น highlight reel
- **Auto-thumbnail**: สร้าง thumbnail อัตโนมัติ
- **Motion Tracking**: ติดตามวัตถุ/ใบหน้า
- **360° Recording**: บันทึกแบบ 360 องศา
- **HDR Support**: รองรับ HDR recording

#### 🟢 Low Priority
- **Face Retouching**: แต่งหน้า/หน้าเรียบอัตโนมัติ
- **Sound Effects Library**: ไลบรารี่เสียงเอฟเฟกต์
- **Video Templates**: Template สำเร็จรูป
- **Social Media Export**: Export ตามขนาดแต่ละ platform
- **Recording History**: ค้นหาและจัดการ recordings เก่า
- **Cloud Sync**: Sync การตั้งค่าข้าม devices
- **Offline Mode**: บันทึก offline แล้ว sync ทีหลัง
- **Keyboard Macro**: บันทึกและเล่น macro ซ้ำ
- **Video Comparison**: เปรียบเทียบ 2 เวอร์ชัน side-by-side

## Installation

```bash
bun add @wrikka/wrecorder
```

## Usage

Add to your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['@wrikka/wrecorder']
})
```

## Components

### Recording Components
- `WVideoRecorder` - Main video recorder
- `WScreenRecorder` - Screen recording component
- `WRecordingControls` - Recording controls
- `WRecordingSettings` - Settings panel
- `WRecordingPreview` - Recording preview

### Screen Capture Components
- `ScreenCaptureDialog` - Screenshot capture dialog (full screen, window, region)
- `GifRecorderDialog` - GIF recording with duration and quality settings
- `WebcamPIP` - Picture-in-Picture webcam overlay with drag support

### Enhancement Components
- `AnnotationsPanel` - Real-time annotation tools (pen, shapes, text, arrows)
- `NoiseSuppressionPanel` - Audio noise suppression with presets
- `VirtualBackground` - AI background replacement
- `Teleprompter` - Script reader with auto-scroll

## Composables

### Core Recording
- `useVideoRecording()` - Video recording state and controls
- `useScreenCapture()` - Screenshot capture (full, window, region)
- `useGifRecording()` - GIF recording with configurable FPS
- `usePictureInPicture()` - Webcam PIP overlay positioning
- `useAnnotations()` - Real-time drawing and annotations
- `useNoiseSuppression()` - Audio noise suppression with Web Audio API
- `useVirtualBackground()` - AI-powered background replacement
- `useRecordingExport()` - Export recordings in multiple formats

### 24 New Composables (v0.0.2)

#### 🔴 High Priority
- `useAITranscription()` - Real-time speech-to-text transcription
- `useRecordingScheduler()` - Schedule automatic recordings
- `useMultiTrackEditing()` - Multi-track timeline editing
- `useGlobalKeyboardShortcuts()` - Global keyboard shortcut management
- `useWatermark()` - Add watermarks to recordings

#### 🟡 Medium Priority
- `useChapterMarkers()` - Chapter/bookmark management with VTT export
- `useGreenScreen()` - Chroma key background replacement
- `useRecordingPresets()` - Recording settings templates
- `useAutoTrimSilence()` - Auto-remove silent audio segments
- `useCursorHighlight()` - Visual cursor highlight effects
- `useZoomPan()` - Zoom and pan during recording
- `useWebhookIntegration()` - Webhook event notifications
- `useCollaboration()` - Multi-user recording collaboration
- `useAnalytics()` - Recording statistics and analytics
- `useStickers()` - Add stickers/emojis/text overlays

#### 🟢 Low Priority
- `useVideoReactions()` - Viewer reaction system
- `useScreenMagnifier()` - Screen magnifier tool
- `useCustomCursor()` - Custom cursor styles
- `useCountdown()` - Pre-recording countdown timer
- `useAutoUpload()` - Automatic upload to cloud providers
- `useBrowserExtension()` - Browser extension integration
- `useMobileSupport()` - Mobile-optimized recording
- `useHighResSupport()` - 4K/8K resolution support
- `useSubtitleExport()` - Subtitle generation and export

### Next Gen Composables (v0.0.3) - Features 2-20

#### 🔴 High Priority
- `useRealtimeTranslation()` - แปลภาษา real-time ระหว่างบันทึก
- `useVoiceCloning()` - โคลนเสียงผู้พูดสำหรับ dubbing
- `useSmartSceneDetection()` - ตัด scene อัตโนมัติ
- `useEyeContactCorrection()` - แก้ไขสายตาให้มองกล้องเสมอ

#### 🟡 Medium Priority
- `useAINoiseRemoval()` - ลบเสียงรบกวนหลังบันทึก AI
- `useVideoSummarization()` - สรุปวิดีโอเป็น highlight reel
- `useAutoThumbnail()` - สร้าง thumbnail อัตโนมัติ
- `useMotionTracking()` - ติดตามวัตถุ/ใบหน้า
- `useThreeSixtyRecording()` - บันทึกแบบ 360 องศา
- `useHDRSupport()` - รองรับ HDR recording

#### 🟢 Low Priority
- `useFaceRetouching()` - แต่งหน้า/หน้าเรียบอัตโนมัติ
- `useSoundEffectsLibrary()` - ไลบรารี่เสียงเอฟเฟกต์
- `useVideoTemplates()` - Template สำเร็จรูป
- `useSocialMediaExport()` - Export ตามขนาดแต่ละ platform
- `useRecordingHistory()` - ค้นหาและจัดการ recordings เก่า
- `useCloudSync()` - Sync การตั้งค่าข้าม devices
- `useOfflineMode()` - บันทึก offline แล้ว sync ทีหลัง
- `useKeyboardMacro()` - บันทึกและเล่น macro ซ้ำ
- `useVideoComparison()` - เปรียบเทียบ 2 เวอร์ชัน side-by-side

## Example Usage

### Screen Capture (Screenshot)

```vue
<script setup>
const { isCapturing, captureFullScreen, downloadScreenshot } = useScreenCapture()

const takeScreenshot = async () => {
  const screenshot = await captureFullScreen({ format: 'image/png' })
  downloadScreenshot(screenshot, 'my-screenshot.png')
}
</script>
```

### GIF Recording

```vue
<script setup>
const { isRecording, startRecording, stopRecording, downloadGif } = useGifRecording()

const recordGif = async () => {
  await startRecording({ fps: 10, quality: 50 })
  const gif = await stopRecording()
  downloadGif(gif)
}
</script>
```

### Webcam Picture-in-Picture

```vue
<script setup>
const { state, activate } = usePictureInPicture({
  position: 'bottom-right',
  width: 200,
  height: 150
})

onMounted(() => activate())
</script>
```

### Audio Noise Suppression

```vue
<script setup>
const { state, initialize } = useNoiseSuppression({
  noiseLevel: 50,
  enhanceLevel: 30,
  autoGain: true
})

const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
const processedStream = await initialize(stream)
</script>
```

## Browser Support

- Chrome 90+
- Edge 90+
- Firefox 88+
- Safari 14.1+

## License

MIT
