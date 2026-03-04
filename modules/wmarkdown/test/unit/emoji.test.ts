import { describe, it, expect } from 'vitest'
import { getEmoji, getAllEmojis } from '../../src/runtime/utils/emoji'

describe('Emoji', () => {
  it('should return emoji for known shortcode', () => {
    expect(getEmoji('smile')).toBe('😄')
    expect(getEmoji('heart')).toBe('❤️')
    expect(getEmoji('rocket')).toBe('🚀')
  })

  it('should return original shortcode for unknown emoji', () => {
    expect(getEmoji('unknown_emoji')).toBe(':unknown_emoji:')
  })

  it('should return all emojis', () => {
    const emojis = getAllEmojis()
    expect(Object.keys(emojis).length).toBeGreaterThan(100)
    expect(emojis['smile']).toBe('😄')
  })
})
