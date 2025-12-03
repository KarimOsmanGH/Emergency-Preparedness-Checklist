/**
 * Main Home Page Component
 * Refactored with performance optimizations, accessibility, dark mode, and improved UX
 */

'use client'

import { useState, useMemo, useCallback } from 'react'
import { Shield, Users, BookOpen, Radio, FileText, Download, Menu, X, Compass, Zap } from 'lucide-react'
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
    { id: 'pantry', label: 'Pantry', icon: Compass },
    { id: 'books', label: 'Books', icon: BookOpen },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'radio', label: 'HAM Radio', icon: Radio },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'export', label: 'Data', icon: Download },
  ]

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-2xl icon-container mx-auto flex items-center justify-center animate-float">
              <Shield className="h-10 w-10 text-forest-600 dark:text-forest-400" />
            </div>
            <div className="absolute -inset-2 bg-forest-400/20 rounded-3xl blur-xl animate-pulse-glow" />
          </div>
          <p className="text-sand-600 dark:text-sand-400 font-medium">Preparing your checklist...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="header sticky top-0 z-30 no-print" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2.5 rounded-xl bg-sand-100 dark:bg-forest-800 hover:bg-sand-200 dark:hover:bg-forest-700 transition-colors focus:outline-none focus:ring-2 focus:ring-forest-500"
                aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                aria-expanded={isSidebarOpen}
              >
                {isSidebarOpen ? (
                  <X className="h-5 w-5 text-forest-700 dark:text-sand-300" aria-hidden="true" />
                ) : (
                  <Menu className="h-5 w-5 text-forest-700 dark:text-sand-300" aria-hidden="true" />
                )}
              </button>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl icon-container flex items-center justify-center">
                    <Shield className="h-6 w-6 text-forest-600 dark:text-forest-400" aria-hidden="true" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center">
                    <Zap className="h-2.5 w-2.5 text-amber-900" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-forest-900 dark:text-sand-50 tracking-tight">
                    {APP_CONFIG.APP_NAME}
                  </h1>
                  <p className="text-sm text-sand-500 dark:text-forest-400 hidden sm:block">
                    {APP_CONFIG.APP_DESCRIPTION}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Progress indicator in header */}
              <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-sand-100 dark:bg-forest-800 border border-sand-200 dark:border-forest-700">
                <div className="text-xs font-medium text-sand-600 dark:text-sand-400">Progress</div>
                <div className="w-24 h-2 rounded-full bg-sand-200 dark:bg-forest-700 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-forest-400 to-forest-600 transition-all duration-500"
                    style={{ width: `${stats.percentage}%` }}
                  />
                </div>
                <div className="text-sm font-bold text-forest-600 dark:text-forest-400">{stats.percentage}%</div>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Two Column Layout */}
      <div className="flex">
        {/* Sidebar - 20% */}
        <aside 
          className={`${isSidebarOpen ? 'fixed inset-0 z-40 lg:relative lg:inset-auto' : 'hidden'} lg:block w-full lg:w-1/5 sidebar min-h-[calc(100vh-73px)] no-print`}
          aria-label="Sidebar"
        >
          {/* Mobile backdrop */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-forest-950/60 backdrop-blur-sm lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
              aria-hidden="true"
            />
          )}
          
          <div className="relative z-10 bg-white dark:bg-forest-900 h-full p-5 overflow-y-auto lg:bg-transparent lg:dark:bg-transparent">
            {/* Family Info Section */}
            <div className="tactical-card p-5 mb-4 animate-fade-in-up stagger-1">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-forest-600 dark:text-forest-400" />
                  <h3 className="text-sm font-bold text-forest-900 dark:text-sand-50 uppercase tracking-wider">Family</h3>
                </div>
                <button
                  onClick={() => setIsEditingFamily(!isEditingFamily)}
                  className="text-xs font-medium text-forest-600 dark:text-forest-400 hover:text-forest-700 dark:hover:text-forest-300 transition-colors focus:outline-none focus:underline"
                  aria-label={isEditingFamily ? 'Save family information' : 'Edit family information'}
                >
                  {isEditingFamily ? 'Save' : 'Edit'}
                </button>
              </div>

              {isEditingFamily ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label htmlFor="adults" className="block text-xs font-medium text-sand-500 dark:text-sand-400 mb-1.5">Adults</label>
                      <input
                        id="adults"
                        type="number"
                        min="0"
                        value={familyInfo.adults}
                        onChange={(e) => updateFamilyInfo('adults', parseInt(e.target.value) || 0)}
                        className="input-field text-center text-sm py-2"
                      />
                    </div>
                    <div>
                      <label htmlFor="children" className="block text-xs font-medium text-sand-500 dark:text-sand-400 mb-1.5">Children</label>
                      <input
                        id="children"
                        type="number"
                        min="0"
                        value={familyInfo.children}
                        onChange={(e) => updateFamilyInfo('children', parseInt(e.target.value) || 0)}
                        className="input-field text-center text-sm py-2"
                      />
                    </div>
                    <div>
                      <label htmlFor="pets" className="block text-xs font-medium text-sand-500 dark:text-sand-400 mb-1.5">Pets</label>
                      <input
                        id="pets"
                        type="number"
                        min="0"
                        value={familyInfo.pets}
                        onChange={(e) => updateFamilyInfo('pets', parseInt(e.target.value) || 0)}
                        className="input-field text-center text-sm py-2"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditingFamily(false)}
                    className="btn-primary w-full text-sm"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    {[
                      { label: 'Adults', value: familyInfo.adults },
                      { label: 'Children', value: familyInfo.children },
                      { label: 'Pets', value: familyInfo.pets },
                    ].map((item, i) => (
                      <div key={item.label} className={`p-3 rounded-lg bg-sand-50 dark:bg-forest-800/50 border border-sand-200 dark:border-forest-700 animate-scale-in stagger-${i + 1}`}>
                        <div className="text-2xl font-bold text-forest-600 dark:text-forest-400">{item.value}</div>
                        <div className="text-xs font-medium text-sand-500 dark:text-sand-400 uppercase tracking-wide">{item.label}</div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-sand-200 dark:border-forest-700 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-forest-100 dark:bg-forest-800 border border-forest-200 dark:border-forest-700">
                      <span className="text-sm font-bold text-forest-700 dark:text-forest-300">
                        Total: {totalFamilyMembers}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Metrics Settings Section */}
            <div className="tactical-card p-5 mb-4 animate-fade-in-up stagger-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-forest-600 dark:text-forest-400" />
                  <h3 className="text-sm font-bold text-forest-900 dark:text-sand-50 uppercase tracking-wider">Units</h3>
                </div>
                <button
                  onClick={() => setIsEditingMetrics(!isEditingMetrics)}
                  className="text-xs font-medium text-forest-600 dark:text-forest-400 hover:text-forest-700 dark:hover:text-forest-300 transition-colors focus:outline-none focus:underline"
                  aria-label={isEditingMetrics ? 'Save unit settings' : 'Edit unit settings'}
                >
                  {isEditingMetrics ? 'Save' : 'Edit'}
                </button>
              </div>

              {isEditingMetrics ? (
                <div className="space-y-3">
                  <div>
                    <label htmlFor="volume" className="block text-xs font-medium text-sand-500 dark:text-sand-400 mb-1.5">Volume</label>
                    <select
                      id="volume"
                      value={metricsSettings.volume}
                      onChange={(e) => updateMetricsSettings('volume', e.target.value)}
                      className="select-field text-sm"
                    >
                      <option value="gallons">Gallons</option>
                      <option value="liters">Liters</option>
                      <option value="quarts">Quarts</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="weight" className="block text-xs font-medium text-sand-500 dark:text-sand-400 mb-1.5">Weight</label>
                    <select
                      id="weight"
                      value={metricsSettings.weight}
                      onChange={(e) => updateMetricsSettings('weight', e.target.value)}
                      className="select-field text-sm"
                    >
                      <option value="pounds">Pounds</option>
                      <option value="kilograms">Kilograms</option>
                      <option value="ounces">Ounces</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setIsEditingMetrics(false)}
                    className="btn-primary w-full text-sm"
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {[
                    { label: 'Volume', value: metricsSettings.volume },
                    { label: 'Weight', value: metricsSettings.weight },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between items-center py-2 px-3 rounded-lg bg-sand-50 dark:bg-forest-800/50">
                      <span className="text-xs font-medium text-sand-500 dark:text-sand-400 uppercase tracking-wide">{item.label}</span>
                      <span className="text-sm font-semibold text-forest-700 dark:text-forest-300 capitalize">{item.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="tactical-card p-5 animate-fade-in-up stagger-3">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-forest-900 dark:text-sand-50 uppercase tracking-wider">Overall Progress</span>
                <span className="text-lg font-bold text-forest-600 dark:text-forest-400">{stats.percentage}%</span>
              </div>
              <div className="progress-bar mb-3">
                <div 
                  className="progress-bar-fill"
                  style={{ width: `${stats.percentage}%` }}
                  role="progressbar"
                  aria-valuenow={stats.percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${stats.percentage}% complete`}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-sand-500 dark:text-sand-400">
                  <span className="font-semibold text-forest-600 dark:text-forest-400">{stats.completedItems}</span> of {stats.totalItems} items
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-medium">
                  {stats.totalItems - stats.completedItems} left
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content - 80% */}
        <main className="w-full lg:w-4/5">
          <div className="p-4 sm:p-6">
            {/* Navigation Tabs */}
            <nav className="tactical-card mb-6 no-print animate-fade-in-down" aria-label="Main navigation">
              <div className="border-b border-sand-200 dark:border-forest-700">
                <div className="flex space-x-1 px-4 overflow-x-auto scrollbar-none" role="tablist">
                  {tabs.map((tab, index) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        aria-controls={`${tab.id}-panel`}
                        id={`${tab.id}-tab`}
                        className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                        style={{ animationDelay: `${index * 50}ms` }}
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
              className="tactical-card animate-fade-in-up"
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
      <footer className="mt-8 p-4 sm:p-6 no-print">
        <div className="max-w-7xl mx-auto lg:ml-[20%] lg:max-w-none lg:pr-6">
          <div className="notion-promo">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-5">
                <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
                  <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466l1.823 1.447zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933l3.222-.233c.514-.047.793.233.793.746z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Get the Notion Template</h3>
                  <p className="text-sm text-forest-100/80">
                    Premium template with advanced features and detailed planning tools.
                  </p>
                </div>
              </div>
              <a
                href="https://www.notion.com/templates/emergency-preparedness-checklist"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-white text-forest-700 rounded-xl hover:bg-sand-50 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-forest-700"
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
