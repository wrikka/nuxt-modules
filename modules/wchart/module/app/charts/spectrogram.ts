import type { ChartData, ChartSeries, DataPoint } from '@/module/app/types/chart-basic';
import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Spectrogram - Time-frequency visualization
 */

/**
 * Generate spectrogram data using FFT
 */
export function generateSpectrogramData(
  signal: number[],
  sampleRate: number,
  options: {
    title?: string;
    windowSize?: number;
    hopSize?: number;
    minFreq?: number;
    maxFreq?: number;
    colorScheme?: string[];
  } = {},
): ChartData {
  const {
    title,
    windowSize = 256,
    hopSize = 128,
    minFreq = 0,
    maxFreq = sampleRate / 2,
    colorScheme,
  } = options;

  const series: ChartSeries[] = [];
  const numWindows = Math.floor((signal.length - windowSize) / hopSize);

  // Calculate frequency resolution
  const freqResolution = sampleRate / windowSize;
  const minBin = Math.floor(minFreq / freqResolution);
  const maxBin = Math.min(Math.floor(maxFreq / freqResolution), windowSize / 2);

  for (let w = 0; w < numWindows; w++) {
    const start = w * hopSize;
    const window = signal.slice(start, start + windowSize);

    // Apply Hann window
    const hannWindow = window.map((s, i) =>
      s * 0.5 * (1 - Math.cos((2 * Math.PI * i) / (windowSize - 1))),
    );

    // Compute FFT (simplified)
    const spectrum = computeFFT(hannWindow);
    const magnitudes = spectrum.slice(minBin, maxBin).map((c) =>
      Math.sqrt(c.real * c.real + c.imag * c.imag),
    );

    // Convert to dB
    const dbValues = magnitudes.map((m) => 20 * Math.log10(m + 1e-10));
    const maxDb = Math.max(...dbValues);

    const data: DataPoint[] = dbValues.map((db, freqBin) => {
      const freq = (minBin + freqBin) * freqResolution;
      const normalized = (db - (maxDb - 80)) / 80; // Normalize to 0-1 over 80dB range
      const colorIndex = Math.floor(Math.max(0, Math.min(1, normalized)) * ((colorScheme?.length || 10) - 1));

      return {
        x: start / sampleRate, // time in seconds
        y: freq,
        magnitude: db,
        color: colorScheme?.[colorIndex] || getSpectrogramColor(normalized),
      };
    });

    series.push({
      name: `Frame ${w}`,
      data,
      type: 'spectrogram',
      color: '#000',
    });
  }

  return {
    title: title || 'Spectrogram',
    series,
  };
}

/**
 * Compute simplified FFT
 */
function computeFFT(signal: number[]): Array<{ real: number; imag: number }> {
  const n = signal.length;
  const result: Array<{ real: number; imag: number }> = [];

  for (let k = 0; k < n / 2; k++) {
    let real = 0;
    let imag = 0;

    for (let t = 0; t < n; t++) {
      const angle = (-2 * Math.PI * k * t) / n;
      real += (signal[t] ?? 0) * Math.cos(angle);
      imag += (signal[t] ?? 0) * Math.sin(angle);
    }

    result.push({ real: real / n, imag: imag / n });
  }

  return result;
}

/**
 * Get spectrogram color
 */
function getSpectrogramColor(t: number): string {
  // Black -> blue -> cyan -> green -> yellow -> red -> white
  if (t < 0.17) return `rgb(0, 0, ${Math.round(255 * t * 6)})`;
  if (t < 0.33) return `rgb(0, ${Math.round(255 * (t - 0.17) * 6)}, 255)`;
  if (t < 0.5) return `rgb(${Math.round(255 * (t - 0.33) * 6)}, 255, ${Math.round(255 * (1 - (t - 0.33) * 6))})`;
  if (t < 0.67) return `rgb(255, ${Math.round(255 * (1 - (t - 0.5) * 6))}, 0)`;
  if (t < 0.83) return `rgb(255, ${Math.round(255 * (t - 0.67) * 6)}, ${Math.round(255 * (t - 0.67) * 6)})`;
  return `rgb(255, 255, ${Math.round(255 * (t - 0.83) * 6)})`;
}

/**
 * Find peaks in spectrogram
 */
export function findSpectrogramPeaks(
  data: ChartData,
  threshold: number = -40, // dB
): Array<{
  time: number;
  frequency: number;
  magnitude: number;
}> {
  const peaks: Array<{ time: number; frequency: number; magnitude: number }> = [];

  data.series.forEach((series) => {
    series.data.forEach((point) => {
      const mag = (point.magnitude as number) || 0;
      if (mag > threshold) {
        peaks.push({
          time: point.x as number,
          frequency: point.y as number,
          magnitude: mag,
        });
      }
    });
  });

  return peaks.sort((a, b) => b.magnitude - a.magnitude);
}

/**
 * Extract frequency band energy
 */
export function extractBandEnergy(
  data: ChartData,
  bands: Array<{ name: string; min: number; max: number }>,
): Array<{
  name: string;
  energy: number;
  dominance: number;
}> {
  const bandEnergies = bands.map((band) => {
    let totalEnergy = 0;
    let count = 0;

    data.series.forEach((series) => {
      series.data.forEach((point) => {
        const freq = point.y as number;
        if (freq >= band.min && freq <= band.max) {
          totalEnergy += Math.pow(10, ((point.magnitude as number) || 0) / 20);
          count++;
        }
      });
    });

    return {
      name: band.name,
      energy: count > 0 ? totalEnergy / count : 0,
    };
  });

  const maxEnergy = Math.max(...bandEnergies.map((b) => b.energy));

  return bandEnergies.map((band) => ({
    ...band,
    dominance: maxEnergy > 0 ? band.energy / maxEnergy : 0,
  }));
}

/**
 * Common frequency bands
 */
export const frequencyBands = {
  delta: { name: 'Delta', min: 0.5, max: 4 }, // EEG: deep sleep
  theta: { name: 'Theta', min: 4, max: 8 }, // EEG: meditation
  alpha: { name: 'Alpha', min: 8, max: 13 }, // EEG: relaxed
  beta: { name: 'Beta', min: 13, max: 30 }, // EEG: active
  gamma: { name: 'Gamma', min: 30, max: 100 }, // EEG: cognitive
  subBass: { name: 'Sub Bass', min: 20, max: 60 }, // Audio
  bass: { name: 'Bass', min: 60, max: 250 },
  lowMid: { name: 'Low Mid', min: 250, max: 500 },
  mid: { name: 'Mid', min: 500, max: 2000 },
  highMid: { name: 'High Mid', min: 2000, max: 4000 },
  presence: { name: 'Presence', min: 4000, max: 6000 },
  brilliance: { name: 'Brilliance', min: 6000, max: 20000 },
};
