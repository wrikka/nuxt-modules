import { describe, it, expect, vi } from 'vitest'
import { useImageEditor } from '../../runtime/composables/useImageEditor'

describe('useImageEditor', () => {
  it('should initialize with default state', () => {
    const { state } = useImageEditor()

    expect(state.canvas).toBeNull()
    expect(state.ctx).toBeNull()
    expect(state.scale).toBe(1)
    expect(state.rotation).toBe(0)
    expect(state.flipX).toBe(false)
    expect(state.flipY).toBe(false)
  })

  it('should rotate correctly', () => {
    const { state, rotate } = useImageEditor()

    rotate(90)
    expect(state.rotation).toBe(90)

    rotate(90)
    expect(state.rotation).toBe(180)

    rotate(-90)
    expect(state.rotation).toBe(90)
  })

  it('should flip correctly', () => {
    const { state, flip } = useImageEditor()

    flip('x')
    expect(state.flipX).toBe(true)

    flip('x')
    expect(state.flipX).toBe(false)

    flip('y')
    expect(state.flipY).toBe(true)
  })

  it('should update filters', () => {
    const { state, setFilter } = useImageEditor()

    setFilter('grayscale', 50)
    expect(state.filters.grayscale).toBe(50)

    setFilter('brightness', 150)
    expect(state.filters.brightness).toBe(150)
  })

  it('should reset filters', () => {
    const { state, setFilter, resetFilters } = useImageEditor()

    setFilter('grayscale', 100)
    setFilter('sepia', 50)
    resetFilters()

    expect(state.filters.grayscale).toBe(0)
    expect(state.filters.sepia).toBe(0)
    expect(state.filters.brightness).toBe(100)
  })
})
