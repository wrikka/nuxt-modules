import { emails } from '../../db/emails';
import { labels } from '../../db/labels';
import type { LabelCondition } from '../../../shared/types/label';
import type { Email } from '../../../shared/types/email';

const checkCondition = (emailField: string, operator: LabelCondition['operator'], value: string): boolean => {
  const lowerEmailField = emailField.toLowerCase();
  const lowerValue = value.toLowerCase();

  switch (operator) {
    case 'contains':
      return lowerEmailField.includes(lowerValue);
    case 'not-contains':
      return !lowerEmailField.includes(lowerValue);
    case 'equals':
      return lowerEmailField === lowerValue;
    case 'starts-with':
      return lowerEmailField.startsWith(lowerValue);
    case 'ends-with':
      return lowerEmailField.endsWith(lowerValue);
    default:
      return false;
  }
};

const getAutoAppliedLabels = (email: Email): string[] => {
  const appliedLabels: string[] = [];
  const labelsWithConditions = labels.filter(label => label.conditions && label.conditions.length > 0);

  for (const label of labelsWithConditions) {
    const conditionsMet = label.conditions?.every(condition => {
      const emailFieldValue = email[condition.field] || '';
      return checkCondition(emailFieldValue, condition.operator, condition.value);
    });

    if (conditionsMet) {
      appliedLabels.push(label.name);
    }
  }

  return appliedLabels;
};

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  const newEmailData = {
    from: body.from || 'You', // Assuming incoming emails might have a 'from'
    domain: body.domain || 'example.com',
    subject: body.subject || '',
    body: body.body || '',
    to: body.to || '',
    folder: body.folder || 'inbox',
  };

  const newEmail: Email = {
    id: emails.length + 1,
    ...newEmailData,
    time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    read: false,
    starred: false,
    favorited: false,
    labels: [],
    muted: false,
  };

  // Apply labels based on rules
  newEmail.labels = getAutoAppliedLabels(newEmail);

  emails.unshift(newEmail);
  return newEmail
})
