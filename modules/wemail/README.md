# wemail

Email client application with Gmail-like interface and 24+ features.

## Features

### Core Email Features
- 📧 **Email Client UI** - Gmail-like interface with inbox, sent, drafts, folders
- 🏷️ **Labels & Auto-labeling** - Automatic label application based on rules
- ⭐ **Star/Favorite** - Mark important emails
- 📂 **Folders** - Inbox, Sent, Drafts, Archived, Snoozed, Trash, Spam, Purchases
- 🔍 **Search** - Full-text search across emails

### Advanced Features (24 total)

#### High Priority
1. **Email Drafts Auto-save** - Auto-save drafts with `useAutoSaveDraft`
2. **Keyboard Shortcuts** - Gmail-style shortcuts (j/k, r, a, s, #) with `useKeyboardShortcuts`
3. **Undo Send** - Cancel sending within 5-30 seconds with `useUndoSend`
4. **Attachment Support** - Upload and preview attachments with `useAttachments`
5. **Email Sending Backend** - Send via Resend, SendGrid, Postmark with `useEmailSender`
6. **Conversation Threading** - Group replies into threads with `useConversationThreading`
7. **Real-time Sync** - WebSocket/polling updates with `useRealtimeSync`
8. **Real Email Provider Integration** - Gmail, Outlook, IMAP support with `useEmailProvider`

#### Medium Priority
9. **Email Templates** - Save and reuse templates with `useEmailTemplates`
10. **Signature Management** - Multiple email signatures with `useEmailSignatures`
11. **Snooze with Custom Time** - Custom snooze times with `useSnooze`
12. **Advanced Search** - Search operators (from:, to:, subject:) with `useAdvancedSearch`
13. **Email Preview Pane** - Read without opening new page with `usePreviewPane`
14. **Filter/Rule Actions** - Advanced filtering with `useEmailFilters`
15. **Email Scheduling** - Schedule send times with `useEmailScheduling`
16. **Multiple Account Support** - Switch between accounts with `useMultipleAccounts`
17. **Offline Mode** - PWA + IndexedDB with `useOfflineMode`

#### Low Priority
18. **Print Email** - Print-optimized layout with `usePrintEmail`
19. **Export to PDF/EML** - Export emails with `useExportEmail`
20. **Read Receipts** - Track email opens with `useReadReceipts`
21. **Swipe Gestures** - Mobile swipe actions with `useSwipeGestures`
22. **Import Contacts** - CSV/vCard import with `useImportContacts`
23. **Email Analytics** - Stats and insights with `useEmailAnalytics`
24. **Smart Compose** - AI autocomplete with `useSmartCompose`

## Composables

All features are implemented as composables in `app/composables/`:

- `useAutoSaveDraft.ts` - Auto-save drafts
- `useKeyboardShortcuts.ts` - Keyboard shortcuts
- `useUndoSend.ts` - Undo send functionality
- `useAttachments.ts` - File attachments
- `useEmailTemplates.ts` - Email templates
- `useEmailSignatures.ts` - Email signatures
- `useSnooze.ts` - Snooze emails
- `useAdvancedSearch.ts` - Advanced search
- `usePreviewPane.ts` - Preview pane
- `usePrintEmail.ts` - Print functionality
- `useExportEmail.ts` - Export emails
- `useEmailSender.ts` - Send emails
- `useConversationThreading.ts` - Thread conversations
- `useRealtimeSync.ts` - Real-time sync
- `useEmailFilters.ts` - Email filters
- `useEmailScheduling.ts` - Schedule emails
- `useReadReceipts.ts` - Read receipts
- `useSwipeGestures.ts` - Swipe gestures
- `useImportContacts.ts` - Import contacts
- `useEmailAnalytics.ts` - Email analytics
- `useSmartCompose.ts` - Smart compose
- `useEmailProvider.ts` - Email providers
- `useMultipleAccounts.ts` - Multiple accounts
- `useOfflineMode.ts` - Offline mode

## Installation

```bash
bun install
```

## Usage

```bash
bun run dev
```

## API Endpoints

- `GET /api/emails` - List emails
- `GET /api/emails/search` - Search emails
- `POST /api/emails` - Create email
- `POST /api/emails/send` - Send email
- `PATCH /api/emails/:id` - Update email
- `DELETE /api/emails/:id` - Delete email
- `GET /api/labels` - List labels
- `POST /api/labels` - Create label
- `GET /api/sync` - Real-time sync (SSE)
- `POST /api/emails/track` - Track email events
- `GET /api/track/pixel` - Tracking pixel
- `POST /api/accounts/test` - Test account connection
- `POST /api/accounts/sync` - Sync account

## License

MIT
