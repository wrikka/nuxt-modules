import anime from 'animejs'
import type { StaggerOptions } from '~/types/animation'

export const useStagger = () => {
  const stagger = (
    value: number | string | (number | string)[],
    options: StaggerOptions = {}
  ): ((el: Element, i: number, l: number) => number | string) => {
    return anime.stagger(value, {
      start: options.start ?? 0,
      direction: options.direction ?? 'normal',
      easing: options.easing ?? 'linear',
      grid: options.grid,
      axis: options.axis ?? null,
      from: options.from ?? 'first',
    })
  }

  const staggerGrid = (
    rows: number,
    cols: number,
    value: number | string,
    options: Omit<StaggerOptions, 'grid'> = {}
  ): ((el: Element, i: number, l: number) => number | string) => {
    return stagger(value, {
      ...options,
      grid: [rows, cols],
    })
  }

  const staggerFromCenter = (
    rows: number,
    cols: number,
    value: number | string
  ): ((el: Element, i: number, l: number) => number | string) => {
    return staggerGrid(rows, cols, value, { from: 'center' })
  }

  const staggerFromEdges = (
    rows: number,
    cols: number,
    value: number | string
  ): ((el: Element, i: number, l: number) => number | string) => {
    return staggerGrid(rows, cols, value, { from: 'edges' })
  }

  return {
    stagger,
    staggerGrid,
    staggerFromCenter,
    staggerFromEdges,
  }
}
