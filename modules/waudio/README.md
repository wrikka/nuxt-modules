# waudio

Audio Editor Module for Nuxt - Waveform editing with effects and mixing

## Features

- **Waveform Editor**: Visual audio editing with interactive waveform
- **Multi-Track Mixing**: Mix multiple tracks with real-time preview
- **Audio Effects**: Reverb, EQ, compression, noise reduction
- **Noise Reduction**: AI-powered noise removal
- **Time Stretch**: Change tempo without affecting pitch
- **Pitch Shifting**: Change key without changing speed
- **Stem Separation**: Separate vocals, drums, bass, instruments
- **MIDI Support**: Edit MIDI tracks alongside audio

## Installation

```bash
bun add @wrikka/waudio
```

## Usage

Add to your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ['@wrikka/waudio']
})
```

## Components

- `WWaveformEditor` - Interactive waveform editor
- `WAudioMixer` - Multi-track mixing panel
- `WAudioEffects` - Effects and filters panel
- `WAudioExport` - Export settings

## Composables

- `useAudioEditor()` - Main audio editor state
- `useAudioEffects()` - Apply and manage effects
- `useWaveform()` - Waveform visualization
- `useAudioExport()` - Export functionality

## License

MIT
