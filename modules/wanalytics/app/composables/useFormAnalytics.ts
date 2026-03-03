import { computed, onMounted, onUnmounted, ref } from 'vue';
import type { FormAnalytics, FormAnalyticsConfig, FormInsight, FormMetrics, FormSession } from '#analytics/types';
import { useAnalyticsConfig } from './useAnalyticsConfig';

export const useFormAnalytics = () => {
  const formConfig = useAnalyticsConfig().formAnalytics as FormAnalyticsConfig;

  const formAnalytics = ref<Map<string, FormAnalytics>>(new Map());
  const activeSessions = ref<Map<string, FormSession>>(new Map());
  const isTracking = ref(false);

  const isEnabled = computed(() => formConfig.enabled);

  const startTracking = () => {
    if (!isEnabled.value || isTracking.value) return;

    isTracking.value = true;

    if (formConfig.trackAllForms) {
      document.querySelectorAll('form').forEach(el => trackForm(el as HTMLFormElement));
    } else {
      formConfig.formsToTrack.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => trackForm(el as HTMLFormElement));
      });
    }
  };

  const stopTracking = () => {
    isTracking.value = false;
  };

  const trackForm = (form: HTMLFormElement) => {
    const formId = form.id || form.name || crypto.randomUUID();
    void formId; // Used for tracking

    // Track form focus (start)
    form.addEventListener('focusin', e => handleFieldFocus(formId, e as FocusEvent));

    // Track field changes
    form.addEventListener('input', e => handleFieldInput(formId, e as InputEvent));

    // Track form submission
    form.addEventListener('submit', e => handleFormSubmit(formId, e as SubmitEvent));

    // Track form abandonment
    form.addEventListener('focusout', e => handleFieldBlur(formId, e as FocusEvent));

    // Initialize form session
    startFormSession(formId);
  };

  const startFormSession = (formId: string) => {
    const session: FormSession = {
      sessionId: crypto.randomUUID(),
      formId,
      startTime: new Date(),
      completed: false,
      fields: [],
      totalTime: 0,
    };

    activeSessions.value.set(formId, session);
  };

  const handleFieldFocus = (formId: string, e: FocusEvent) => {
    const target = e.target as HTMLInputElement;
    if (!target.name) return;

    const session = activeSessions.value.get(formId);
    if (!session) return;

    const existingField = session.fields.find(f => f.name === target.name);

    if (!existingField) {
      session.fields.push({
        name: target.name,
        firstInteraction: new Date(),
        lastInteraction: new Date(),
        timeSpent: 0,
        corrections: 0,
        error: false,
        autofilled: target.autocomplete !== '',
      });
    } else {
      existingField.lastInteraction = new Date();
    }
  };

  const handleFieldInput = (formId: string, e: InputEvent) => {
    const target = e.target as HTMLInputElement;
    if (!target.name) return;

    const session = activeSessions.value.get(formId);
    if (!session) return;

    const field = session.fields.find(f => f.name === target.name);
    if (!field) return;

    // Track corrections
    if (formConfig.trackCorrections) {
      field.corrections++;
    }

    // Update time
    field.lastInteraction = new Date();
    field.timeSpent = field.lastInteraction.getTime() - field.firstInteraction.getTime();
  };

  const handleFieldBlur = (_formId: string, e: FocusEvent) => {
    const target = e.target as HTMLInputElement;
    if (!target.name) return;

    // Check for abandonment
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!relatedTarget || !relatedTarget.closest('form')) {
      // User left the form
    }
  };

  const handleFormSubmit = (formId: string, _e: SubmitEvent) => {
    const session = activeSessions.value.get(formId);
    if (!session) return;

    session.endTime = new Date();
    session.completed = true;
    session.totalTime = session.endTime.getTime() - session.startTime.getTime();

    // Update form analytics
    updateFormAnalytics(formId, session);
  };

  const updateFormAnalytics = (formId: string, session: FormSession) => {
    let analytics = formAnalytics.value.get(formId);

    if (!analytics) {
      analytics = {
        id: crypto.randomUUID(),
        formId,
        formName: formId,
        url: window.location.href,
        period: { start: new Date(), end: new Date() },
        metrics: createEmptyMetrics(),
        fields: [],
        insights: [],
      };
    }

    // Update metrics
    analytics.metrics.submissions++;
    if (session.completed) {
      analytics.metrics.successes++;
    }

    // Update field analytics
    session.fields.forEach(fieldSession => {
      let field = analytics!.fields.find(f => f.name === fieldSession.name);

      if (!field) {
        field = {
          name: fieldSession.name,
          type: 'text',
          order: analytics!.fields.length,
          interactions: 0,
          fills: 0,
          empties: 0,
          errors: 0,
          corrections: 0,
          avgTimeToFill: 0,
          dropOffRate: 0,
          errorRate: 0,
          autofillRate: 0,
        };
        analytics!.fields.push(field);
      }

      field.interactions++;
      field.fills++;
      field.corrections += fieldSession.corrections;

      if (fieldSession.autofilled) {
        field.autofillRate = (field.autofillRate * (field.interactions - 1) + 1) / field.interactions;
      }

      field.avgTimeToFill = (field.avgTimeToFill * (field.interactions - 1) + fieldSession.timeSpent)
        / field.interactions;
    });

    // Calculate rates
    analytics.metrics.completionRate = (analytics.metrics.successes / analytics.metrics.submissions) * 100;
    analytics.metrics.avgCompletionTime = session.totalTime;

    formAnalytics.value.set(formId, analytics);
  };

  const createEmptyMetrics = (): FormMetrics => ({
    impressions: 0,
    starts: 0,
    submissions: 0,
    successes: 0,
    errors: 0,
    abandonments: 0,
    startRate: 0,
    completionRate: 0,
    abandonmentRate: 0,
    avgCompletionTime: 0,
    avgFieldsFilled: 0,
  });

  const getFormAnalytics = (formId: string): FormAnalytics | undefined => {
    return formAnalytics.value.get(formId);
  };

  const getInsights = (formId: string): FormInsight[] => {
    const analytics = formAnalytics.value.get(formId);
    if (!analytics) return [];

    const insights: FormInsight[] = [];

    // Check for high drop-off fields
    analytics.fields.forEach(field => {
      if (field.dropOffRate > 30) {
        insights.push({
          type: 'high_drop_off',
          field: field.name,
          description: `Field "${field.name}" has ${field.dropOffRate.toFixed(1)}% drop-off rate`,
          impact: 'high',
          recommendation: 'Consider making this field optional or simplifying the input',
        });
      }

      if (field.avgTimeToFill > 30000) {
        insights.push({
          type: 'slow_field',
          field: field.name,
          description: `Users spend ${Math.round(field.avgTimeToFill / 1000)}s on field "${field.name}"`,
          impact: 'medium',
          recommendation: 'Consider adding help text or simplifying the field',
        });
      }

      if (field.errorRate > 10) {
        insights.push({
          type: 'high_error_rate',
          field: field.name,
          description: `Field "${field.name}" has ${field.errorRate.toFixed(1)}% error rate`,
          impact: 'high',
          recommendation: 'Improve validation messages or input format hints',
        });
      }
    });

    return insights;
  };

  onMounted(() => {
    startTracking();
  });

  onUnmounted(() => {
    stopTracking();
  });

  return {
    formAnalytics,
    activeSessions,
    isTracking,
    isEnabled,
    startTracking,
    stopTracking,
    getFormAnalytics,
    getInsights,
  };
};
