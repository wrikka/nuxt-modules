import { defineEventHandler, type H3Event, readBody } from 'h3';
import type { OnboardingServerState } from '../state';

declare global {
  var onboardingState: OnboardingServerState;
}

export default defineEventHandler(async (event: H3Event) => {
  const body = await readBody<{ stepId: string; }>(event);
  const { stepId } = body;

  const step = globalThis.onboardingState.steps.find(s => s.id === stepId);
  if (step) {
    step.skipped = true;
    step.skippedAt = new Date();
  }

  globalThis.onboardingState.progress.skippedSteps.push(stepId);

  return { success: true };
});
