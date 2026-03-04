import anime from 'animejs'

export interface Transform3DOptions {
  rotateX?: number
  rotateY?: number
  rotateZ?: number
  translateX?: number | string
  translateY?: number | string
  translateZ?: number | string
  scale?: number
  scaleX?: number
  scaleY?: number
  perspective?: number
  origin?: string
}

export interface Flip3DOptions {
  duration?: number
  easing?: string
  axis?: 'horizontal' | 'vertical'
  backfaceContent?: string
}

export const use3DTransforms = () => {
  const transform = (
    targets: string | Element | Element[] | NodeList | null,
    options: Transform3DOptions & { duration?: number; easing?: string },
    animationOptions: { duration?: number; easing?: string; delay?: number } = {}
  ): anime.AnimeInstance => {
    const {
      rotateX = 0,
      rotateY = 0,
      rotateZ = 0,
      translateX = 0,
      translateY = 0,
      translateZ = 0,
      scale = 1,
      scaleX = 1,
      scaleY = 1,
      perspective = 1000,
      origin = 'center center',
      duration = 600,
      easing = 'easeOutQuad',
      delay = 0,
    } = { ...options, ...animationOptions }

    const elements = getElements(targets)

    for (const el of elements) {
      const parent = el.parentElement
      if (parent) {
        parent.style.perspective = `${perspective}px`
      }
      ;(el as HTMLElement).style.transformStyle = 'preserve-3d'
      ;(el as HTMLElement).style.transformOrigin = origin
    }

    return anime({
      targets,
      rotateX,
      rotateY,
      rotateZ,
      translateX,
      translateY,
      translateZ,
      scale,
      scaleX,
      scaleY,
      duration,
      easing,
      delay,
    })
  }

  const flip = (
    element: HTMLElement | string,
    options: Flip3DOptions = {}
  ): { front: HTMLElement; back: HTMLElement; flip: () => void } => {
    const { duration = 600, easing = 'easeInOutQuad', axis = 'horizontal' } = options

    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof HTMLElement)) {
      throw new Error('Invalid element')
    }

    // Set up container
    el.style.perspective = '1000px'
    el.style.position = 'relative'

    // Create front and back faces
    const front = document.createElement('div')
    const back = document.createElement('div')

    front.className = 'flip-face flip-front'
    back.className = 'flip-face flip-back'

    // Copy content
    front.innerHTML = el.innerHTML
    back.innerHTML = options.backfaceContent || ''

    el.innerHTML = ''
    el.appendChild(front)
    el.appendChild(back)

    // Style both faces
    const faceStyles: Partial<CSSStyleDeclaration> = {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backfaceVisibility: 'hidden',
      transformStyle: 'preserve-3d',
    }

    Object.assign(front.style, faceStyles)
    Object.assign(back.style, faceStyles)

    back.style.transform = axis === 'horizontal' ? 'rotateY(180deg)' : 'rotateX(180deg)'

    let isFlipped = false

    const doFlip = () => {
      isFlipped = !isFlipped

      const rotateValue = isFlipped ? 180 : 0
      const prop = axis === 'horizontal' ? 'rotateY' : 'rotateX'

      anime({
        targets: [front, back],
        [prop]: (el: Element) => {
          const current = anime.get(el, prop) as number || 0
          return current + (isFlipped ? 180 : -180)
        },
        duration,
        easing,
      })
    }

    return {
      front,
      back,
      flip: doFlip,
    }
  }

  const card3D = (
    element: HTMLElement | string,
    options: {
      intensity?: number
      perspective?: number
    } = {}
  ): (() => void) => {
    const { intensity = 15, perspective = 1000 } = options

    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof HTMLElement)) {
      return () => {}
    }

    el.style.perspective = `${perspective}px`
    el.style.transformStyle = 'preserve-3d'

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const mouseX = e.clientX - centerX
      const mouseY = e.clientY - centerY

      const rotateY = (mouseX / (rect.width / 2)) * intensity
      const rotateX = -(mouseY / (rect.height / 2)) * intensity

      anime({
        targets: el,
        rotateX,
        rotateY,
        duration: 100,
        easing: 'easeOutQuad',
      })
    }

    const handleMouseLeave = () => {
      anime({
        targets: el,
        rotateX: 0,
        rotateY: 0,
        duration: 300,
        easing: 'easeOutQuad',
      })
    }

    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }

  const cube = (
    container: HTMLElement | string,
    faces: { front?: string; back?: string; left?: string; right?: string; top?: string; bottom?: string },
    options: { size?: number; perspective?: number } = {}
  ): { rotateX: (deg: number) => void; rotateY: (deg: number) => void } => {
    const { size = 200, perspective = 1000 } = options

    const containerEl = typeof container === 'string'
      ? document.querySelector(container)
      : container

    if (!containerEl || !(containerEl instanceof HTMLElement)) {
      throw new Error('Invalid container')
    }

    containerEl.style.perspective = `${perspective}px`
    containerEl.style.width = `${size}px`
    containerEl.style.height = `${size}px`

    const cubeEl = document.createElement('div')
    cubeEl.className = 'cube-3d'
    cubeEl.style.width = '100%'
    cubeEl.style.height = '100%'
    cubeEl.style.position = 'relative'
    cubeEl.style.transformStyle = 'preserve-3d'

    const faceData = [
      { name: 'front', transform: `translateZ(${size / 2}px)`, content: faces.front },
      { name: 'back', transform: `rotateY(180deg) translateZ(${size / 2}px)`, content: faces.back },
      { name: 'left', transform: `rotateY(-90deg) translateZ(${size / 2}px)`, content: faces.left },
      { name: 'right', transform: `rotateY(90deg) translateZ(${size / 2}px)`, content: faces.right },
      { name: 'top', transform: `rotateX(90deg) translateZ(${size / 2}px)`, content: faces.top },
      { name: 'bottom', transform: `rotateX(-90deg) translateZ(${size / 2}px)`, content: faces.bottom },
    ]

    for (const face of faceData) {
      if (!face.content) continue
      const faceEl = document.createElement('div')
      faceEl.className = `cube-face cube-${face.name}`
      faceEl.innerHTML = face.content
      faceEl.style.cssText = `
        position: absolute;
        width: 100%;
        height: 100%;
        transform: ${face.transform};
        backface-visibility: hidden;
      `
      cubeEl.appendChild(faceEl)
    }

    containerEl.innerHTML = ''
    containerEl.appendChild(cubeEl)

    let currentRotateX = 0
    let currentRotateY = 0

    const rotateX = (deg: number) => {
      currentRotateX += deg
      anime({
        targets: cubeEl,
        rotateX: currentRotateX,
        duration: 600,
        easing: 'easeOutQuad',
      })
    }

    const rotateY = (deg: number) => {
      currentRotateY += deg
      anime({
        targets: cubeEl,
        rotateY: currentRotateY,
        duration: 600,
        easing: 'easeOutQuad',
      })
    }

    return { rotateX, rotateY }
  }

  return {
    transform,
    flip,
    card3D,
    cube,
  }
}

const getElements = (targets: string | Element | Element[] | NodeList | null): Element[] => {
  if (!targets) return []
  if (typeof targets === 'string') {
    return Array.from(document.querySelectorAll(targets))
  }
  if (targets instanceof Element) {
    return [targets]
  }
  if (targets instanceof NodeList) {
    return Array.from(targets)
  }
  return targets
}
