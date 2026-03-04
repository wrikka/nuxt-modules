interface Suggestion {
  text: string;
  confidence: number;
}

const COMMON_PHRASES = [
  'Thank you for your email.',
  'I hope this message finds you well.',
  'Please let me know if you have any questions.',
  'Looking forward to hearing from you.',
  'Best regards,',
  'Thanks in advance for your help.',
  'I appreciate your quick response.',
  'Could you please provide more details?',
  'I\'ve attached the file you requested.',
  'Please find the information below.',
  'Let me know if you need anything else.',
  'I\'ll get back to you as soon as possible.',
  'Have a great day!',
  'Thanks for reaching out.',
  'I hope you\'re doing well.',
];

export const useSmartCompose = () => {
  const _suggestions = ref<Suggestion[]>([]);
  const _currentInput = ref('');
  const _isEnabled = ref(true);

  const _getLastWords = (text: string, count = 3): string => {
    const words = text.trim().split(/\s+/);
    return words.slice(-count).join(' ').toLowerCase();
  };

  const _calculateSimilarity = (a: string, b: string): number => {
    const aWords = a.toLowerCase().split(/\s+/);
    const bWords = b.toLowerCase().split(/\s+/);
    const intersection = aWords.filter(word => bWords.includes(word));
    return intersection.length / Math.max(aWords.length, bWords.length);
  };

  const getSuggestions = (input: string): Suggestion[] => {
    if (!_isEnabled.value || input.length < 3) {
      _suggestions.value = [];
      return [];
    }

    _currentInput.value = input;
    const lastWords = _getLastWords(input);

    const scored = COMMON_PHRASES.map(phrase => ({
      text: phrase,
      confidence: _calculateSimilarity(lastWords, phrase),
    }));

    // Sort by confidence and filter low scores
    _suggestions.value = scored
      .filter(s => s.confidence > 0.1)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3);

    return _suggestions.value;
  };

  const completeWithSuggestion = (input: string, suggestion: string): string => {
    const words = input.trim().split(/\s+/);
    const lastWord = words[words.length - 1] || '';

    // If suggestion starts with the last word being typed
    if (suggestion.toLowerCase().startsWith(lastWord.toLowerCase()) && lastWord.length > 0) {
      words[words.length - 1] = suggestion;
    } else {
      words.push(suggestion);
    }

    return words.join(' ');
  };

  const toggleSmartCompose = (): void => {
    _isEnabled.value = !_isEnabled.value;
  };

  // Simulate learning from user patterns
  const learnFromEmail = (emailBody: string): void => {
    // In a real implementation, this would analyze patterns
    // and add custom phrases to the suggestion list
    console.log('Learning patterns from email');
  };

  return {
    suggestions: _suggestions,
    isEnabled: _isEnabled,
    getSuggestions,
    completeWithSuggestion,
    toggleSmartCompose,
    learnFromEmail,
  };
};
