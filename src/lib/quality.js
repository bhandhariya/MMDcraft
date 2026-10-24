import { useEffect, useState } from 'react'

export function detectQuality() {
  if (typeof window === 'undefined') return 'high'
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) return 'off'
  const saveData = navigator.connection?.saveData
  const mobile = window.matchMedia('(max-width: 767px)').matches
  const cores = navigator.hardwareConcurrency || 8
  if (saveData || (mobile && cores <= 4)) return 'lite'
  if (mobile) return 'medium'
  return 'high'
}

export function useQuality() {
  const [quality, setQuality] = useState(detectQuality)

  useEffect(() => {
    const update = () => {
      const next = detectQuality()
      setQuality(next)
      document.documentElement.dataset.motion = next === 'off' ? 'reduce' : 'ok'
    }
    update()
    const queries = [
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(max-width: 767px)'),
    ]
    queries.forEach((query) => query.addEventListener('change', update))
    window.addEventListener('resize', update)
    return () => {
      queries.forEach((query) => query.removeEventListener('change', update))
      window.removeEventListener('resize', update)
    }
  }, [])

  return quality
}
