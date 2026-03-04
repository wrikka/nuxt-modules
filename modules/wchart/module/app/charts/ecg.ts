import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * ECG Chart - Electrocardiogram visualization
 */

/**
 * Generate ECG chart data
 */
export function generateECGData(
  samples: number[],
  sampleRate: number, // Hz
  options: {
    title?: string;
    gain?: number;
    leadName?: string;
    color?: string;
  } = {},
): ChartData {
  const { title, gain = 1, leadName = 'Lead II', color = '#00aa00' } = options;

  const timeStep = 1000 / sampleRate; // ms per sample

  const data: DataPoint[] = samples.map((sample, index) => ({
    x: index * timeStep,
    y: sample * gain,
    index,
  }));

  return {
    title: title || `ECG - ${leadName}`,
    series: [
      {
        name: leadName,
        data,
        type: 'line',
        color,
        layout: {
          sampleRate,
          gain,
          leadName,
        },
      },
    ],
  };
}

/**
 * Detect ECG features (QRS complex, P wave, T wave)
 */
export function detectECGFeatures(
  samples: number[],
  sampleRate: number,
): Array<{
  type: 'P' | 'Q' | 'R' | 'S' | 'T';
  index: number;
  time: number;
  amplitude: number;
}> {
  const features: Array<{ type: 'P' | 'Q' | 'R' | 'S' | 'T'; index: number; time: number; amplitude: number }> = [];

  // Find R peaks (local maxima above threshold)
  const threshold = Math.max(...samples.map(Math.abs)) * 0.5;

  for (let i = 2; i < samples.length - 2; i++) {
    const prev2 = samples[i - 2] ?? 0;
    const prev1 = samples[i - 1] ?? 0;
    const curr = samples[i] ?? 0;
    const next1 = samples[i + 1] ?? 0;
    const next2 = samples[i + 2] ?? 0;

    // R peak detection
    if (curr > threshold && curr > prev1 && curr > prev2 && curr > next1 && curr > next2) {
      features.push({
        type: 'R',
        index: i,
        time: i / sampleRate,
        amplitude: curr,
      });

      // Look for Q before R (local minimum)
      for (let j = i - 1; j >= Math.max(0, i - 10); j--) {
        const val = samples[j] ?? 0;
        const prev = samples[j - 1] ?? 0;
        if (val < prev && val < (samples[j + 1] ?? 0) && val < 0) {
          features.push({
            type: 'Q',
            index: j,
            time: j / sampleRate,
            amplitude: val,
          });
          break;
        }
      }

      // Look for S after R (local minimum)
      for (let j = i + 1; j <= Math.min(samples.length - 1, i + 10); j++) {
        const val = samples[j] ?? 0;
        const prev = samples[j - 1] ?? 0;
        if (val < prev && val < (samples[j + 1] ?? 0) && val < 0) {
          features.push({
            type: 'S',
            index: j,
            time: j / sampleRate,
            amplitude: val,
          });
          break;
        }
      }
    }
  }

  // Sort by index
  features.sort((a, b) => a.index - b.index);

  return features;
}

/**
 * Calculate heart rate from ECG
 */
export function calculateHeartRate(
  features: Array<{ type: 'P' | 'Q' | 'R' | 'S' | 'T'; index: number; time: number; amplitude: number }>,
  sampleRate: number,
): {
  bpm: number;
  variability: number;
  intervals: number[];
} {
  const rPeaks = features.filter((f) => f.type === 'R');

  if (rPeaks.length < 2) {
    return { bpm: 0, variability: 0, intervals: [] };
  }

  // Calculate RR intervals in seconds
  const intervals = rPeaks.slice(1).map((peak, i) => peak.time - (rPeaks[i]?.time || 0));

  // Average heart rate
  const avgInterval = intervals.reduce((sum, v) => sum + v, 0) / intervals.length;
  const bpm = 60 / avgInterval;

  // Heart rate variability (standard deviation of intervals)
  const mean = avgInterval;
  const variance = intervals.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / intervals.length;
  const variability = Math.sqrt(variance);

  return { bpm, variability, intervals };
}

/**
 * Generate synthetic ECG data
 */
export function generateSyntheticECG(
  duration: number, // seconds
  sampleRate: number,
  heartRate: number = 60, // bpm
  noise: number = 0.01,
): number[] {
  const numSamples = Math.floor(duration * sampleRate);
  const samples: number[] = [];

  const rrInterval = 60 / heartRate; // seconds per beat
  const samplesPerBeat = Math.floor(rrInterval * sampleRate);

  for (let i = 0; i < numSamples; i++) {
    const t = (i % samplesPerBeat) / sampleRate; // time within beat
    const beatPhase = (i % samplesPerBeat) / samplesPerBeat;

    let value = (Math.random() - 0.5) * noise; // Baseline noise

    // P wave (atrial depolarization)
    if (beatPhase > 0.1 && beatPhase < 0.2) {
      value += 0.1 * Math.sin(Math.PI * (beatPhase - 0.1) / 0.1);
    }

    // QRS complex (ventricular depolarization)
    if (beatPhase > 0.3 && beatPhase < 0.4) {
      if (beatPhase < 0.33) {
        value -= 0.1; // Q
      } else if (beatPhase < 0.36) {
        value += 1.0; // R
      } else {
        value -= 0.2; // S
      }
    }

    // T wave (ventricular repolarization)
    if (beatPhase > 0.5 && beatPhase < 0.7) {
      value += 0.2 * Math.sin(Math.PI * (beatPhase - 0.5) / 0.2);
    }

    samples.push(value);
  }

  return samples;
}
