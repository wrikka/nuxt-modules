import anime from 'animejs'

export interface LottieOptions {
  src: string
  loop?: boolean
  autoplay?: boolean
  speed?: number
  direction?: number
}

export interface LottieInstance {
  play: () => void
  pause: () => void
  stop: () => void
  setSpeed: (speed: number) => void
  setDirection: (direction: number) => void
  goToAndPlay: (frame: number) => void
  goToAndStop: (frame: number) => void
  playSegments: (segments: [number, number]) => void
  destroy: () => void
}

export const useLottie = () => {
  const load = async (
    container: HTMLElement | string,
    options: LottieOptions
  ): Promise<LottieInstance> => {
    const containerEl = typeof container === 'string'
      ? document.querySelector(container)
      : container

    if (!containerEl || !(containerEl instanceof HTMLElement)) {
      throw new Error('Invalid container element')
    }

    // Dynamic import of lottie-web
    const lottieModule = await import('lottie-web')
    const lottie = lottieModule.default

    const anim = lottie.loadAnimation({
      container: containerEl,
      renderer: 'svg',
      loop: options.loop ?? true,
      autoplay: options.autoplay ?? true,
      path: options.src,
    })

    if (options.speed) {
      anim.setSpeed(options.speed)
    }
    if (options.direction) {
      anim.setDirection(options.direction)
    }

    return {
      play: () => anim.play(),
      pause: () => anim.pause(),
      stop: () => anim.stop(),
      setSpeed: (speed: number) => anim.setSpeed(speed),
      setDirection: (direction: number) => anim.setDirection(direction),
      goToAndPlay: (frame: number) => anim.goToAndPlay(frame, true),
      goToAndStop: (frame: number) => anim.goToAndStop(frame, true),
      playSegments: (segments: [number, number]) => anim.playSegments(segments, true),
      destroy: () => anim.destroy(),
    }
  }

  const createLottieElement = (
    animationData: unknown,
    options: Omit<LottieOptions, 'src'> = {}
  ): Promise<LottieInstance> => {
    return new Promise((resolve, reject) => {
      // Create a container
      const container = document.createElement('div')
      container.style.width = '100%'
      container.style.height = '100%'

      import('lottie-web').then((lottieModule) => {
        const lottie = lottieModule.default
        const anim = lottie.loadAnimation({
          container,
          renderer: 'svg',
          loop: options.loop ?? true,
          autoplay: options.autoplay ?? true,
          animationData,
        })

        resolve({
          play: () => anim.play(),
          pause: () => anim.pause(),
          stop: () => anim.stop(),
          setSpeed: (speed: number) => anim.setSpeed(speed),
          setDirection: (direction: number) => anim.setDirection(direction),
          goToAndPlay: (frame: number) => anim.goToAndPlay(frame, true),
          goToAndStop: (frame: number) => anim.goToAndStop(frame, true),
          playSegments: (segments: [number, number]) => anim.playSegments(segments, true),
          destroy: () => anim.destroy(),
        })
      }).catch(reject)
    })
  }

  const animateToFrame = (
    lottieInstance: LottieInstance,
    frame: number,
    duration: number = 500
  ): Promise<void> => {
    return new Promise((resolve) => {
      const startFrame = 0 // We would need to track current frame
      const animObj = { progress: startFrame }

      anime({
        targets: animObj,
        progress: frame,
        duration,
        easing: 'easeInOutQuad',
        update: () => {
          lottieInstance.goToAndStop(Math.round(animObj.progress))
        },
        complete: () => resolve(),
      })
    })
  }

  const playSegmentsWithTransition = (
    lottieInstance: LottieInstance,
    segments: Array<[number, number]>,
    options: {
      transitionDuration?: number
      pauseBetween?: number
    } = {}
  ): Promise<void> => {
    const { transitionDuration = 300, pauseBetween = 0 } = options

    return new Promise((resolve) => {
      let currentIndex = 0

      const playNext = () => {
        if (currentIndex >= segments.length) {
          resolve()
          return
        }

        const [start, end] = segments[currentIndex]
        lottieInstance.playSegments([start, end])

        // Calculate duration based on frame count and lottie speed
        const frameDuration = ((end - start) / 30) * 1000 // Assuming 30fps

        setTimeout(() => {
          currentIndex++
          if (currentIndex < segments.length) {
            setTimeout(playNext, pauseBetween)
          } else {
            resolve()
          }
        }, frameDuration + transitionDuration)
      }

      playNext()
    })
  }

  return {
    load,
    createLottieElement,
    animateToFrame,
    playSegmentsWithTransition,
  }
}
