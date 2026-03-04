import { computed, ref } from 'vue';
import type { ExportConfig, Form, FormAnalytics, FormResponse, TemplateCategory } from '../types';

// ========== Templates ==========

export const useFormTemplates = () => {
  const categories: TemplateCategory[] = [
    'contact', 'survey', 'event', 'job', 'order', 'registration',
    'feedback', 'quiz', 'application', 'booking', 'payment', 'newsletter', 'rsvp',
  ];

  const templates = computed(() => [
    // Contact Templates
    {
      id: 'contact-basic',
      name: 'Simple Contact Form',
      description: 'Basic contact form with name, email, and message',
      category: 'contact',
      fields: [
        { id: 'name', type: 'short_text', label: 'Full Name', required: true, order: 0 },
        { id: 'email', type: 'email', label: 'Email Address', required: true, order: 1 },
        { id: 'message', type: 'long_text', label: 'Message', required: true, order: 2 },
      ],
    },
    {
      id: 'contact-detailed',
      name: 'Detailed Contact Form',
      description: 'Contact form with phone, subject, and priority',
      category: 'contact',
      fields: [
        { id: 'name', type: 'short_text', label: 'Full Name', required: true, order: 0 },
        { id: 'email', type: 'email', label: 'Email Address', required: true, order: 1 },
        { id: 'phone', type: 'phone', label: 'Phone Number', required: false, order: 2 },
        { id: 'subject', type: 'dropdown', label: 'Subject', required: true, order: 3, options: [
          { id: '1', label: 'General Inquiry', value: 'general' },
          { id: '2', label: 'Support', value: 'support' },
          { id: '3', label: 'Sales', value: 'sales' },
        ]},
        { id: 'message', type: 'long_text', label: 'Message', required: true, order: 4 },
      ],
    },
    // Survey Templates
    {
      id: 'satisfaction-survey',
      name: 'Customer Satisfaction',
      description: 'Measure customer satisfaction with your product/service',
      category: 'survey',
      fields: [
        { id: 'overall', type: 'rating', label: 'Overall Satisfaction', required: true, order: 0, settings: { maxRating: 5 } },
        { id: 'recommend', type: 'scale', label: 'How likely are you to recommend us?', required: true, order: 1, settings: { scaleMin: 0, scaleMax: 10 } },
        { id: 'feedback', type: 'long_text', label: 'What can we improve?', required: false, order: 2 },
      ],
    },
    {
      id: 'nps-survey',
      name: 'NPS Survey',
      description: 'Net Promoter Score survey',
      category: 'survey',
      fields: [
        { id: 'nps', type: 'scale', label: 'How likely are you to recommend us to a friend?', required: true, order: 0, settings: { scaleMin: 0, scaleMax: 10 } },
        { id: 'reason', type: 'long_text', label: 'What\'s the main reason for your score?', required: false, order: 1 },
      ],
    },
    // Event Templates
    {
      id: 'event-registration',
      name: 'Event Registration',
      description: 'Register attendees for your event',
      category: 'event',
      fields: [
        { id: 'name', type: 'short_text', label: 'Full Name', required: true, order: 0 },
        { id: 'email', type: 'email', label: 'Email', required: true, order: 1 },
        { id: 'dietary', type: 'checkbox', label: 'Dietary Requirements', required: false, order: 2, options: [
          { id: '1', label: 'Vegetarian', value: 'vegetarian' },
          { id: '2', label: 'Vegan', value: 'vegan' },
          { id: '3', label: 'Gluten Free', value: 'gluten_free' },
          { id: '4', label: 'Nut Allergy', value: 'nut_allergy' },
        ]},
      ],
    },
    {
      id: 'rsvp-form',
      name: 'RSVP Form',
      description: 'Wedding or party RSVP',
      category: 'rsvp',
      fields: [
        { id: 'name', type: 'short_text', label: 'Name(s)', required: true, order: 0 },
        { id: 'attending', type: 'multiple_choice', label: 'Will you be attending?', required: true, order: 1, options: [
          { id: '1', label: 'Joyfully Accepts', value: 'yes' },
          { id: '2', label: 'Regretfully Declines', value: 'no' },
        ]},
        { id: 'guests', type: 'number', label: 'Number of Guests', required: false, order: 2 },
        { id: 'dietary', type: 'long_text', label: 'Dietary Restrictions', required: false, order: 3 },
      ],
    },
    // Job Templates
    {
      id: 'job-application',
      name: 'Job Application',
      description: 'Collect job applications with resume upload',
      category: 'job',
      fields: [
        { id: 'name', type: 'short_text', label: 'Full Name', required: true, order: 0 },
        { id: 'email', type: 'email', label: 'Email', required: true, order: 1 },
        { id: 'phone', type: 'phone', label: 'Phone', required: true, order: 2 },
        { id: 'position', type: 'dropdown', label: 'Position Applied For', required: true, order: 3 },
        { id: 'resume', type: 'file_upload', label: 'Resume/CV', required: true, order: 4, settings: { maxFiles: 1 } },
        { id: 'cover', type: 'file_upload', label: 'Cover Letter', required: false, order: 5, settings: { maxFiles: 1 } },
      ],
    },
    // Order Templates
    {
      id: 'product-order',
      name: 'Product Order Form',
      description: 'Simple order form with payment',
      category: 'order',
      fields: [
        { id: 'name', type: 'short_text', label: 'Customer Name', required: true, order: 0 },
        { id: 'email', type: 'email', label: 'Email', required: true, order: 1 },
        { id: 'product', type: 'dropdown', label: 'Product', required: true, order: 2 },
        { id: 'quantity', type: 'number', label: 'Quantity', required: true, order: 3 },
        { id: 'address', type: 'long_text', label: 'Shipping Address', required: true, order: 4 },
      ],
    },
    // Quiz Templates
    {
      id: 'trivia-quiz',
      name: 'Trivia Quiz',
      description: 'Fun trivia quiz with scoring',
      category: 'quiz',
      fields: [
        { id: 'q1', type: 'multiple_choice', label: 'What is the capital of France?', required: true, order: 0, options: [
          { id: '1', label: 'London', value: 'london' },
          { id: '2', label: 'Paris', value: 'paris' },
          { id: '3', label: 'Berlin', value: 'berlin' },
        ]},
        { id: 'q2', type: 'multiple_choice', label: 'Which planet is known as the Red Planet?', required: true, order: 1, options: [
          { id: '1', label: 'Venus', value: 'venus' },
          { id: '2', label: 'Mars', value: 'mars' },
          { id: '3', label: 'Jupiter', value: 'jupiter' },
        ]},
      ],
    },
    // Newsletter
    {
      id: 'newsletter-signup',
      name: 'Newsletter Signup',
      description: 'Simple email newsletter signup',
      category: 'newsletter',
      fields: [
        { id: 'name', type: 'short_text', label: 'First Name', required: false, order: 0 },
        { id: 'email', type: 'email', label: 'Email Address', required: true, order: 1 },
        { id: 'interests', type: 'checkbox', label: 'Interests', required: false, order: 2 },
      ],
    },
    // Registration
    {
      id: 'workshop-registration',
      name: 'Workshop Registration',
      description: 'Register for a workshop or class',
      category: 'registration',
      fields: [
        { id: 'name', type: 'short_text', label: 'Full Name', required: true, order: 0 },
        { id: 'email', type: 'email', label: 'Email', required: true, order: 1 },
        { id: 'phone', type: 'phone', label: 'Phone', required: true, order: 2 },
        { id: 'experience', type: 'dropdown', label: 'Experience Level', required: true, order: 3, options: [
          { id: '1', label: 'Beginner', value: 'beginner' },
          { id: '2', label: 'Intermediate', value: 'intermediate' },
          { id: '3', label: 'Advanced', value: 'advanced' },
        ]},
      ],
    },
    // Booking
    {
      id: 'appointment-booking',
      name: 'Appointment Booking',
      description: 'Book an appointment or consultation',
      category: 'booking',
      fields: [
        { id: 'name', type: 'short_text', label: 'Name', required: true, order: 0 },
        { id: 'email', type: 'email', label: 'Email', required: true, order: 1 },
        { id: 'phone', type: 'phone', label: 'Phone', required: true, order: 2 },
        { id: 'date', type: 'date', label: 'Preferred Date', required: true, order: 3 },
        { id: 'time', type: 'time', label: 'Preferred Time', required: true, order: 4 },
        { id: 'notes', type: 'long_text', label: 'Additional Notes', required: false, order: 5 },
      ],
    },
    // Payment
    {
      id: 'donation-form',
      name: 'Donation Form',
      description: 'Collect donations with custom amounts',
      category: 'payment',
      fields: [
        { id: 'name', type: 'short_text', label: 'Name', required: false, order: 0 },
        { id: 'email', type: 'email', label: 'Email', required: true, order: 1 },
        { id: 'amount', type: 'multiple_choice', label: 'Donation Amount', required: true, order: 2, options: [
          { id: '1', label: '$10', value: '10' },
          { id: '2', label: '$25', value: '25' },
          { id: '3', label: '$50', value: '50' },
          { id: '4', label: '$100', value: '100' },
          { id: '5', label: 'Custom', value: 'custom' },
        ]},
        { id: 'message', type: 'long_text', label: 'Message (Optional)', required: false, order: 3 },
      ],
    },
    // Feedback
    {
      id: 'product-feedback',
      name: 'Product Feedback',
      description: 'Collect detailed product feedback',
      category: 'feedback',
      fields: [
        { id: 'product', type: 'dropdown', label: 'Product', required: true, order: 0 },
        { id: 'rating', type: 'rating', label: 'Overall Rating', required: true, order: 1, settings: { maxRating: 5 } },
        { id: 'liked', type: 'long_text', label: 'What did you like?', required: false, order: 2 },
        { id: 'improve', type: 'long_text', label: 'What can we improve?', required: false, order: 3 },
      ],
    },
    // Application
    {
      id: 'scholarship-app',
      name: 'Scholarship Application',
      description: 'Apply for scholarship or grant',
      category: 'application',
      fields: [
        { id: 'name', type: 'short_text', label: 'Full Name', required: true, order: 0 },
        { id: 'email', type: 'email', label: 'Email', required: true, order: 1 },
        { id: 'gpa', type: 'number', label: 'GPA', required: true, order: 2 },
        { id: 'essay', type: 'long_text', label: 'Personal Statement', required: true, order: 3 },
        { id: 'transcript', type: 'file_upload', label: 'Transcript', required: true, order: 4 },
      ],
    },
  ]);

  const getTemplatesByCategory = (category: TemplateCategory) =>
    templates.value.filter(t => t.category === category);

  return {
    categories,
    templates,
    getTemplatesByCategory,
  };
};

