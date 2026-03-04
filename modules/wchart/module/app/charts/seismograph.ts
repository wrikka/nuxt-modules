import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Seismograph Chart - Earthquake/vibration waveform visualization
 */

/**
 * Generate seismograph data
 */
export function generateSeismographData(
  samples: number[],
  sampleRate: number, // samples per second
  options: {
    title?: string;
    gain?: number;
    triggerLevel?: number;
    color?: string;
  } = {},
): ChartData {
  const { title, gain = 1, triggerLevel = 0.5, color = '#ff4444' } = options;

  // Apply gain
  const scaledSamples = samples.map((s) => s * gain);

  const timeStep = 1000 / sampleRate; // milliseconds

  const data: DataPoint[] = scaledSamples.map((sample, index) => ({
    x: index * timeStep,
    y: sample,
    isTrigger: Math.abs(sample) > triggerLevel,
    index,
  }));

  return {
    title,
    series: [
      {
        name: 'Seismic Wave',
        data,
        type: 'line',
        color,
        layout: {
          sampleRate,
          triggerLevel,
          maxAmplitude: Math.max(...scaledSamples.map(Math.abs)),
        },
      },
    ],
  };
}

/**
 * Calculate seismic statistics
 */
export function calculateSeismicStats(
  samples: number[],
  sampleRate: number,
): {
  peakAmplitude: number;
  rms: number;
  dominantFrequency: number;
  duration: number;
  events: number;
} {
  const peakAmplitude = Math.max(...samples.map(Math.abs));

  // RMS (Root Mean Square)
  const sumSquares = samples.reduce((sum, s) => sum + s * s, 0);
  const rms = Math.sqrt(sumSquares / samples.length);

  // Simple zero-crossing frequency estimation
  let zeroCrossings = 0;
  for (let i = 1; i < samples.length; i++) {
    if ((samples[i - 1] ?? 0) * (samples[i] ?? 0) < 0) {
      zeroCrossings++;
    }
  }
  const duration = samples.length / sampleRate;
  const dominantFrequency = zeroCrossings / 2 / duration;

  // Count significant events
  const threshold = rms * 3;
  let events = 0;
  let inEvent = false;
  for (const sample of samples) {
    if (Math.abs(sample) > threshold && !inEvent) {
      events++;
      inEvent = true;
    } else if (Math.abs(sample) < threshold * 0.5) {
      inEvent = false;
    }
  }

  return {
    peakAmplitude,
    rms,
    dominantFrequency,
    duration,
    events,
  };
}

/**
 * Detect P and S wave arrivals
 */
export function detectWaveArrivals(
  samples: number[],
  sampleRate: number,
  noiseThreshold: number = 0.1,
): {
  pWave?: number;
  sWave?: number;
  magnitude: number;
} {
  // STA/LTA algorithm (Short Term Average / Long Term Average)
  const staWindow = Math.floor(sampleRate * 0.5); // 0.5 second
  const ltaWindow = Math.floor(sampleRate * 5); // 5 seconds

  const sta: number[] = [];
  const lta: number[] = [];

  for (let i = ltaWindow; i < samples.length; i++) {
    const staSum = samples.slice(i - staWindow, i).reduce((sum, s) => sum + Math.abs(s), 0) / staWindow;
    const ltaSum = samples.slice(i - ltaWindow, i).reduce((sum, s) => sum + Math.abs(s), 0) / ltaWindow;

    sta.push(staSum);
    lta.push(ltaSum);
  }

  // Find where STA/LTA ratio exceeds threshold
  const ratioThreshold = 3;
  let pWave: number | undefined;
  let sWave: number | undefined;

  for (let i = 0; i < sta.length; i++) {
    const ratio = (lta[i] ?? noiseThreshold) > 0 ? (sta[i] ?? 0) / (lta[i] ?? noiseThreshold) : 0;

    if (ratio > ratioThreshold && !pWave) {
      pWave = (i + ltaWindow) / sampleRate;
    } else if (ratio > ratioThreshold * 0.7 && pWave && !sWave && (i + ltaWindow) / sampleRate > pWave + 1) {
      sWave = (i + ltaWindow) / sampleRate;
      break;
    }
  }

  // Estimate magnitude from peak amplitude
  const peakAmp = Math.max(...samples.map(Math.abs));
  const magnitude = Math.log10(peakAmp) + 3;

  return { pWave, sWave, magnitude };
}

/**
 * Filter seismic signal
 */
export function filterSeismicSignal(
  samples: number[],
  type: 'lowpass' | 'highpass' | 'bandpass',
  cutoff: number, // Hz
  sampleRate: number,
): number[] {
  const rc = 1 / (2 * Math.PI * cutoff);
  const dt = 1 / sampleRate;
  const alpha = dt / (rc + dt);

  const filtered: number[] = [];
  let prev = samples[0] ?? 0;

  for (const sample of samples) {
    if (type === 'lowpass') {
      prev = prev + alpha * (sample - prev);
      filtered.push(prev);
    } else if (type === 'highpass') {
      prev = alpha * (prev + sample - (samples[filtered.length - 1] ?? sample));
      filtered.push(sample - prev);
    } else {
      filtered.push(sample); // Bandpass not implemented
    }
  }

  return filtered;
}

/**
 * Generate synthetic seismic data
 */
export function generateSyntheticSeismic(
  duration: number, // seconds
  sampleRate: number,
  events: Array<{
    time: number;
    magnitude: number;
    frequency: number;
  }>,
): number[] {
  const numSamples = duration * sampleRate;
  const samples: number[] = [];

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let value = (Math.random() - 0.5) * 0.02; // Background noise

    // Add events
    for (const event of events) {
      const dt = t - event.time;
      if (dt > 0 && dt < 10) {
        const decay = Math.exp(-dt * 2);
        value += Math.sin(2 * Math.PI * event.frequency * dt) * event.magnitude * decay;
      }
    }

    samples.push(value);
  }

  return samples;
}
