import { ref } from 'vue';
import type { Form, FormField } from '../types';
import { generateId } from '../utils/id';

export interface AIGenerationPrompt {
  description: string;
  category?: string;
  tone?: 'professional' | 'casual' | 'friendly' | 'formal';
  language?: string;
}

export interface AIGeneratedForm {
  title: string;
  description: string;
  fields: FormField[];
  suggestedSettings: Partial<Form['settings']>;
}

export function useAIFormBuilder() {
  const isGenerating = ref(false);
  const generationProgress = ref(0);
  const lastGeneratedForm = ref<AIGeneratedForm | null>(null);
  const error = ref<string | null>(null);

  // AI Form Generation - Simulated (in production, this would call an AI API)
  const generateForm = async (prompt: AIGenerationPrompt): Promise<AIGeneratedForm> => {
    isGenerating.value = true;
    generationProgress.value = 0;
    error.value = null;

    try {
      // Simulate API call with progress
      for (let i = 0; i <= 100; i += 20) {
        await new Promise(resolve => setTimeout(resolve, 200));
        generationProgress.value = i;
      }

      // Parse description and generate appropriate fields
      const generatedForm = parseDescriptionToForm(prompt);
      lastGeneratedForm.value = generatedForm;

      return generatedForm;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to generate form';
      throw err;
    } finally {
      isGenerating.value = false;
    }
  };

  // Parse natural language description to form structure
  const parseDescriptionToForm = (prompt: AIGenerationPrompt): AIGeneratedForm => {
    const desc = prompt.description.toLowerCase();
    const fields: FormField[] = [];
    let order = 0;

    // Detect form type from keywords
    const isContact = desc.includes('contact') || desc.includes('ติดต่อ');
    const isSurvey = desc.includes('survey') || desc.includes('แบบสอบถาม');
    const isRegistration = desc.includes('register') || desc.includes('ลงทะเบียน');
    const isJob = desc.includes('job') || desc.includes('apply') || desc.includes('สมัครงาน');
    const isEvent = desc.includes('event') || desc.includes('งาน');
    const isFeedback = desc.includes('feedback') || desc.includes('รีวิว');
    const isOrder = desc.includes('order') || desc.includes('สั่งซื้อ');
    const isQuiz = desc.includes('quiz') || desc.includes('แบบทดสอบ');

    // Common fields based on detected type
    if (isContact || isJob || isRegistration || isEvent || isOrder) {
      fields.push(createField('short_text', 'full_name', 'Full Name', true, order++));
      fields.push(createField('email', 'email', 'Email Address', true, order++));
    }

    if (isJob || isRegistration || isOrder) {
      fields.push(createField('phone', 'phone', 'Phone Number', true, order++));
    }

    if (isContact) {
      fields.push(createField('dropdown', 'subject', 'Subject', true, order++, {
        options: [
          { id: '1', label: 'General Inquiry', value: 'general' },
          { id: '2', label: 'Support', value: 'support' },
          { id: '3', label: 'Sales', value: 'sales' },
        ],
      }));
      fields.push(createField('long_text', 'message', 'Message', true, order++));
    }

    if (isSurvey || isFeedback) {
      fields.push(createField('rating', 'overall_rating', 'Overall Rating', true, order++, {
        settings: { maxRating: 5, ratingIcon: 'star' },
      }));
      fields.push(createField('long_text', 'feedback', 'Your Feedback', false, order++));
    }

    if (isJob) {
      fields.push(createField('file_upload', 'resume', 'Resume/CV', true, order++, {
        settings: { maxFiles: 1, maxFileSize: 10 },
      }));
      fields.push(createField('long_text', 'cover_letter', 'Cover Letter', false, order++));
    }

    if (isEvent) {
      fields.push(createField('date', 'event_date', 'Event Date', true, order++));
      fields.push(createField('dropdown', 'attendance', 'Will you attend?', true, order++, {
        options: [
          { id: '1', label: 'Yes, I will attend', value: 'yes' },
          { id: '2', label: 'No, I cannot attend', value: 'no' },
          { id: '3', label: 'Maybe', value: 'maybe' },
        ],
      }));
    }

    if (isOrder) {
      fields.push(createField('dropdown', 'product', 'Select Product', true, order++));
      fields.push(createField('number', 'quantity', 'Quantity', true, order++));
      fields.push(createField('long_text', 'address', 'Shipping Address', true, order++));
    }

    if (isQuiz) {
      // Generate sample quiz questions
      for (let i = 1; i <= 3; i++) {
        fields.push(createField('multiple_choice', `question_${i}`, `Question ${i}: Sample question text?`, true, order++, {
          options: [
            { id: 'a', label: 'Option A', value: 'a' },
            { id: 'b', label: 'Option B', value: 'b' },
            { id: 'c', label: 'Option C', value: 'c' },
          ],
        }));
      }
    }

    // Add any detected custom fields from description
    const customFields = extractCustomFields(desc);
    customFields.forEach(field => {
      fields.push(createField(field.type, field.id, field.label, field.required, order++));
    });

    // Generate title based on description
    const title = generateTitle(desc, prompt.category);

    return {
      title,
      description: prompt.description,
      fields,
      suggestedSettings: {
        allowMultipleSubmissions: !isQuiz && !isRegistration,
        notifications: [
          {
            id: generateId('notif'),
            type: 'email',
            trigger: 'on_submit',
            recipients: [],
            enabled: true,
          },
        ],
      },
    };
  };

  // Extract custom fields mentioned in description
  const extractCustomFields = (description: string): Array<{ type: FormField['type']; id: string; label: string; required: boolean }> => {
    const fields: Array<{ type: FormField['type']; id: string; label: string; required: boolean }> = [];

    // Pattern matching for common field requests
    const patterns = [
      { regex: /(?:ask for|need|want|require).{0,20}name/i, type: 'short_text' as const, label: 'Name' },
      { regex: /(?:ask for|need|want|require).{0,20}email/i, type: 'email' as const, label: 'Email' },
      { regex: /(?:ask for|need|want|require).{0,20}phone/i, type: 'phone' as const, label: 'Phone' },
      { regex: /(?:ask for|need|want|require).{0,30}address/i, type: 'long_text' as const, label: 'Address' },
      { regex: /(?:ask for|need|want|require).{0,30}feedback|comment/i, type: 'long_text' as const, label: 'Comments' },
      { regex: /(?:ask for|need|want|require).{0,30}age|date of birth/i, type: 'date' as const, label: 'Date of Birth' },
      { regex: /(?:ask for|need|want|require).{0,30}rating/i, type: 'rating' as const, label: 'Rating' },
      { regex: /(?:upload|attach).{0,20}file|document|image/i, type: 'file_upload' as const, label: 'File Upload' },
    ];

    patterns.forEach(pattern => {
      if (pattern.regex.test(description)) {
        fields.push({
          type: pattern.type,
          id: pattern.label.toLowerCase().replace(/\s+/g, '_'),
          label: pattern.label,
          required: description.includes('required') || description.includes('ต้องระบุ'),
        });
      }
    });

    return fields;
  };

  // Generate form title
  const generateTitle = (description: string, category?: string): string => {
    if (category) {
      return `${category.charAt(0).toUpperCase() + category.slice(1)} Form`;
    }

    if (description.includes('contact') || description.includes('ติดต่อ')) return 'Contact Form';
    if (description.includes('survey') || description.includes('แบบสอบถาม')) return 'Survey';
    if (description.includes('register') || description.includes('ลงทะเบียน')) return 'Registration Form';
    if (description.includes('job') || description.includes('apply') || description.includes('สมัครงาน')) return 'Job Application';
    if (description.includes('event') || description.includes('งาน')) return 'Event Registration';
    if (description.includes('feedback') || description.includes('รีวิว')) return 'Feedback Form';
    if (description.includes('order') || description.includes('สั่งซื้อ')) return 'Order Form';
    if (description.includes('quiz') || description.includes('แบบทดสอบ')) return 'Quiz';

    // Extract first sentence or first 5 words
    const firstSentence = description.split(/[.!?]/)[0];
    if (firstSentence.length < 50) {
      return firstSentence.charAt(0).toUpperCase() + firstSentence.slice(1);
    }

    return 'New Form';
  };

  // Helper to create a field
  const createField = (
    type: FormField['type'],
    id: string,
    label: string,
    required: boolean,
    order: number,
    extras?: Partial<FormField>,
  ): FormField => ({
    id: generateId(id),
    type,
    label,
    required,
    order,
    ...extras,
  });

  // Improve generated form with AI suggestions
  const improveForm = async (form: Form, instruction: string): Promise<Form> => {
    isGenerating.value = true;
    error.value = null;

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Parse improvement instruction
      const improvedForm = { ...form };

      if (instruction.toLowerCase().includes('add') || instruction.toLowerCase().includes('เพิ่ม')) {
        // Add a new field based on instruction
        const newField = createField('short_text', 'new_field', 'New Question', false, form.fields.length);
        improvedForm.fields.push(newField);
      }

      if (instruction.toLowerCase().includes('remove') || instruction.toLowerCase().includes('ลบ')) {
        // Remove last field
        improvedForm.fields.pop();
      }

      if (instruction.toLowerCase().includes('make required') || instruction.toLowerCase().includes('บังคับ')) {
        // Make all fields required
        improvedForm.fields.forEach(f => { f.required = true; });
      }

      return improvedForm;
    } finally {
      isGenerating.value = false;
    }
  };

  return {
    isGenerating,
    generationProgress,
    lastGeneratedForm,
    error,
    generateForm,
    improveForm,
  };
}