// ========== Form Responses ==========

export const useFormResponses = (formId: string) => {
  const responses = ref<FormResponse[]>([]);
  const isLoading = ref(false);
  const totalCount = ref(0);

  const fetchResponses = async (page = 1, limit = 50) => {
    isLoading.value = true;
    // API call would go here
    await new Promise(resolve => setTimeout(resolve, 500));
    isLoading.value = false;
  };

  const exportResponses = async (config: ExportConfig) => {
    // Export logic
    const data = responses.value.map(r => ({
      ...r.answers,
      submittedAt: r.submittedAt,
      ...r.metadata,
    }));

    if (config.format === 'csv') {
      return convertToCSV(data);
    } else if (config.format === 'json') {
      return JSON.stringify(data, null, 2);
    }
    return data;
  };

  return {
    responses,
    isLoading,
    totalCount,
    fetchResponses,
    exportResponses,
  };
};

// ========== Analytics ==========

export const useFormAnalytics = (formId: string) => {
  const analytics = ref<FormAnalytics>({
    totalViews: 0,
    totalStarts: 0,
    totalSubmissions: 0,
    completionRate: 0,
    averageCompletionTime: 0,
    abandonRate: 0,
    dailyStats: [],
    fieldStats: [],
    deviceStats: [],
    sourceStats: [],
  });

  const isLoading = ref(false);

  const fetchAnalytics = async (dateRange?: { start: Date; end: Date }) => {
    isLoading.value = true;
    // API call would go here
    await new Promise(resolve => setTimeout(resolve, 500));
    isLoading.value = false;
  };

  const conversionRate = computed(() =>
    analytics.value.totalViews > 0
      ? (analytics.value.totalSubmissions / analytics.value.totalViews) * 100
      : 0,
  );

  return {
    analytics,
    isLoading,
    conversionRate,
    fetchAnalytics,
  };
};

// Helper function
function convertToCSV(data: Record<string, unknown>[]): string {
  if (data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const rows = data.map(row =>
    headers.map(header => {
      const value = row[header];
      if (Array.isArray(value)) return `"${value.join(', ')}"`;
      if (typeof value === 'string' && value.includes(',')) return `"${value}"`;
      return value ?? '';
    }).join(','),
  );
  return [headers.join(','), ...rows].join('\n');
}
