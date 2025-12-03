/**
 * useHamFrequencies Hook
 * Custom hook for managing HAM radio frequencies with localStorage
 */

import { useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { HamFrequency } from '@/types'
import { STORAGE_KEYS } from '@/lib/constants'
import { generateId } from '@/lib/utils'
import { DEFAULT_HAM_FREQUENCIES } from '@/lib/defaultData'

export function useHamFrequencies() {
  const [frequencies, setFrequencies] = useLocalStorage<HamFrequency[]>(
    STORAGE_KEYS.HAM_FREQUENCIES,
    DEFAULT_HAM_FREQUENCIES
  )

  const addFrequency = useCallback((frequency: Omit<HamFrequency, 'id'>) => {
    const newFrequency: HamFrequency = {
      ...frequency,
      id: generateId()
    }
    setFrequencies(prev => [...prev, newFrequency])
    return newFrequency
  }, [setFrequencies])

  const updateFrequency = useCallback((id: string, updates: Partial<HamFrequency>) => {
    setFrequencies(prev =>
      prev.map(freq => (freq.id === id ? { ...freq, ...updates } : freq))
    )
  }, [setFrequencies])

  const deleteFrequency = useCallback((id: string) => {
    setFrequencies(prev => prev.filter(freq => freq.id !== id))
  }, [setFrequencies])

  const deleteMultiple = useCallback((ids: string[]) => {
    setFrequencies(prev => prev.filter(freq => !ids.includes(freq.id)))
  }, [setFrequencies])

  // Computed values
  const emergencyFrequencies = useMemo(() => 
    frequencies.filter(freq => freq.isEmergency),
    [frequencies]
  )

  const frequenciesByLocation = useMemo(() => {
    const grouped: Record<string, HamFrequency[]> = {}
    frequencies.forEach(freq => {
      if (!grouped[freq.location]) {
        grouped[freq.location] = []
      }
      grouped[freq.location].push(freq)
    })
    return grouped
  }, [frequencies])

  return {
    frequencies,
    setFrequencies,
    addFrequency,
    updateFrequency,
    deleteFrequency,
    deleteMultiple,
    emergencyFrequencies,
    frequenciesByLocation
  }
}
