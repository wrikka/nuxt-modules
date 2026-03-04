import { ref, computed } from 'vue'

interface ReadingTimeOptions {
  wordsPerMinute?: number
  imagesPerMinute?: number
  codePerMinute?: number
}

interface ReadingTimeResult {
  minutes: number
  time: string
  words: number
}

export function useReadingTime(options: ReadingTimeOptions = {}) {
  const {
    wordsPerMinute = 200,
    imagesPerMinute = 12,
    codePerMinute = 30
  } = options

  const content = ref('')

  const result = computed<ReadingTimeResult>(() => {
    const text = content.value

    if (!text) {
      return {
        minutes: 0,
        time: '0 min read',
        words: 0
      }
    }

    // Count words
    const words = text
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks for word count
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .trim()
      .split(/\s+/)
      .filter(w => w.length > 0).length

    // Count images
    const images = (text.match(/!\[.*?\]\(.*?\)/g) || []).length +
                   (text.match(/<img[^>]+>/g) || []).length

    // Count code blocks
    const codeBlocks = (text.match(/```[\s\S]*?```/g) || []).length

    // Calculate reading time
    let readingTime = words / wordsPerMinute
    readingTime += (images * (1 / imagesPerMinute))
    readingTime += (codeBlocks * (1 / codePerMinute))

    // Round to nearest minute
    const minutes = Math.ceil(readingTime)

    // Format time string
    let timeString: string
    if (minutes < 1) {
      timeString = '< 1 min read'
    } else if (minutes === 1) {
      timeString = '1 min read'
    } else if (minutes < 60) {
      timeString = `${minutes} min read`
    } else {
      const hours = Math.floor(minutes / 60)
      const remainingMinutes = minutes % 60
      if (remainingMinutes === 0) {
        timeString = `${hours} hr read`
      } else {
        timeString = `${hours} hr ${remainingMinutes} min read`
      }
    }

    return {
      minutes,
      time: timeString,
      words
    }
  })

  const setContent = (newContent: string) => {
    content.value = newContent
  }

  const getReadingTime = (text: string): ReadingTimeResult => {
    content.value = text
    return result.value
  }

  return {
    content,
    result,
    setContent,
    getReadingTime
  }
}
