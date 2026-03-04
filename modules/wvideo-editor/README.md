# wvideo-editor

Professional Video Editor Module for Nuxt - Multi-track timeline editing with effects, transitions, and export capabilities

## Features

### Core Editing
- **Multi-Track Timeline**: Non-destructive editing with unlimited tracks
- **Video Trimming**: Trim videos with visual timeline editor
- **Keyframe Animation**: Animate any property over time
- **Motion Tracking**: Track objects and attach effects

### Effects & Enhancements
- **Video Effects**: Filters, transitions, color grading
- **Color Correction**: Curves, LUTs, color wheels
- **Chroma Key**: Real-time green screen removal
- **Speed Ramping**: Variable speed control with curves
- **Audio Effects**: EQ, compressor, reverb, chorus, delay

### Export & Management
- **Export Options**: Export to MP4, WebM, MOV, GIF formats
- **Batch Export**: Export multiple recordings at once
- **Quality Presets**: YouTube, Social Media, Web, Archive presets
- **Custom Settings**: Resolution, frame rate, quality controls
- **Recording Management**: Organize, preview, and manage recordings
- **Progress Tracking**: Real-time export progress indicator

### Advanced Features
- **Screen Recording**: Built-in screen capture
- **Captions Editor**: Add and edit subtitles
- **Collaboration**: Multi-user editing support
- **Plugin System**: Extensible with plugins
- **Proxy Media**: Low-res proxies for smooth editing
- **Scene Detection**: Auto-detect scene changes

## Installation

```bash
bun add @wrikka/wvideo-editor
```

## Usage

Add to your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['@wrikka/wvideo-editor']
})
```

## Components

### Main Components
- `VideoEditor` - Main video editor interface
- `VideoTimeline` - Multi-track timeline editor
- `VideoPlayer` - Video preview player
- `VideoTrimEditor` - Video trimming dialog

### Export Components
- `VideoExportDialog` - Export settings dialog
- `VideoBatchExport` - Batch export multiple videos
- `ExportPanel` - Full export panel with presets

### Effects Components
- `VideoEffectsPanel` - Effects and filters
- `ColorGradingEditor` - Professional color grading
- `ChromaKeyPanel` - Green screen removal
- `SpeedRamping` - Variable speed control
- `AudioEffectsPanel` - Audio effects and mixing
- `AudioMixerPanel` - Multi-track audio mixing

### Recording Components
- `ScreenRecordPanel` - Screen recording interface
- `ScreenRecorder` - Screen capture component
- `VideoRecordingsList` - List of recordings with actions

### Additional Panels
- `CaptionsEditor` - Subtitle editor
- `MarkersPanel` - Timeline markers
- `HistoryPanel` - Undo/redo history
- `MediaBin` - Media asset management
- `CollaborationPanel` - Multi-user editing

## Composables

### Core Composables
- `useVideoEditor()` - Video editor state and actions
- `useVideoExport()` - Export functionality with progress
- `useVideoPreview()` - Video preview controls
- `useVideoTrim()` - Video trimming operations

### Timeline & Animation
- `useTimelineDragDrop()` - Drag and drop handling
- `useKeyframeAnimation()` - Animation controls
- `useClipOperations()` - Clip operations (split, merge, delete)
- `useTimelineHistory()` - Undo/redo management

### Effects & Features
- `useVideoEffects()` - Video effects and filters
- `useMarkers()` - Timeline markers
- `useMediaAssets()` - Media asset management

## Integration with wrecorder

```vue
<script setup>
const { recordings } = useVideoRecording()
const editor = useVideoEditor()

// Add recordings from wrecorder
onMounted(() => {
  recordings.value.forEach(r => editor.addRecording(r))
})
</script>

<template>
  <VideoEditor :recordings="editor.recordings.value" />
</template>
```

## Browser Support

- Chrome 90+
- Edge 90+
- Firefox 88+
- Safari 14.1+

## License

MIT
