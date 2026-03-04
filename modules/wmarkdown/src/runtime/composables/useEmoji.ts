import { ref } from 'vue'

// Common emoji shortcodes
const emojiMap: Record<string, string> = {
  // Smileys
  smile: '😄',
  grinning: '😀',
  grin: '😁',
  joy: '😂',
  rofl: '🤣',
  sweat_smile: '😅',
  laughing: '😆',
  wink: '😉',
  blush: '😊',
  yum: '😋',
  sunglasses: '😎',
  heart_eyes: '😍',
  kissing_heart: '😘',
  kissing: '🗿',
  kissing_closed_eyes: '😚',
  kissing_smiling_eyes: '😙',
  stuck_out_tongue: '😛',
  stuck_out_tongue_winking_eye: '😜',
  stuck_out_tongue_closed_eyes: '😝',
  relaxed: '☺️',
  pensive: '😔',
  worried: '😟',
  frowning: '😦',
  anguished: '😧',
  cry: '😢',
  sob: '😭',
  triumph: '😤',
  angry: '😠',
  rage: '😡',
  flushed: '😳',
  fearful: '😨',
  cold_sweat: '😰',
  persevere: '😣',
  confounded: '😖',
  tired_face: '😫',
  weary: '😩',
  sleepy: '😪',
  dizzy_face: '😵',
  astonished: '😲',
  scream: '😱',
  neckbeard: '🎅',
  // People
  thumbsup: '👍',
  '+1': '👍',
  thumbsdown: '👎',
  '-1': '👎',
  ok_hand: '👌',
  punch: '👊',
  fist: '✊',
  v: '✌️',
  wave: '👋',
  raised_hand: '✋',
  open_hands: '👐',
  point_up: '☝️',
  point_down: '👇',
  point_left: '👈',
  point_right: '👉',
  raised_hands: '🙌',
  pray: '🙏',
  clap: '👏',
  muscle: '💪',
  // Nature
  sunny: '☀️',
  umbrella: '☔',
  cloud: '☁️',
  snowflake: '❄️',
  snowman: '⛄',
  zap: '⚡',
  fire: '🔥',
  // Objects
  watch: '⌚',
  iphone: '📱',
  calling: '📲',
  computer: '💻',
  email: '✉️',
  inbox_tray: '📥',
  outbox_tray: '📤',
  envelope_with_arrow: '📩',
  incoming_envelope: '📨',
  // Symbols
  heart: '❤️',
  yellow_heart: '💛',
  green_heart: '💚',
  blue_heart: '💙',
  purple_heart: '💜',
  black_heart: '🖤',
  broken_heart: '💔',
  heartpulse: '💗',
  heartbeat: '💓',
  two_hearts: '💕',
  sparkling_heart: '💖',
  star: '⭐',
  sparkles: '✨',
  zap: '⚡',
  boom: '💥',
  // Food
  coffee: '☕',
  tea: '🍵',
  sake: '🍶',
  beer: '🍺',
  beers: '🍻',
  cocktail: '🍸',
  tropical_drink: '🍹',
  wine_glass: '🍷',
  fork_and_knife: '🍴',
  pizza: '🍕',
  hamburger: '🍔',
  fries: '🍟',
  // Activities
  memo: '📝',
  book: '📖',
  books: '📚',
  bookmark: '🔖',
  link: '🔗',
  paperclip: '📎',
  // Travel
  rocket: '🚀',
  helicopter: '🚁',
  airplane: '✈️',
  seat: '💺',
  // Flags
  checkered_flag: '🏁',
  triangular_flag_on_post: '🚩',
  // Time
  hourglass: '⌛',
  hourglass_flowing_sand: '⏳',
  alarm_clock: '⏰',
  watch: '⌚',
  // Arrows
  arrow_up: '⬆️',
  arrow_down: '⬇️',
  arrow_left: '⬅️',
  arrow_right: '➡️',
  arrow_upper_left: '↖️',
  arrow_upper_right: '↗️',
  arrow_lower_left: '↙️',
  arrow_lower_right: '↘️',
  arrow_up_down: '↕️',
  left_right_arrow: '↔️',
  // Other
  white_check_mark: '✅',
  black_square_button: '🔲',
  white_square_button: '🔳',
  black_circle: '⚫',
  white_circle: '⚪',
  red_circle: '🔴',
  large_blue_circle: '🔵',
  warning: '⚠️',
  question: '❓',
  grey_question: '❔',
  grey_exclamation: '❕',
  exclamation: '❗',
  x: '❌',
  o: '⭕',
  recycle: '♻️',
  white_flower: '💮',
  100: '💯',
  1234: '🔢',
  // GitHub-style
  tada: '🎉',
  fire: '🔥',
  bug: '🐛',
  construction: '🚧',
  rocket: '🚀',
  sparkles: '✨',
  label: '🏷️',
  bookmark: '🔖',
  // Common abbreviations
  lol: '😂',
  omg: '😱',
  wow: '😮',
  yay: '🎉',
  cool: '😎',
  nice: '👍',
  thanks: '🙏',
  please: '🥺',
  love: '❤️',
  like: '👍',
  dislike: '👎'
}

export function useEmoji() {
  const transform = (text: string): string => {
    return text.replace(/:([a-z0-9_+-]+):/g, (match, code) => {
      const emoji = emojiMap[code.toLowerCase()]
      return emoji || match
    })
  }

  const getEmoji = (code: string): string | undefined => {
    return emojiMap[code.toLowerCase()]
  }

  const getAllEmojis = (): Record<string, string> => {
    return { ...emojiMap }
  }

  const searchEmojis = (query: string): Array<{ code: string; emoji: string }> => {
    const results: Array<{ code: string; emoji: string }> = []
    const lowerQuery = query.toLowerCase()

    for (const [code, emoji] of Object.entries(emojiMap)) {
      if (code.includes(lowerQuery)) {
        results.push({ code, emoji })
      }
    }

    return results
  }

  const getMarkdown = (code: string): string => {
    return `:${code}:`
  }

  return {
    transform,
    getEmoji,
    getAllEmojis,
    searchEmojis,
    getMarkdown,
    emojiMap
  }
}
