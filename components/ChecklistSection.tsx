/**
 * ChecklistSection Component
 * Displays and manages the emergency preparedness checklist
 */

'use client'

import { useState, useMemo, useCallback } from 'react'
import { CheckCircle, Circle, Users, Lightbulb, ChevronRight } from 'lucide-react'
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

  // Get a color for category based on index
  const getCategoryColor = (index: number) => {
    const colors = [
      'from-forest-500 to-forest-600',
      'from-amber-500 to-amber-600',
      'from-emerald-500 to-emerald-600',
      'from-cyan-500 to-cyan-600',
      'from-violet-500 to-violet-600',
      'from-rose-500 to-rose-600',
      'from-orange-500 to-orange-600',
      'from-teal-500 to-teal-600',
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
          <h2 className="text-2xl font-bold text-forest-900 dark:text-sand-50">Emergency Checklist</h2>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-forest-100 dark:bg-forest-800 border border-forest-200 dark:border-forest-700">
            <Users className="h-4 w-4 text-forest-600 dark:text-forest-400" aria-hidden="true" />
            <span className="text-sm font-medium text-forest-700 dark:text-forest-300">
              Recommended for {totalFamilyMembers} family members
            </span>
          </div>
        </div>
        <p className="text-sand-600 dark:text-sand-400 max-w-3xl">
          Complete these essential items to ensure your family is prepared for any emergency. 
          Quantities are automatically adjusted based on your family size.
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`category-pill ${selectedCategory === null ? 'active' : ''}`}
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
                className={`category-pill ${selectedCategory === category.id ? 'active' : ''}`}
                aria-pressed={selectedCategory === category.id}
              >
                <span>{category.category}</span>
                <span className="ml-1.5 text-xs opacity-70">
                  {progress.completedItems}/{progress.totalItems}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mb-8">
        <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-forest-600 via-forest-700 to-forest-800 text-white shadow-tactical">
          {/* Background pattern */}
          <div className="absolute inset-0 bg-tactical-pattern opacity-10" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white/90">Overall Progress</h3>
                <p className="text-sm text-forest-100/70 mt-0.5">Keep going, you&apos;re doing great!</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">{overallProgress.percentage}%</div>
                <div className="text-xs text-forest-100/70 mt-0.5">Complete</div>
              </div>
            </div>
            
            <div className="w-full bg-white/20 rounded-full h-4 mb-3 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 transition-all duration-700 ease-out relative"
                style={{ width: `${overallProgress.percentage}%` }}
                role="progressbar"
                aria-valuenow={overallProgress.percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${overallProgress.percentage}% complete`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-forest-100/80">
                <span className="font-semibold text-white">{overallProgress.completedItems}</span> of {overallProgress.totalItems} items completed
              </span>
              <span className="font-medium text-amber-300">
                {overallProgress.totalItems - overallProgress.completedItems} remaining
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Checklist Items */}
      {selectedCategory === null ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {checklistItems.map((category, categoryIndex) => {
            const progress = getCategoryProgress(category)
            return (
              <article
                key={category.id}
                className="flex flex-col tactical-card overflow-hidden h-[420px] animate-fade-in-up"
                style={{ animationDelay: `${categoryIndex * 100}ms` }}
              >
                <header className="relative overflow-hidden px-6 py-5 border-b border-sand-200 dark:border-forest-700">
                  {/* Gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${getCategoryColor(categoryIndex)} opacity-5 dark:opacity-10`} />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-forest-900 dark:text-sand-50">{category.category}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        progress.percentage === 100 
                          ? 'bg-forest-100 dark:bg-forest-800 text-forest-700 dark:text-forest-300' 
                          : 'bg-sand-100 dark:bg-forest-800 text-sand-600 dark:text-sand-400'
                      }`}>
                        {progress.completedItems}/{progress.totalItems}
                      </span>
                    </div>
                    
                    <div className="w-full bg-sand-200 dark:bg-forest-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r ${getCategoryColor(categoryIndex)} transition-all duration-500`}
                        style={{ width: `${progress.percentage}%` }}
                        role="progressbar"
                        aria-valuenow={progress.percentage}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                  </div>
                </header>

                <div className="flex-1 p-5 overflow-y-auto">
                  <ul className="space-y-2.5">
                    {category.items.map((item, itemIndex) => {
                      const displayText = convertWaterText(item.text)
                      
                      return (
                        <li 
                          key={item.id} 
                          className={`group flex items-start gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer ${
                            item.completed 
                              ? 'bg-forest-50/80 dark:bg-forest-900/30 border border-forest-200/50 dark:border-forest-700/30' 
                              : 'hover:bg-sand-50 dark:hover:bg-forest-800/50 border border-transparent'
                          }`}
                          onClick={() => onUpdateItem(category.id, item.id, !item.completed)}
                          style={{ animationDelay: `${itemIndex * 30}ms` }}
                        >
                          <button
                            className="flex-shrink-0 mt-0.5 focus:outline-none focus:ring-2 focus:ring-forest-500 rounded-full"
                            aria-label={item.completed ? `Mark "${displayText}" as incomplete` : `Mark "${displayText}" as complete`}
                            onClick={(e) => {
                              e.stopPropagation()
                              onUpdateItem(category.id, item.id, !item.completed)
                            }}
                          >
                            {item.completed ? (
                              <CheckCircle className="h-5 w-5 text-forest-500 dark:text-forest-400" aria-hidden="true" />
                            ) : (
                              <Circle className="h-5 w-5 text-sand-300 dark:text-forest-600 group-hover:text-forest-400 transition-colors" aria-hidden="true" />
                            )}
                          </button>
                          
                          <span className={`flex-1 min-w-0 text-sm leading-relaxed ${
                            item.completed 
                              ? 'line-through text-sand-400 dark:text-sand-600' 
                              : 'text-forest-800 dark:text-sand-200'
                          }`}>
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
        <div className="tactical-card overflow-hidden animate-fade-in">
          {(() => {
            const category = checklistItems.find(cat => cat.id === selectedCategory)
            if (!category) return null
            
            const progress = getCategoryProgress(category)
            const categoryIndex = checklistItems.findIndex(cat => cat.id === selectedCategory)
            
            return (
              <article>
                <header className="relative overflow-hidden px-6 py-5 border-b border-sand-200 dark:border-forest-700">
                  <div className={`absolute inset-0 bg-gradient-to-r ${getCategoryColor(categoryIndex)} opacity-5 dark:opacity-10`} />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setSelectedCategory(null)}
                          className="p-1.5 rounded-lg hover:bg-sand-100 dark:hover:bg-forest-700 transition-colors"
                          aria-label="Back to all categories"
                        >
                          <ChevronRight className="h-5 w-5 rotate-180 text-sand-500 dark:text-sand-400" />
                        </button>
                        <h3 className="text-lg font-bold text-forest-900 dark:text-sand-50">{category.category}</h3>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        progress.percentage === 100 
                          ? 'bg-forest-100 dark:bg-forest-800 text-forest-700 dark:text-forest-300' 
                          : 'bg-sand-100 dark:bg-forest-800 text-sand-600 dark:text-sand-400'
                      }`}>
                        {progress.completedItems}/{progress.totalItems}
                      </span>
                    </div>
                    
                    <div className="w-full bg-sand-200 dark:bg-forest-700 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r ${getCategoryColor(categoryIndex)} transition-all duration-500`}
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
                  <ul className="space-y-2.5">
                    {category.items.map((item, itemIndex) => {
                      const displayText = convertWaterText(item.text)
                      
                      return (
                        <li 
                          key={item.id} 
                          className={`group flex items-start gap-3 p-4 rounded-xl transition-all duration-200 cursor-pointer ${
                            item.completed 
                              ? 'bg-forest-50/80 dark:bg-forest-900/30 border border-forest-200/50 dark:border-forest-700/30' 
                              : 'hover:bg-sand-50 dark:hover:bg-forest-800/50 border border-transparent'
                          }`}
                          onClick={() => onUpdateItem(category.id, item.id, !item.completed)}
                          style={{ animationDelay: `${itemIndex * 30}ms` }}
                        >
                          <button
                            className="flex-shrink-0 mt-0.5 focus:outline-none focus:ring-2 focus:ring-forest-500 rounded-full"
                            aria-label={item.completed ? `Mark "${displayText}" as incomplete` : `Mark "${displayText}" as complete`}
                            onClick={(e) => {
                              e.stopPropagation()
                              onUpdateItem(category.id, item.id, !item.completed)
                            }}
                          >
                            {item.completed ? (
                              <CheckCircle className="h-6 w-6 text-forest-500 dark:text-forest-400" aria-hidden="true" />
                            ) : (
                              <Circle className="h-6 w-6 text-sand-300 dark:text-forest-600 group-hover:text-forest-400 transition-colors" aria-hidden="true" />
                            )}
                          </button>
                          
                          <span className={`flex-1 min-w-0 text-sm leading-relaxed ${
                            item.completed 
                              ? 'line-through text-sand-400 dark:text-sand-600' 
                              : 'text-forest-800 dark:text-sand-200'
                          }`}>
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
      <aside className="mt-8 tips-box">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Lightbulb className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-forest-800 dark:text-forest-200">Pro Tips</h3>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              'Store water in food-grade containers and rotate every 6 months',
              'Keep a 3-day supply of non-perishable food per person',
              'Include comfort items for children (books, games, stuffed animals)',
              "Don't forget pet supplies and medications",
              'Keep important documents in a waterproof container',
              'Practice your emergency plan with your family regularly'
            ].map((tip, index) => (
              <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-white/50 dark:bg-forest-900/30 border border-forest-200/50 dark:border-forest-700/30">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-forest-100 dark:bg-forest-800 text-forest-600 dark:text-forest-400 text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-sm text-forest-700 dark:text-forest-300 leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  )
}
