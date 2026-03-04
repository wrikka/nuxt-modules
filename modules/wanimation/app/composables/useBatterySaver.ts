export interface BatterySaverOptions {
  threshold?: number
  onBatteryLow?: () => void
  onBatteryNormal?: () => void
  reduceAnimations?: boolean
  disableParticles?: boolean
}

export const useBatterySaver = () => {
  let battery: BatteryManager | null = null

  const init = async (options: BatterySaverOptions = {}): Promise<() => void> => {
    const {
      threshold = 0.2,
      onBatteryLow,
      onBatteryNormal,
      reduceAnimations = true,
      disableParticles = true,
    } = options

    if (!('getBattery' in navigator)) {
      return () => {}
    }

    try {
      battery = await (navigator as unknown as { getBattery: () => Promise<BatteryManager> }).getBattery()

      const handleLevelChange = () => {
        const level = battery?.level ?? 1
        const isLow = level < threshold

        if (isLow) {
          onBatteryLow?.()

          if (reduceAnimations) {
            document.documentElement.style.setProperty('--animation-duration-scale', '0.5')
          }

          if (disableParticles) {
            document.documentElement.classList.add('battery-saver')
          }
        } else {
          onBatteryNormal?.()
          document.documentElement.style.removeProperty('--animation-duration-scale')
          document.documentElement.classList.remove('battery-saver')
        }
      }

      battery.addEventListener('levelchange', handleLevelChange)
      handleLevelChange()

      return () => {
        battery?.removeEventListener('levelchange', handleLevelChange)
      }
    } catch {
      return () => {}
    }
  }

  const isBatteryLow = (): boolean => {
    return (battery?.level ?? 1) < 0.2
  }

  const getBatteryLevel = (): number => {
    return battery?.level ?? 1
  }

  return {
    init,
    isBatteryLow,
    getBatteryLevel,
  }
}

interface BatteryManager extends EventTarget {
  charging: boolean
  chargingTime: number
  dischargingTime: number
  level: number
}
