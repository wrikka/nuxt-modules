import { ref } from 'vue'

interface AutolinkOptions {
  urls?: boolean
  emails?: boolean
  mentions?: boolean
  hashtags?: boolean
}

const urlRegex = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g
const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
const mentionRegex = /@[a-zA-Z0-9_]+/g
const hashtagRegex = /#[a-zA-Z0-9_]+/g

export function useAutolink(options: AutolinkOptions = {}) {
  const {
    urls = true,
    emails = true,
    mentions = false,
    hashtags = false
  } = options

  const transform = (text: string): string => {
    let result = text

    // URLs
    if (urls) {
      result = result.replace(urlRegex, (match) => {
        try {
          const url = new URL(match)
          return `<a href="${match}" class="autolink" target="_blank" rel="noopener noreferrer">${url.hostname}${url.pathname}</a>`
        } catch {
          return `<a href="${match}" class="autolink" target="_blank" rel="noopener noreferrer">${match}</a>`
        }
      })
    }

    // Emails
    if (emails) {
      result = result.replace(emailRegex, (match) => {
        return `<a href="mailto:${match}" class="autolink email">${match}</a>`
      })
    }

    // Mentions (@username)
    if (mentions) {
      result = result.replace(mentionRegex, (match) => {
        const username = match.slice(1)
        return `<a href="/user/${username}" class="autolink mention">${match}</a>`
      })
    }

    // Hashtags (#tag)
    if (hashtags) {
      result = result.replace(hashtagRegex, (match) => {
        const tag = match.slice(1)
        return `<a href="/tag/${tag}" class="autolink hashtag">${match}</a>`
      })
    }

    return result
  }

  const extractUrls = (text: string): string[] => {
    const matches = text.match(urlRegex)
    return matches || []
  }

  const extractEmails = (text: string): string[] => {
    const matches = text.match(emailRegex)
    return matches || []
  }

  const extractMentions = (text: string): string[] => {
    const matches = text.match(mentionRegex)
    return matches ? matches.map(m => m.slice(1)) : []
  }

  const extractHashtags = (text: string): string[] => {
    const matches = text.match(hashtagRegex)
    return matches ? matches.map(m => m.slice(1)) : []
  }

  return {
    transform,
    extractUrls,
    extractEmails,
    extractMentions,
    extractHashtags
  }
}
