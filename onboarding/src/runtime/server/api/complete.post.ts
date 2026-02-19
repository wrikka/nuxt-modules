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
    step.completed = true;
    step.completedAt = new Date();
  }

  globalThis.onboardingState.progress.completedSteps.push(stepId);

  const totalSteps = globalThis.onboardingState.steps.length;
  const completedSteps = globalThis.onboardingState.steps.filter(s => s.completed).length;
  globalThis.onboardingState.progress.percentage = Math.round((completedSteps / totalSteps) * 100);

  if (completedSteps === totalSteps) {
    globalThis.onboardingState.progress.completed = true;
    globalThis.onboardingState.progress.completedAt = new Date();
  }

  return { success: true };
});
