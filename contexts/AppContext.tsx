/**
 * AppContext - Global State Management
 * Provides app-wide state including theme, family info, and metrics settings
 */

'use client'

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { FamilyInfo, MetricsSettings, Theme } from '@/types'
import { STORAGE_KEYS } from '@/lib/constants'
import { DEFAULT_FAMILY_INFO, DEFAULT_METRICS_SETTINGS } from '@/lib/defaultData'

interface AppContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  familyInfo: FamilyInfo
  setFamilyInfo: (info: FamilyInfo | ((prev: FamilyInfo) => FamilyInfo)) => void
  metricsSettings: MetricsSettings
  setMetricsSettings: (settings: MetricsSettings | ((prev: MetricsSettings) => MetricsSettings)) => void
  isLoading: boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [theme, setTheme] = useLocalStorage<Theme>(STORAGE_KEYS.THEME, 'light')
  const [familyInfo, setFamilyInfo] = useLocalStorage<FamilyInfo>(
    STORAGE_KEYS.FAMILY_INFO,
    DEFAULT_FAMILY_INFO
  )
  const [metricsSettings, setMetricsSettings] = useLocalStorage<MetricsSettings>(
    STORAGE_KEYS.METRICS_SETTINGS,
    DEFAULT_METRICS_SETTINGS
  )

  // Handle initial loading state
  useEffect(() => {
    setIsLoading(false)
  }, [])

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        familyInfo,
        setFamilyInfo,
        metricsSettings,
        setMetricsSettings,
        isLoading
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
