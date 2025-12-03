/**
 * Main Home Page Component
 * Refactored with performance optimizations, accessibility, dark mode, and improved UX
 */

'use client'

import { useState, useMemo, useCallback } from 'react'
import { Shield, Users, BookOpen, Radio, FileText, Download, Menu, X } from 'lucide-react'
import ChecklistSection from '@/components/ChecklistSection'
import PantryManager from '@/components/PantryManager'
import BooksManager from '@/components/BooksManager'
import EmergencyContacts from '@/components/EmergencyContacts'
import HamRadioFrequencies from '@/components/HamRadioFrequencies'
import DocumentsBinder from '@/components/DocumentsBinder'
import ImportExportManager from '@/components/ImportExportManager'
import ThemeToggle from '@/components/ThemeToggle'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ToastProvider } from '@/components/Toast'
import { AppProvider, useApp } from '@/contexts/AppContext'
import { FamilyInfo, ChecklistItem } from '@/types'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { STORAGE_KEYS, APP_CONFIG } from '@/lib/constants'
import { calculateProgress } from '@/lib/utils'
import { DEFAULT_CHECKLIST } from '@/lib/defaultData'

/**
 * Main content wrapper component
 */
function HomeContent() {
  const { familyInfo, setFamilyInfo, metricsSettings, setMetricsSettings, isLoading } = useApp()
  const [checklistItems, setChecklistItems] = useLocalStorage<ChecklistItem[]>(
    STORAGE_KEYS.CHECKLIST_ITEMS,
    DEFAULT_CHECKLIST
  )
  const [activeTab, setActiveTab] = useState('checklist')
  const [isEditingFamily, setIsEditingFamily] = useState(false)
  const [isEditingMetrics, setIsEditingMetrics] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Memoized progress calculation
  const stats = useMemo(() => {
    const totalItems = checklistItems.reduce((acc, category) => acc + category.items.length, 0)
    const completedItems = checklistItems.reduce((acc, category) => 
      acc + category.items.filter(item => item.completed).length, 0
    )
    const percentage = calculateProgress(completedItems, totalItems)
    
    return { totalItems, completedItems, percentage }
  }, [checklistItems])

  // Memoized total family members
  const totalFamilyMembers = useMemo(() => 
    familyInfo.adults + familyInfo.children + familyInfo.pets,
    [familyInfo]
  )

  // Optimized checklist update with useCallback
  const updateChecklistItem = useCallback((categoryId: number, itemId: string, completed: boolean) => {
    setChecklistItems(prev => prev.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.map(item => 
            item.id === itemId ? { ...item, completed } : item
          )
        }
      }
      return category
    }))
  }, [setChecklistItems])

  // Optimized family info update
  const updateFamilyInfo = useCallback((field: keyof FamilyInfo, value: string | number) => {
    setFamilyInfo(prev => ({ ...prev, [field]: value }))
  }, [setFamilyInfo])

  // Optimized metrics update
  const updateMetricsSettings = useCallback((field: string, value: string) => {
    setMetricsSettings(prev => ({ ...prev, [field]: value }))
  }, [setMetricsSettings])

  // Close sidebar on tab change for mobile
  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId)
    setIsSidebarOpen(false)
  }, [])

  const tabs = [
    { id: 'checklist', label: 'Checklist', icon: Shield },
    { id: 'pantry', label: 'Pantry', icon: Shield },
    { id: 'books', label: 'Books', icon: BookOpen },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'radio', label: 'HAM Radio', icon: Radio },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'export', label: 'Data', icon: Download },
  ]

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-brown-600 dark:text-brown-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 no-print" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brown-500"
                aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                aria-expanded={isSidebarOpen}
              >
                {isSidebarOpen ? (
                  <X className="h-6 w-6 text-gray-600 dark:text-gray-300" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" aria-hidden="true" />
                )}
              </button>
              <div className="p-2 bg-brown-100 dark:bg-brown-900 rounded-lg">
                <Shield className="h-8 w-8 text-brown-600 dark:text-brown-400" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {APP_CONFIG.APP_NAME}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {APP_CONFIG.APP_DESCRIPTION}
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Two Column Layout */}
      <div className="flex">
        {/* Sidebar - 20% */}
        <aside 
          className={`${isSidebarOpen ? 'fixed inset-0 z-40 lg:relative lg:inset-auto' : 'hidden'} lg:block w-full lg:w-1/5 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen no-print`}
          aria-label="Sidebar"
        >
          {/* Mobile backdrop */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
              aria-hidden="true"
            />
          )}
          
          <div className="relative z-10 bg-white dark:bg-gray-800 h-full p-6 lg:p-6 overflow-y-auto">
            {/* Family Info Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Family</h3>
                <button
                  onClick={() => setIsEditingFamily(!isEditingFamily)}
                  className="text-xs text-brown-600 dark:text-brown-400 hover:text-brown-700 dark:hover:text-brown-300 focus:outline-none focus:underline"
                  aria-label={isEditingFamily ? 'Save family information' : 'Edit family information'}
                >
                  {isEditingFamily ? 'Save' : 'Edit'}
                </button>
              </div>

              {isEditingFamily ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label htmlFor="adults" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Adults</label>
                      <input
                        id="adults"
                        type="number"
                        min="0"
                        value={familyInfo.adults}
                        onChange={(e) => updateFamilyInfo('adults', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="children" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Children</label>
                      <input
                        id="children"
                        type="number"
                        min="0"
                        value={familyInfo.children}
                        onChange={(e) => updateFamilyInfo('children', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="pets" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Pets</label>
                      <input
                        id="pets"
                        type="number"
                        min="0"
                        value={familyInfo.pets}
                        onChange={(e) => updateFamilyInfo('pets', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditingFamily(false)}
                    className="w-full px-2 py-1 bg-brown-600 text-white rounded text-xs hover:bg-brown-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brown-500"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-brown-600 dark:text-brown-400">{familyInfo.adults}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Adults</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-brown-600 dark:text-brown-400">{familyInfo.children}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Children</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-brown-600 dark:text-brown-400">{familyInfo.pets}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Pets</div>
                  </div>
                </div>
              )}
              
              {!isEditingFamily && (
                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 text-center">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    Total: {totalFamilyMembers}
                  </div>
                </div>
              )}
            </div>

            {/* Metrics Settings Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Units</h3>
                <button
                  onClick={() => setIsEditingMetrics(!isEditingMetrics)}
                  className="text-xs text-brown-600 dark:text-brown-400 hover:text-brown-700 dark:hover:text-brown-300 focus:outline-none focus:underline"
                  aria-label={isEditingMetrics ? 'Save unit settings' : 'Edit unit settings'}
                >
                  {isEditingMetrics ? 'Save' : 'Edit'}
                </button>
              </div>

              {isEditingMetrics ? (
                <div className="space-y-2">
                  <div>
                    <label htmlFor="volume" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Volume</label>
                    <select
                      id="volume"
                      value={metricsSettings.volume}
                      onChange={(e) => updateMetricsSettings('volume', e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="gallons">Gallons</option>
                      <option value="liters">Liters</option>
                      <option value="quarts">Quarts</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="weight" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Weight</label>
                    <select
                      id="weight"
                      value={metricsSettings.weight}
                      onChange={(e) => updateMetricsSettings('weight', e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="pounds">Pounds</option>
                      <option value="kilograms">Kilograms</option>
                      <option value="ounces">Ounces</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setIsEditingMetrics(false)}
                    className="w-full px-2 py-1 bg-brown-600 text-white rounded text-xs hover:bg-brown-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brown-500"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Volume:</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">{metricsSettings.volume}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Weight:</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">{metricsSettings.weight}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Overall Progress</span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{stats.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-brown-500 to-brown-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${stats.percentage}%` }}
                  role="progressbar"
                  aria-valuenow={stats.percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${stats.percentage}% complete`}
                />
              </div>
              <div className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
                {stats.completedItems} of {stats.totalItems} items completed
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content - 80% */}
        <main className="w-full lg:w-4/5">
          <div className="p-6">
            {/* Navigation Tabs */}
            <nav className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6 no-print" aria-label="Main navigation">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex space-x-8 px-6 overflow-x-auto" role="tablist">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        aria-controls={`${tab.id}-panel`}
                        id={`${tab.id}-tab`}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brown-500 ${
                          activeTab === tab.id
                            ? 'border-brown-500 text-brown-600 dark:text-brown-400'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        <span>{tab.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </nav>

            {/* Tab Content */}
            <div 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm"
              role="tabpanel"
              id={`${activeTab}-panel`}
              aria-labelledby={`${activeTab}-tab`}
            >
              {activeTab === 'checklist' && (
                <ChecklistSection 
                  checklistItems={checklistItems}
                  onUpdateItem={updateChecklistItem}
                  familyInfo={familyInfo}
                  metricsSettings={metricsSettings}
                />
              )}
              {activeTab === 'pantry' && <PantryManager metricsSettings={metricsSettings} />}
              {activeTab === 'books' && <BooksManager />}
              {activeTab === 'contacts' && <EmergencyContacts />}
              {activeTab === 'radio' && <HamRadioFrequencies />}
              {activeTab === 'documents' && <DocumentsBinder />}
              {activeTab === 'export' && (
                <ImportExportManager 
                  familyInfo={familyInfo}
                  checklistItems={checklistItems}
                  metricsSettings={metricsSettings}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Notion Template Promotion */}
      <footer className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-t border-blue-200 dark:border-blue-800 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-blue-200 dark:border-blue-700 p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466l1.823 1.447zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933l3.222-.233c.514-.047.793.233.793.746z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Get the Notion Template</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Check out our premium Notion template with advanced features and detailed planning tools.
                  </p>
                </div>
              </div>
              <a
                href="https://www.notion.com/templates/emergency-preparedness-checklist"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                <span>View Template</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

/**
 * Main export wrapped with providers and error boundary
 */
export default function Home() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <ToastProvider>
          <HomeContent />
        </ToastProvider>
      </AppProvider>
    </ErrorBoundary>
  )
}
