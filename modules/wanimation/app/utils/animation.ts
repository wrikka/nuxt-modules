import anime from 'animejs'
import type { EasingFunction } from '~/types/animation'

export const easings: Record<EasingFunction, string> = {
  linear: 'linear',
  ease: 'ease',
  easeIn: 'easeIn',
  easeOut: 'easeOut',
  easeInOut: 'easeInOut',
  easeInQuad: 'easeInQuad',
  easeInCubic: 'easeInCubic',
  easeInQuart: 'easeInQuart',
  easeInQuint: 'easeInQuint',
  easeInSine: 'easeInSine',
  easeInExpo: 'easeInExpo',
  easeInCirc: 'easeInCirc',
  easeInBack: 'easeInBack',
  easeOutQuad: 'easeOutQuad',
  easeOutCubic: 'easeOutCubic',
  easeOutQuart: 'easeOutQuart',
  easeOutQuint: 'easeOutQuint',
  easeOutSine: 'easeOutSine',
  easeOutExpo: 'easeOutExpo',
  easeOutCirc: 'easeOutCirc',
  easeOutBack: 'easeOutBack',
  easeInOutQuad: 'easeInOutQuad',
  easeInOutCubic: 'easeInOutCubic',
  easeInOutQuart: 'easeInOutQuart',
  easeInOutQuint: 'easeInOutQuint',
  easeInOutSine: 'easeInOutSine',
  easeInOutExpo: 'easeInOutExpo',
  easeInOutCirc: 'easeInOutCirc',
  easeInOutBack: 'easeInOutBack',
  spring: 'spring(1, 80, 10, 0)',
}

export const presets = {
  fadeIn: {
    opacity: [0, 1],
    easing: 'easeOutQuad',
  },
  fadeOut: {
    opacity: [1, 0],
    easing: 'easeInQuad',
  },
  slideUp: {
    translateY: [50, 0],
    opacity: [0, 1],
    easing: 'easeOutQuad',
  },
  slideDown: {
    translateY: [-50, 0],
    opacity: [0, 1],
    easing: 'easeOutQuad',
  },
  slideLeft: {
    translateX: [50, 0],
    opacity: [0, 1],
    easing: 'easeOutQuad',
  },
  slideRight: {
    translateX: [-50, 0],
    opacity: [0, 1],
    easing: 'easeOutQuad',
  },
  scaleIn: {
    scale: [0, 1],
    opacity: [0, 1],
    easing: 'easeOutBack',
  },
  scaleOut: {
    scale: [1, 0],
    opacity: [1, 0],
    easing: 'easeInBack',
  },
  bounceIn: {
    scale: [0, 1.2, 0.9, 1],
    opacity: [0, 1],
    easing: 'easeOutElastic',
  },
  rotateIn: {
    rotate: [-180, 0],
    opacity: [0, 1],
    easing: 'easeOutQuad',
  },
  rotateOut: {
    rotate: [0, 180],
    opacity: [1, 0],
    easing: 'easeInQuad',
  },
  flipInX: {
    rotateX: [-90, 0],
    opacity: [0, 1],
    easing: 'easeOutQuad',
  },
  flipInY: {
    rotateY: [-90, 0],
    opacity: [0, 1],
    easing: 'easeOutQuad',
  },
  zoomIn: {
    scale: [0.5, 1],
    opacity: [0, 1],
    easing: 'easeOutCubic',
  },
  zoomOut: {
    scale: [1, 0.5],
    opacity: [1, 0],
    easing: 'easeInCubic',
  },
  pulse: {
    scale: [1, 1.1, 1],
    easing: 'easeInOutQuad',
  },
  shake: {
    translateX: [0, -10, 10, -10, 10, 0],
    easing: 'easeInOutQuad',
  },
  swing: {
    rotate: [0, 15, -10, 5, -5, 0],
    easing: 'easeInOutQuad',
  },
  wobble: {
    translateX: [0, -25, 25, -25, 25, 0],
    rotate: [0, -5, 3, -3, 2, 0],
    easing: 'easeInOutQuad',
  },
  jello: {
    skewX: [0, -12.5, 6.25, -3.125, 1.5625, 0],
    skewY: [0, -12.5, 6.25, -3.125, 1.5625, 0],
    easing: 'easeInOutQuad',
  },
  heartBeat: {
    scale: [1, 1.3, 1, 1.3, 1],
    easing: 'easeInOutQuad',
  },
}

export const durations = {
  instant: 100,
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 800,
  verySlow: 1000,
}

export const springs = {
  default: 'spring(1, 80, 10, 0)',
  gentle: 'spring(1, 100, 10, 0)',
  wobbly: 'spring(1, 180, 12, 0)',
  stiff: 'spring(1, 210, 20, 0)',
  slow: 'spring(1, 280, 30, 0)',
  molasses: 'spring(1, 280, 120, 0)',
}
