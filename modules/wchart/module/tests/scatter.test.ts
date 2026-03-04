import { describe, it, expect } from 'vitest'
import { generateScatterData, calculateCorrelation, findOutliers } from '../src/runtime/charts/scatter'

describe('Scatter Chart Functions', () => {
  describe('generateScatterData', () => {
    it('should generate scatter data with correct structure', () => {
      const xValues = [1, 2, 3, 4, 5]
      const yValues = [10, 20, 30, 40, 50]
      const result = generateScatterData(xValues, yValues, { title: 'Test Scatter', seriesName: 'Points' })

      expect(result).toHaveProperty('title', 'Test Scatter')
      expect(result.series).toHaveLength(1)
      expect(result.series[0]).toHaveProperty('name', 'Points')
      expect(result.series[0].data).toHaveLength(5)
      expect(result.series[0].data[0]).toHaveProperty('x', 1)
      expect(result.series[0].data[0]).toHaveProperty('y', 10)
    })

    it('should use default series name if not provided', () => {
      const xValues = [1, 2]
      const yValues = [10, 20]
      const result = generateScatterData(xValues, yValues)

      expect(result.series[0]).toHaveProperty('name', 'Points')
    })
  })

  describe('calculateCorrelation', () => {
    it('should calculate perfect positive correlation', () => {
      const data = {
        series: [{
          data: [
            { x: 1, y: 10 },
            { x: 2, y: 20 },
            { x: 3, y: 30 }
          ]
        }]
      }

      const correlation = calculateCorrelation(data)
      expect(correlation).toBeCloseTo(1, 5)
    })

    it('should calculate perfect negative correlation', () => {
      const data = {
        series: [{
          data: [
            { x: 1, y: 30 },
            { x: 2, y: 20 },
            { x: 3, y: 10 }
          ]
        }]
      }

      const correlation = calculateCorrelation(data)
      expect(correlation).toBeCloseTo(-1, 5)
    })

    it('should return 0 for no correlation', () => {
      const data = {
        series: [{
          data: [
            { x: 1, y: 10 },
            { x: 2, y: 10 },
            { x: 3, y: 10 }
          ]
        }]
      }

      const correlation = calculateCorrelation(data)
      expect(correlation).toBe(0)
    })
  })

  describe('findOutliers', () => {
    it('should identify outliers using IQR method', () => {
      const data = {
        series: [{
          data: [
            { x: 1, y: 10 },
            { x: 2, y: 12 },
            { x: 3, y: 14 },
            { x: 4, y: 16 },
            { x: 5, y: 100 } // outlier
          ]
        }]
      }

      const { outliers, inliers } = findOutliers(data)
      expect(outliers).toHaveLength(1)
      expect(outliers[0]).toHaveProperty('y', 100)
      expect(inliers).toHaveLength(4)
    })

    it('should return empty arrays for no data', () => {
      const data = {
        series: []
      }

      const { outliers, inliers } = findOutliers(data)
      expect(outliers).toHaveLength(0)
      expect(inliers).toHaveLength(0)
    })
  })
})
