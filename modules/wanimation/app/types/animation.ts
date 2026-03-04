import type anime from 'animejs'

export interface AnimationOptions {
  targets: string | Element | Element[] | NodeList | null
  duration?: number
  delay?: number | ((el: Element, i: number, l: number) => number)
  endDelay?: number
  easing?: string
  round?: number | boolean
  direction?: 'normal' | 'reverse' | 'alternate'
  loop?: number | boolean
  autoplay?: boolean
  // Transform properties
  translateX?: number | string | ((el: Element, i: number) => number | string)
  translateY?: number | string | ((el: Element, i: number) => number | string)
  translateZ?: number | string | ((el: Element, i: number) => number | string)
  rotate?: number | string | ((el: Element, i: number) => number | string)
  rotateX?: number | string | ((el: Element, i: number) => number | string)
  rotateY?: number | string | ((el: Element, i: number) => number | string)
  rotateZ?: number | string | ((el: Element, i: number) => number | string)
  scale?: number | ((el: Element, i: number) => number)
  scaleX?: number | ((el: Element, i: number) => number)
  scaleY?: number | ((el: Element, i: number) => number)
  scaleZ?: number | ((el: Element, i: number) => number)
  skewX?: number | string | ((el: Element, i: number) => number | string)
  skewY?: number | string | ((el: Element, i: number) => number | string)
  perspective?: number | string
  // CSS properties
  opacity?: number | ((el: Element, i: number) => number)
  color?: string | ((el: Element, i: number) => string)
  backgroundColor?: string | ((el: Element, i: number) => string)
  width?: number | string | ((el: Element, i: number) => number | string)
  height?: number | string | ((el: Element, i: number) => number | string)
  borderRadius?: number | string | ((el: Element, i: number) => number | string)
  // Callbacks
  begin?: (anim: anime.AnimeInstance) => void
  complete?: (anim: anime.AnimeInstance) => void
  update?: (anim: anime.AnimeInstance) => void
  // Keyframes
  keyframes?: Array<Record<string, unknown>>
}

export interface TimelineOptions {
  autoplay?: boolean
  direction?: 'normal' | 'reverse' | 'alternate'
  loop?: number | boolean
}

export interface StaggerOptions {
  start?: number
  direction?: 'normal' | 'reverse'
  easing?: string
  grid?: [number, number]
  axis?: 'x' | 'y' | null
  from?: 'center' | 'edges' | 'first' | 'last' | number
}

export type EasingFunction =
  | 'linear'
  | 'ease'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'easeInQuad'
  | 'easeInCubic'
  | 'easeInQuart'
  | 'easeInQuint'
  | 'easeInSine'
  | 'easeInExpo'
  | 'easeInCirc'
  | 'easeInBack'
  | 'easeOutQuad'
  | 'easeOutCubic'
  | 'easeOutQuart'
  | 'easeOutQuint'
  | 'easeOutSine'
  | 'easeOutExpo'
  | 'easeOutCirc'
  | 'easeOutBack'
  | 'easeInOutQuad'
  | 'easeInOutCubic'
  | 'easeInOutQuart'
  | 'easeInOutQuint'
  | 'easeInOutSine'
  | 'easeInOutExpo'
  | 'easeInOutCirc'
  | 'easeInOutBack'
  | 'spring'
  | string
