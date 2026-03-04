import anime from 'animejs'

export interface LiquidMorphOptions {
  duration?: number
  color?: string
  turbulence?: number
  speed?: number
  size?: number
}

export const useLiquidMorph = () => {
  const createBlob = (
    container: HTMLElement | string,
    options: LiquidMorphOptions = {}
  ): { destroy: () => void } => {
    const el = typeof container === 'string'
      ? document.querySelector(container)
      : container

    if (!el || !(el instanceof HTMLElement)) {
      return { destroy: () => {} }
    }

    const {
      duration = 8000,
      color = '#4ecdc4',
      turbulence = 20,
      size = 200,
    } = options

    // Create SVG blob
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('viewBox', '0 0 200 200')
    svg.setAttribute('width', String(size))
    svg.setAttribute('height', String(size))
    svg.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      overflow: visible;
    `

    // Create gradient
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient')
    gradient.setAttribute('id', 'blob-gradient')

    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
    stop1.setAttribute('offset', '0%')
    stop1.setAttribute('stop-color', color)
    stop1.setAttribute('stop-opacity', '0.8')

    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
    stop2.setAttribute('offset', '100%')
    stop2.setAttribute('stop-color', color)
    stop2.setAttribute('stop-opacity', '0.3')

    gradient.appendChild(stop1)
    gradient.appendChild(stop2)
    defs.appendChild(gradient)
    svg.appendChild(defs)

    // Create blob path
    const blob = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    blob.setAttribute('fill', 'url(#blob-gradient)')
    svg.appendChild(blob)

    el.style.position = 'relative'
    el.appendChild(svg)

    // Generate blob path
    const generateBlobPath = (progress: number): string => {
      const points: string[] = []
      const numPoints = 8
      const angleStep = (Math.PI * 2) / numPoints

      for (let i = 0; i < numPoints; i++) {
        const angle = i * angleStep + progress * Math.PI
        const noise = Math.sin(angle * 3 + progress * Math.PI * 2) * turbulence
        const r = 100 + noise
        const x = 100 + r * Math.cos(angle)
        const y = 100 + r * Math.sin(angle)
        points.push(`${x},${y}`)
      }

      // Create smooth path using catmull-rom spline
      let path = `M${points[0]} `
      for (let i = 0; i < points.length; i++) {
        const p0 = points[(i - 1 + points.length) % points.length].split(',').map(Number)
        const p1 = points[i].split(',').map(Number)
        const p2 = points[(i + 1) % points.length].split(',').map(Number)
        const p3 = points[(i + 2) % points.length].split(',').map(Number)

        const cp1x = p1[0] + (p2[0] - p0[0]) / 6
        const cp1y = p1[1] + (p2[1] - p0[1]) / 6
        const cp2x = p2[0] - (p3[0] - p1[0]) / 6
        const cp2y = p2[1] - (p3[1] - p1[1]) / 6

        path += `C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]} `
      }
      path += 'Z'

      return path
    }

    // Animate
    const animObj = { progress: 0 }
    const anim = anime({
      targets: animObj,
      progress: 1,
      duration,
      loop: true,
      easing: 'linear',
      update: () => {
        blob.setAttribute('d', generateBlobPath(animObj.progress))
      },
    })

    return {
      destroy: () => {
        anim.pause()
        svg.remove()
      },
    }
  }

  const morphBetween = (
    element: SVGPathElement | string,
    paths: string[],
    options: { duration?: number; easing?: string } = {}
  ): anime.AnimeInstance => {
    const el = typeof element === 'string'
      ? document.querySelector(element)
      : element

    if (!el || !(el instanceof SVGPathElement)) {
      return anime({ targets: null, duration: 0 })
    }

    const { duration = 2000, easing = 'easeInOutQuad' } = options

    // Simple path interpolation
    const interpolatePath = (from: string, to: string, progress: number): string => {
      const fromNums = (from.match(/-?\d+\.?\d*/g) || []).map(Number)
      const toNums = (to.match(/-?\d+\.?\d*/g) || []).map(Number)

      if (fromNums.length !== toNums.length) return to

      let idx = 0
      return from.replace(/-?\d+\.?\d*/g, () => {
        const val = fromNums[idx] + (toNums[idx] - fromNums[idx]) * progress
        idx++
        return String(Math.round(val * 100) / 100)
      })
    }

    let currentPath = 0
    const animObj = { progress: 0 }

    return anime({
      targets: animObj,
      progress: 1,
      duration: duration / paths.length,
      loop: true,
      easing,
      update: () => {
        const from = paths[currentPath]
        const to = paths[(currentPath + 1) % paths.length]
        el.setAttribute('d', interpolatePath(from, to, animObj.progress))

        if (animObj.progress >= 1) {
          currentPath = (currentPath + 1) % paths.length
          animObj.progress = 0
        }
      },
    })
  }

  return {
    createBlob,
    morphBetween,
  }
}
