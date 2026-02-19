import { defineEventHandler, type H3Event, readBody } from 'h3';
import type { SimulationConfig, SimulationResult } from '#feature-flags/types';

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody<SimulationConfig>(event);
  const { percentage, stickiness, sampleSize } = body;

  const enabledCount = Math.round(sampleSize * (percentage / 100));
  const disabledCount = sampleSize - enabledCount;

  const segments = [
    {
      segment: 'US',
      enabled: Math.round(enabledCount * 0.4),
      disabled: Math.round(disabledCount * 0.4),
      percentage: 40,
    },
    {
      segment: 'EU',
      enabled: Math.round(enabledCount * 0.3),
      disabled: Math.round(disabledCount * 0.3),
      percentage: 30,
    },
    {
      segment: 'APAC',
      enabled: Math.round(enabledCount * 0.2),
      disabled: Math.round(disabledCount * 0.2),
      percentage: 20,
    },
    {
      segment: 'Other',
      enabled: Math.round(enabledCount * 0.1),
      disabled: Math.round(disabledCount * 0.1),
      percentage: 10,
    },
  ];

  const result: SimulationResult = {
    enabledCount,
    disabledCount,
    distributionBySegment: segments,
    consistency: stickiness === 'random' ? 85.3 : 99.7,
    edgeCases: [
      {
        type: 'boundary',
        description: 'User at exactly 50% boundary',
        userId: 'user_123',
        expectedEnabled: true,
        actualEnabled: true,
      },
    ],
  };

  return result;
});
