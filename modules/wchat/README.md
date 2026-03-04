# @wrikka/wchat

Telegram-like chat module with **33+ features** including E2EE, Voice/Video calls, Bots, Channels, Supergroups, and Cloud sync.

## Features

### Core Messaging (8 features)
1. **Cloud-Based Messages** - Real-time sync across all devices
2. **Message Editing** - Edit messages within 48 hours
3. **Self-Destruct Messages** - Auto-delete after viewing (1 day to 1 year)
4. **Cloud Drafts** - Start typing on one device, finish on another
5. **Message Scheduling** - Schedule messages or send when recipient is online
6. **Saved Messages** - Personal cloud storage for bookmarks
7. **Chat Folders** - Organize chats into custom folders
8. **Secret Chats** - End-to-end encrypted with screenshot notifications

### Groups & Channels (8 features)
9. **Supergroups** - Up to 200,000 members
10. **Topics/Threads** - Organized discussions within groups
11. **Channels** - One-way broadcast to unlimited subscribers
12. **Anonymous Admins** - Post without revealing identity
13. **Content Protection** - Prevent screenshots, forwarding, downloads
14. **Polls** - Anonymous/visible with multiple choice options
15. **Slow Mode** - Rate limiting to prevent spam
16. **Admin Approval** - Require approval to join groups

### Media & Files (8 features)
17. **Large File Sharing** - Upload files up to 4GB
18. **Media Streaming** - Watch videos without downloading
19. **Pause/Resume Downloads** - Manage large file transfers
20. **Auto-Download Controls** - WiFi/Mobile data preferences
21. **Sticker Platform** - 40,000+ cloud-based stickers
22. **Animated Emoji** - Fullscreen animated effects
23. **Video Stickers** - WebM format stickers
24. **Custom Emoji** - Upload your own emoji (Premium)

### Voice & Video (7 features)
25. **1-on-1 Voice/Video Calls** - E2EE peer-to-peer
26. **Group Voice Chats** - Live voice in groups
27. **Group Video Calls** - Up to 1,000 participants
28. **Screen Sharing** - Share screen with system audio
29. **Noise Suppression** - AI-powered audio cleanup
30. **Background Blur** - Professional video calls
31. **Live Streaming** - Stream to channels with OBS integration
32. **Voice Transcription** - Speech-to-text (Premium)

### AI & Bots (7 features)
33. **Bot Platform** - Full API for automated services
34. **Mini Apps** - Web apps running inside chats
35. **Smart Replies** - AI-suggested responses
36. **AI Assistant** - Schedule, summarize, answer questions
37. **Content Moderation** - Auto-detect spam and abuse
38. **Payment Integration** - 20+ payment providers in bots
39. **Inline Queries** - Bot commands anywhere

### Privacy & Security (8 features)
40. **Two-Step Verification** - 2FA with recovery email
41. **Last Seen Control** - Hide online status granularly
42. **Phone Number Privacy** - Hide from non-contacts
43. **Profile Photo Privacy** - Separate public/private photos
44. **Block/Allow Lists** - Control who can contact you
45. **Remote Logout** - Terminate sessions from anywhere
46. **Login Alerts** - Notifications for new logins
47. **Public Profile Picture** - Avatar for public view

### Additional Features
48. **Message Reactions** - Emoji reactions with effects
49. **Read Receipts** - Double checkmarks
50. **Typing Indicators** - Show when someone's typing
51. **Pinned Messages** - Pin important messages
52. **Message Notifications** - Custom per-chat settings
53. **Search with Filters** - Date, type, sender filters
54. **Mentions & Hashtags** - @username and #topic support
55. **Forward with Attribution** - Control forward info
56. **Quote Messages** - Reply to specific messages
57. **Import/Export** - WhatsApp, Line, KakaoTalk import

## Installation

```bash
bun add @wrikka/wchat
```

## Usage

Add to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@wrikka/wchat'],
  wchat: {
    enableE2EE: true,
    enableVoiceCalls: true,
    enableVideoCalls: true,
    enableBots: true,
    enableAI: true,
    maxFileSize: 4 * 1024 * 1024 * 1024, // 4GB
  }
})
```

## UI Components (using @wrikka/wui)

- `ChatListItem` - Chat list with unread badges
- `ChatFolders` - Folder management sidebar
- `ChatSearch` - Advanced search with filters
- `ChatView` - Main chat interface
- `MessageBubble` - Message display with reactions
- `MessageInput` - Rich input with attachments
- `CallInterface` - Voice/video call UI

## Composables

```ts
// Core features
const { messages, syncMessages } = useCloudMessages()
const { saveDraft, getDraft } = useCloudDrafts()
const { createFolder } = useChatFolders()
const { scheduleMessage } = useMessageScheduling()

// Security
const { createSecretChat, encryptMessage } = useSecretChats()

// Groups
const { createSupergroup, createChannel, createTopic } = useGroupsAndChannels()
const { createPoll } = usePolls()

// Media
const { uploadFile, downloadFile, getStreamingUrl } = useMedia()
const { uploadCustomEmoji } = useStickers()

// Calls
const { startCall, startGroupCall, startScreenShare } = useCalls()

// AI & Bots
const { getSmartReplies, transcribeVoice } = useAI()
const { openMiniApp } = useBots()

// Utilities
const { search } = useSearch()
const { pinMessage } = usePinnedMessages()
```

## Architecture

- **Cloud-first** - All data synced across devices
- **E2EE available** - Secret chats with perfect forward secrecy
- **Modular** - Enable only features you need
- **WebRTC** - P2P voice/video calls
- **WebSocket** - Real-time messaging

## License

MIT
