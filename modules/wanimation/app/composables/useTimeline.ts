import anime from 'animejs'
import type { TimelineOptions, AnimationOptions } from '~/types/animation'

export const useTimeline = () => {
  const timelines = new Map<string, anime.AnimeTimelineInstance>()

  const create = (key: string, options: TimelineOptions = {}): anime.AnimeTimelineInstance => {
    // Remove existing timeline if present
    if (timelines.has(key)) {
      const existing = timelines.get(key)
      existing?.pause()
      anime.remove(existing?.animatables.map(a => a.target))
    }

    const tl = anime.timeline({
      autoplay: options.autoplay ?? true,
      direction: options.direction ?? 'normal',
      loop: options.loop ?? false,
    })

    timelines.set(key, tl)
    return tl
  }

  const add = (
    key: string,
    options: Partial<AnimationOptions>,
    offset?: number | string
  ): anime.AnimeTimelineInstance | null => {
    const tl = timelines.get(key)
    if (!tl) return null

    tl.add(options, offset)
    return tl
  }

  const play = (key: string): void => {
    timelines.get(key)?.play()
  }

  const pause = (key: string): void => {
    timelines.get(key)?.pause()
  }

  const restart = (key: string): void => {
    timelines.get(key)?.restart()
  }

  const reverse = (key: string): void => {
    const tl = timelines.get(key)
    if (tl) {
      tl.reverse()
      tl.play()
    }
  }

  const seek = (key: string, time: number): void => {
    timelines.get(key)?.seek(time)
  }

  const remove = (key: string): void => {
    const tl = timelines.get(key)
    if (tl) {
      anime.remove(tl.animatables.map(a => a.target))
      tl.pause()
      timelines.delete(key)
    }
  }

  const removeAll = (): void => {
    for (const [key, tl] of timelines) {
      anime.remove(tl.animatables.map(a => a.target))
      tl.pause()
    }
    timelines.clear()
  }

  const getProgress = (key: string): number => {
    const tl = timelines.get(key)
    return tl ? (tl.currentTime / tl.duration) * 100 : 0
  }

  return {
    create,
    add,
    play,
    pause,
    restart,
    reverse,
    seek,
    remove,
    removeAll,
    getProgress,
  }
}
