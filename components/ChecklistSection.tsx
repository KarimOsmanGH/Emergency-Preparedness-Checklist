/**
 * ChecklistSection Component
 * Displays and manages the emergency preparedness checklist
 */

'use client'

import { useState, useMemo, useCallback } from 'react'
import { CheckCircle, Circle, Users } from 'lucide-react'
import { ChecklistItem, FamilyInfo, MetricsSettings } from '@/types'

interface ChecklistSectionProps {
  checklistItems: ChecklistItem[]
  onUpdateItem: (categoryId: number, itemId: string, completed: boolean) => void
  familyInfo: FamilyInfo
  metricsSettings: MetricsSettings
}

export default function ChecklistSection({ 
  checklistItems, 
  onUpdateItem, 
  familyInfo, 
  metricsSettings 
}: ChecklistSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  const selectCategory = useCallback((categoryId: number) => {
    setSelectedCategory(prev => prev === categoryId ? null : categoryId)
  }, [])

  const getCategoryProgress = useCallback((category: ChecklistItem) => {
    const totalItems = category.items.length
    const completedItems = category.items.filter(item => item.completed).length
    const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
    return { totalItems, completedItems, percentage }
  }, [])

  const overallProgress = useMemo(() => {
    const allItems = checklistItems.flatMap(category => category.items)
    const totalItems = allItems.length
    const completedItems = allItems.filter(item => item.completed).length
    const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
    return { totalItems, completedItems, percentage }
  }, [checklistItems])

  const convertWaterText = useCallback((text: string) => {
    if (text.includes('gallon') && metricsSettings.volume !== 'gallons') {
      if (metricsSettings.volume === 'liters') {
        return text.replace('gallon', 'liter').replace('gallons', 'liters')
      } else if (metricsSettings.volume === 'quarts') {
        return text.replace('gallon', 'quart').replace('gallons', 'quarts')
      }
    }
    return text
  }, [metricsSettings.volume])

  const totalFamilyMembers = familyInfo.adults + familyInfo.children + familyInfo.pets

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Checklist</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Users className="h-4 w-4" aria-hidden="true" />
            <span>Recommended for {totalFamilyMembers} family members</span>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Complete these essential items to ensure your family is prepared for any emergency. 
          Quantities are automatically adjusted based on your family size.
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brown-500 ${
              selectedCategory === null
                ? 'bg-brown-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            aria-pressed={selectedCategory === null}
          >
            All Categories
          </button>
          {checklistItems.map((category) => {
            const progress = getCategoryProgress(category)
            return (
              <button
                key={category.id}
                onClick={() => selectCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brown-500 ${
                  selectedCategory === category.id
                    ? 'bg-brown-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                aria-pressed={selectedCategory === category.id}
              >
                {category.category} ({progress.completedItems}/{progress.totalItems})
              </button>
            )
          })}
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mb-8">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Overall Progress</h3>
            <span className="text-2xl font-bold text-brown-600 dark:text-brown-400">{overallProgress.percentage}%</span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
            <div 
              className="bg-gradient-to-r from-brown-500 to-brown-600 h-4 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${overallProgress.percentage}%` }}
              role="progressbar"
              aria-valuenow={overallProgress.percentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${overallProgress.percentage}% complete`}
            />
          </div>
          
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{overallProgress.completedItems} of {overallProgress.totalItems} items completed</span>
            <span>{overallProgress.totalItems - overallProgress.completedItems} remaining</span>
          </div>
        </div>
      </div>

      {/* Checklist Items */}
      {selectedCategory === null ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {checklistItems.map((category) => {
            const progress = getCategoryProgress(category)
            return (
              <article
                key={category.id}
                className="flex flex-col border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm h-[420px]"
              >
                <header className="bg-gradient-to-r from-brown-50 to-brown-100 dark:from-brown-900/30 dark:to-brown-800/30 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{category.category}</h3>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{progress.completedItems}/{progress.totalItems} completed</span>
                  </div>
                  
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-brown-500 to-brown-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress.percentage}%` }}
                        role="progressbar"
                        aria-valuenow={progress.percentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>
                </header>

                <div className="flex-1 p-6 overflow-y-auto">
                  <ul className="space-y-3 pr-2">
                    {category.items.map((item) => {
                      const displayText = convertWaterText(item.text)
                      
                      return (
                        <li 
                          key={item.id} 
                          className={`checklist-item ${item.completed ? 'completed' : ''}`}
                        >
                          <button
                            onClick={() => onUpdateItem(category.id, item.id, !item.completed)}
                            className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-brown-500 rounded-full"
                            aria-label={item.completed ? `Mark "${displayText}" as incomplete` : `Mark "${displayText}" as complete`}
                          >
                            {item.completed ? (
                              <CheckCircle className="h-6 w-6 text-brown-600 dark:text-brown-400" aria-hidden="true" />
                            ) : (
                              <Circle className="h-6 w-6 text-gray-400 hover:text-brown-500 dark:hover:text-brown-400" aria-hidden="true" />
                            )}
                          </button>
                          
                          <span className={`flex-1 min-w-0 text-sm font-medium ${item.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                            {displayText}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
          {(() => {
            const category = checklistItems.find(cat => cat.id === selectedCategory)
            if (!category) return null
            
            const progress = getCategoryProgress(category)
            return (
              <article>
                <header className="bg-gradient-to-r from-brown-50 to-brown-100 dark:from-brown-900/30 dark:to-brown-800/30 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{category.category}</h3>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{progress.completedItems}/{progress.totalItems} completed</span>
                  </div>
                  
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-brown-500 to-brown-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress.percentage}%` }}
                        role="progressbar"
                        aria-valuenow={progress.percentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>
                </header>

                <div className="p-6">
                  <ul className="space-y-3">
                    {category.items.map((item) => {
                      const displayText = convertWaterText(item.text)
                      
                      return (
                        <li 
                          key={item.id} 
                          className={`checklist-item ${item.completed ? 'completed' : ''}`}
                        >
                          <button
                            onClick={() => onUpdateItem(category.id, item.id, !item.completed)}
                            className="flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-brown-500 rounded-full"
                            aria-label={item.completed ? `Mark "${displayText}" as incomplete` : `Mark "${displayText}" as complete`}
                          >
                            {item.completed ? (
                              <CheckCircle className="h-6 w-6 text-brown-600 dark:text-brown-400" aria-hidden="true" />
                            ) : (
                              <Circle className="h-6 w-6 text-gray-400 hover:text-brown-500 dark:hover:text-brown-400" aria-hidden="true" />
                            )}
                          </button>
                          
                          <span className={`flex-1 min-w-0 text-sm font-medium ${item.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                            {displayText}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </article>
            )
          })()}
        </div>
      )}

      {/* Tips Section */}
      <aside className="mt-8 bg-gradient-to-r from-brown-50 to-brown-100 dark:from-brown-900/30 dark:to-brown-800/30 border border-brown-200 dark:border-brown-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-brown-800 dark:text-brown-300 mb-3">💡 Pro Tips</h3>
        <ul className="space-y-2 text-sm text-brown-700 dark:text-brown-400">
          <li>• Store water in food-grade containers and rotate every 6 months</li>
          <li>• Keep a 3-day supply of non-perishable food per person</li>
          <li>• Include comfort items for children (books, games, stuffed animals)</li>
          <li>• Don&apos;t forget pet supplies and medications</li>
          <li>• Keep important documents in a waterproof container</li>
          <li>• Practice your emergency plan with your family regularly</li>
        </ul>
      </aside>
    </div>
  )
}
