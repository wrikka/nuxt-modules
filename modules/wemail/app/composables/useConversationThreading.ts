import type { Email } from '../../shared/types/email';

export interface EmailThread {
  id: string;
  subject: string;
  participants: string[];
  emails: Email[];
  lastActivity: string;
  unreadCount: number;
}

export const useConversationThreading = () => {
  const _threads = ref<EmailThread[]>([]);
  const _currentThread = ref<EmailThread | null>(null);

  const _normalizeSubject = (subject: string): string => {
    // Remove Re:, Fwd:, FW:, etc.
    return subject
      .replace(/^(Re:|RE:|Fwd:|FWD:|FW:)\s*/gi, '')
      .trim()
      .toLowerCase();
  };

  const _extractParticipants = (emails: Email[]): string[] => {
    const participants = new Set<string>();
    emails.forEach(email => {
      participants.add(email.from);
      if (email.to) participants.add(email.to);
    });
    return Array.from(participants);
  };

  const groupIntoThreads = (emails: Email[]): EmailThread[] => {
    const threadMap = new Map<string, Email[]>();

    // Group by normalized subject
    emails.forEach(email => {
      const normalizedSubject = _normalizeSubject(email.subject);

      // Find existing thread with same subject
      let foundThread = false;
      for (const [key, threadEmails] of threadMap) {
        if (_normalizeSubject(key) === normalizedSubject) {
          threadEmails.push(email);
          foundThread = true;
          break;
        }
      }

      if (!foundThread) {
        // Check if this is a reply to an existing email
        const existingThreadKey = Array.from(threadMap.keys()).find(key => {
          const threadEmails = threadMap.get(key) || [];
          return threadEmails.some(threadEmail => {
            // Check if email references another email (simplified)
            const emailBody = email.body.toLowerCase();
            const threadSubject = _normalizeSubject(threadEmail.subject);
            return emailBody.includes(threadSubject) ||
                   emailBody.includes(`on ${threadEmail.time}`) ||
                   emailBody.includes(threadEmail.from.toLowerCase());
          });
        });

        if (existingThreadKey) {
          threadMap.get(existingThreadKey)?.push(email);
        } else {
          threadMap.set(email.subject, [email]);
        }
      }
    });

    // Convert map to threads
    const threads: EmailThread[] = [];
    for (const [subject, threadEmails] of threadMap) {
      const sorted = threadEmails.sort((a, b) => {
        return new Date(b.time).getTime() - new Date(a.time).getTime();
      });

      threads.push({
        id: `thread-${sorted[0].id}`,
        subject,
        participants: _extractParticipants(sorted),
        emails: sorted,
        lastActivity: sorted[0].time,
        unreadCount: sorted.filter(e => !e.read).length,
      });
    }

    // Sort threads by last activity
    return threads.sort((a, b) => {
      return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
    });
  };

  const selectThread = (threadId: string): EmailThread | null => {
    const thread = _threads.value.find(t => t.id === threadId) || null;
    _currentThread.value = thread;
    return thread;
  };

  const markThreadAsRead = async (threadId: string): Promise<void> => {
    const thread = _threads.value.find(t => t.id === threadId);
    if (!thread) return;

    for (const email of thread.emails) {
      if (!email.read) {
        await $fetch(`/api/emails/${email.id}`, {
          method: 'PATCH',
          body: { read: true },
        });
        email.read = true;
      }
    }
    thread.unreadCount = 0;
  };

  const getReplyRecipients = (thread: EmailThread): { to: string; cc?: string[] } => {
    const lastEmail = thread.emails[0];
    if (!lastEmail) return { to: '' };

    // Reply to the sender of the last email
    const to = lastEmail.from;

    // CC other participants except current user
    const cc = thread.participants.filter(p => p !== lastEmail.from && p !== 'me');

    return { to, cc: cc.length > 0 ? cc : undefined };
  };

  return {
    threads: _threads,
    currentThread: _currentThread,
    groupIntoThreads,
    selectThread,
    markThreadAsRead,
    getReplyRecipients,
  };
};
