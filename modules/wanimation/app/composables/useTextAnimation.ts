import anime from 'animejs'

export interface TextAnimationOptions {
  duration?: number
  delay?: number
  easing?: string
  stagger?: number
  direction?: 'normal' | 'reverse'
}

export const useTextAnimation = () => {
  const splitText = (
    element: HTMLElement | string,
    type: 'chars' | 'words' | 'lines' = 'chars'
  ): HTMLElement[] => {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof HTMLElement)) return []

    const text = el.textContent || ''
    el.innerHTML = ''

    const spans: HTMLElement[] = []

    if (type === 'chars') {
      for (const char of text) {
        if (char === ' ') {
          el.appendChild(document.createTextNode(' '))
        } else {
          const span = document.createElement('span')
          span.textContent = char
          span.style.display = 'inline-block'
          span.style.whiteSpace = 'pre'
          el.appendChild(span)
          spans.push(span)
        }
      }
    } else if (type === 'words') {
      const words = text.split(' ')
      for (let i = 0; i < words.length; i++) {
        const span = document.createElement('span')
        span.textContent = words[i]
        span.style.display = 'inline-block'
        span.style.whiteSpace = 'pre'
        el.appendChild(span)
        spans.push(span)
        if (i < words.length - 1) {
          el.appendChild(document.createTextNode(' '))
        }
      }
    } else if (type === 'lines') {
      const lines = text.split('\n')
      for (let i = 0; i < lines.length; i++) {
        const span = document.createElement('span')
        span.textContent = lines[i]
        span.style.display = 'block'
        el.appendChild(span)
        spans.push(span)
      }
    }

    return spans
  }

  const animateChars = (
    element: HTMLElement | string,
    animation: (el: HTMLElement, index: number) => Record<string, unknown>,
    options: TextAnimationOptions = {}
  ): anime.AnimeInstance => {
    const chars = splitText(element, 'chars')
    const { duration = 50, delay = 0, stagger = 50, easing = 'easeOutExpo' } = options

    return anime({
      targets: chars,
      ...animation(chars[0] || document.createElement('span'), 0),
      duration,
      delay,
      easing,
      delay: anime.stagger(stagger, { direction: options.direction }),
    })
  }

  const scramble = (
    element: HTMLElement | string,
    options: TextAnimationOptions & { chars?: string } = {}
  ): Promise<void> => {
    return new Promise((resolve) => {
      const el = typeof element === 'string'
        ? document.querySelector(element)
        : element

      if (!el || !(el instanceof HTMLElement)) {
        resolve()
        return
      }

      const finalText = el.textContent || ''
      const { duration = 1000, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' } = options
      const scrambleChars = chars.split('')

      let frame = 0
      const totalFrames = (duration / 1000) * 60 // 60fps
      const charProgress = new Array(finalText.length).fill(0)

      const animate = () => {
        let result = ''
        for (let i = 0; i < finalText.length; i++) {
          if (finalText[i] === ' ') {
            result += ' '
          } else {
            charProgress[i] += 1 / totalFrames
            if (charProgress[i] >= 1) {
              result += finalText[i]
            } else {
              result += scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
            }
          }
        }

        el.textContent = result
        frame++

        if (frame < totalFrames) {
          requestAnimationFrame(animate)
        } else {
          el.textContent = finalText
          resolve()
        }
      }

      animate()
    })
  }

  const typewriter = (
    element: HTMLElement | string,
    text: string,
    options: TextAnimationOptions & { cursor?: boolean; speed?: number } = {}
  ): Promise<void> => {
    return new Promise((resolve) => {
      const el = typeof element === 'string'
        ? document.querySelector(element)
        : element

      if (!el || !(el instanceof HTMLElement)) {
        resolve()
        return
      }

      const { speed = 50, cursor = true } = options
      let index = 0
      el.textContent = ''

      if (cursor) {
        el.classList.add('typewriter-cursor')
        el.style.borderRight = '2px solid currentColor'
        el.style.animation = 'blink 1s infinite'

        // Add blink animation
        if (!document.getElementById('typewriter-style')) {
          const style = document.createElement('style')
          style.id = 'typewriter-style'
          style.textContent = `
            @keyframes blink {
              0%, 50% { border-color: currentColor; }
              51%, 100% { border-color: transparent; }
            }
          `
          document.head.appendChild(style)
        }
      }

      const type = () => {
        if (index < text.length) {
          el.textContent += text[index]
          index++
          setTimeout(type, speed + (Math.random() * 30 - 15))
        } else {
          resolve()
        }
      }

      type()
    })
  }

  const wave = (
    element: HTMLElement | string,
    options: TextAnimationOptions & { amplitude?: number } = {}
  ): anime.AnimeInstance => {
    const chars = splitText(element, 'chars')
    const { amplitude = 20, duration = 1000, stagger = 50 } = options

    return anime({
      targets: chars,
      translateY: [
        { value: -amplitude, duration: duration / 2 },
        { value: amplitude, duration: duration / 2 },
        { value: 0, duration: duration / 4 },
      ],
      delay: anime.stagger(stagger),
      easing: 'easeInOutSine',
      loop: true,
    })
  }

  const decode = (
    element: HTMLElement | string,
    options: TextAnimationOptions & { chars?: string; revealDelay?: number } = {}
  ): Promise<void> => {
    return new Promise((resolve) => {
      const el = typeof element === 'string'
        ? document.querySelector(element)
        : element

      if (!el || !(el instanceof HTMLElement)) {
        resolve()
        return
      }

      const finalText = el.textContent || ''
      const { chars = '!@#$%^&*()_+-=[]{}|;:,.<>?', revealDelay = 100 } = options
      const scrambleChars = chars.split('')

      const spans = splitText(el, 'chars')
      const totalDuration = spans.length * revealDelay + 500

      spans.forEach((span, index) => {
        const char = finalText[index]
        if (char === ' ') return

        span.style.opacity = '0'

        setTimeout(() => {
          let iterations = 0
          const maxIterations = 5

          const scrambleChar = () => {
            if (iterations < maxIterations) {
              span.textContent = scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
              span.style.opacity = '1'
              iterations++
              setTimeout(scrambleChar, 50)
            } else {
              span.textContent = char
            }
          }

          scrambleChar()
        }, index * revealDelay)
      })

      setTimeout(resolve, totalDuration)
    })
  }

  return {
    splitText,
    animateChars,
    scramble,
    typewriter,
    wave,
    decode,
  }
}
