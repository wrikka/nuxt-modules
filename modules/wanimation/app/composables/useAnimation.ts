import anime from 'animejs'
import type { AnimationOptions } from '~/types/animation'

export const useAnimation = () => {
  const animations = new Map<string, anime.AnimeInstance>()

  const animate = (key: string, options: AnimationOptions): anime.AnimeInstance => {
    // Remove existing animation if present
    if (animations.has(key)) {
      const existing = animations.get(key)
      existing?.pause()
      anime.remove(existing?.animatables.map(a => a.target))
    }

    const anim = anime({
      ...options,
      autoplay: options.autoplay ?? true,
    })

    animations.set(key, anim)
    return anim
  }

  const pause = (key: string): void => {
    animations.get(key)?.pause()
  }

  const play = (key: string): void => {
    animations.get(key)?.play()
  }

  const restart = (key: string): void => {
    animations.get(key)?.restart()
  }

  const reverse = (key: string): void => {
    const anim = animations.get(key)
    if (anim) {
      anim.reverse()
      anim.play()
    }
  }

  const seek = (key: string, time: number): void => {
    const anim = animations.get(key)
    if (anim) {
      anim.seek(time)
    }
  }

  const remove = (key: string): void => {
    const anim = animations.get(key)
    if (anim) {
      anime.remove(anim.animatables.map(a => a.target))
      anim.pause()
      animations.delete(key)
    }
  }

  const removeAll = (): void => {
    for (const [key, anim] of animations) {
      anime.remove(anim.animatables.map(a => a.target))
      anim.pause()
    }
    animations.clear()
  }

  const isRunning = (key: string): boolean => {
    const anim = animations.get(key)
    return anim ? !anim.paused && !anim.completed : false
  }

  const getProgress = (key: string): number => {
    const anim = animations.get(key)
    return anim ? (anim.currentTime / anim.duration) * 100 : 0
  }

  return {
    animate,
    pause,
    play,
    restart,
    reverse,
    seek,
    remove,
    removeAll,
    isRunning,
    getProgress,
  }
}
