import { computed, ref } from 'vue';
import type { FormField, FormValues } from '../types';

export interface ChatMessage {
  id: string;
  type: 'question' | 'answer' | 'typing' | 'welcome' | 'completion';
  content: string;
  field?: FormField;
  timestamp: Date;
  options?: string[];
}

export interface ChatbotState {
  messages: ChatMessage[];
  currentFieldIndex: number;
  isTyping: boolean;
  isComplete: boolean;
  progress: number;
}

export function useFormChatbot() {
  const state = ref<ChatbotState>({
    messages: [],
    currentFieldIndex: 0,
    isTyping: false,
    isComplete: false,
    progress: 0,
  });

  const visibleFields = ref<FormField[]>([]);
  const answers = ref<FormValues>({});

  // ========== Chat Flow ==========
  const startChat = (fields: FormField[], welcomeMessage?: string) => {
    visibleFields.value = fields.filter(f => f.type !== 'section' && f.type !== 'page_break');
    state.value.messages = [];
    state.value.currentFieldIndex = 0;
    state.value.isComplete = false;
    state.value.progress = 0;
    answers.value = {};

    // Add welcome message
    if (welcomeMessage) {
      addMessage({
        type: 'welcome',
        content: welcomeMessage,
      });
    }

    // Start with first question
    askCurrentQuestion();
  };

  const askCurrentQuestion = () => {
    const currentField = visibleFields.value[state.value.currentFieldIndex];
    if (!currentField) {
      completeChat();
      return;
    }

    // Show typing indicator
    state.value.isTyping = true;

    setTimeout(() => {
      state.value.isTyping = false;

      const options = getFieldOptions(currentField);

      addMessage({
        type: 'question',
        content: currentField.label,
        field: currentField,
        options,
      });
    }, 800);
  };

  const submitAnswer = (value: unknown) => {
    const currentField = visibleFields.value[state.value.currentFieldIndex];
    if (!currentField) return;

    // Store answer
    answers.value[currentField.id] = value;

    // Add answer to chat
    const displayValue = formatAnswerForDisplay(value, currentField);
    addMessage({
      type: 'answer',
      content: displayValue,
    });

    // Move to next question
    state.value.currentFieldIndex++;
    updateProgress();

    // Check if there are more questions
    if (state.value.currentFieldIndex < visibleFields.value.length) {
      askCurrentQuestion();
    } else {
      completeChat();
    }
  };

  const completeChat = () => {
    state.value.isComplete = true;
    state.value.progress = 100;

    addMessage({
      type: 'completion',
      content: 'Thank you for your responses! Your submission has been recorded.',
    });
  };

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    state.value.messages.push({
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    });
  };

  const updateProgress = () => {
    const total = visibleFields.value.length;
    const current = state.value.currentFieldIndex;
    state.value.progress = total > 0 ? Math.round((current / total) * 100) : 0;
  };

  // ========== Field Options Helpers ==========
  const getFieldOptions = (field: FormField): string[] | undefined => {
    if (field.options && field.options.length > 0) {
      return field.options.map(o => o.label);
    }
    return undefined;
  };

  const formatAnswerForDisplay = (value: unknown, field: FormField): string => {
    if (value === undefined || value === null) return 'No answer';

    if (Array.isArray(value)) {
      if (field.options) {
        const labels = value.map(v => {
          const option = field.options?.find(o => o.value === v);
          return option?.label ?? v;
        });
        return labels.join(', ');
      }
      return value.join(', ');
    }

    if (field.options) {
      const option = field.options.find(o => o.value === value);
      if (option) return option.label;
    }

    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    if (field.type === 'rating') {
      return `${value} ${field.settings?.ratingIcon === 'star' ? '⭐' : '👍'}`;
    }

    return String(value);
  };

  // ========== Navigation ==========
  const goBack = () => {
    if (state.value.currentFieldIndex > 0) {
      state.value.currentFieldIndex--;

      // Remove last question and answer
      const questionIndex = state.value.messages.findLastIndex(m => m.type === 'question');
      const answerIndex = state.value.messages.findLastIndex(m => m.type === 'answer');

      if (answerIndex > -1) {
        state.value.messages.splice(answerIndex, 1);
      }

      // Re-ask the question
      const currentField = visibleFields.value[state.value.currentFieldIndex];
      const options = getFieldOptions(currentField);

      addMessage({
        type: 'question',
        content: currentField.label,
        field: currentField,
        options,
      });

      updateProgress();
    }
  };

  const skipQuestion = () => {
    const currentField = visibleFields.value[state.value.currentFieldIndex];
    if (currentField && !currentField.required) {
      submitAnswer(null);
    }
  };

  // ========== Computed ==========
  const currentQuestion = computed(() =>
    visibleFields.value[state.value.currentFieldIndex] ?? null,
  );

  const isFirstQuestion = computed(() => state.value.currentFieldIndex === 0);

  const isLastQuestion = computed(() =>
    state.value.currentFieldIndex === visibleFields.value.length - 1,
  );

  const canSkip = computed(() => {
    const current = currentQuestion.value;
    return current ? !current.required : false;
  });

  const formattedMessages = computed(() =>
    state.value.messages.map(msg => ({
      ...msg,
      time: formatTime(msg.timestamp),
    })),
  );

  // ========== Utilities ==========
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const reset = () => {
    state.value.messages = [];
    state.value.currentFieldIndex = 0;
    state.value.isTyping = false;
    state.value.isComplete = false;
    state.value.progress = 0;
    answers.value = {};
  };

  return {
    state,
    answers,
    currentQuestion,
    isFirstQuestion,
    isLastQuestion,
    canSkip,
    formattedMessages,
    startChat,
    submitAnswer,
    goBack,
    skipQuestion,
    reset,
  };
}
