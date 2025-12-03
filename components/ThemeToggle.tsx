/**
 * ThemeToggle Component
 * Toggle button for switching between light and dark themes
 */

'use client'

import { Moon, Sun } from 'lucide-react'
import { useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'

export default function ThemeToggle() {
  const { theme, setTheme } = useApp()

  useEffect(() => {
    const root = window.document.documentElement
    
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2.5 rounded-xl bg-sand-100 dark:bg-forest-800 hover:bg-sand-200 dark:hover:bg-forest-700 border border-sand-200 dark:border-forest-700 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2 focus:ring-offset-sand-50 dark:focus:ring-offset-forest-950"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        {theme === 'light' ? (
          <Moon className="h-5 w-5 text-forest-600 dark:text-forest-400 transition-transform duration-300 group-hover:rotate-12" />
        ) : (
          <Sun className="h-5 w-5 text-amber-500 transition-transform duration-300 group-hover:rotate-45" />
        )}
      </div>
      
      {/* Glow effect on hover */}
      <div className={`absolute inset-0 rounded-xl transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${
        theme === 'light' 
          ? 'bg-gradient-to-br from-indigo-400/10 to-purple-400/10' 
          : 'bg-gradient-to-br from-amber-400/10 to-orange-400/10'
      }`} />
    </button>
  )
}
