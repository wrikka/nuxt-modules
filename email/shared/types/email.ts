export interface Email {
  id: number;
  from: string;
  to?: string;
  domain: string;
  subject: string;
  body: string;
  time: string;
  read: boolean;
  starred: boolean;
  favorited: boolean;
  labels: string[];
  folder: 'inbox' | 'sent' | 'drafts' | 'trash' | 'purchases' | 'snoozed' | 'archived' | 'spam';
  snoozedUntil?: string;
  muted: boolean;
}
