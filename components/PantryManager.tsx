/**
 * PantryManager Component
 * Manages pantry items with expiry tracking and low stock alerts
 */

'use client'

import { useState, useMemo, useCallback } from 'react'
import { Plus, AlertTriangle, Package, Trash2, Edit, Search, X } from 'lucide-react'
import { format } from 'date-fns'
import { PantryItem, MetricsSettings } from '@/types'
import { usePantryItems } from '@/hooks/usePantryItems'
import { useToast } from './Toast'
import ConfirmDialog from './ConfirmDialog'
import { 
  PANTRY_CATEGORIES, 
  PANTRY_CATEGORY_COLORS 
} from '@/lib/constants'
import { getExpiryStatus, getCategoryColor } from '@/lib/utils'
import { pantryItemSchema, validateForm } from '@/lib/validations'

interface PantryManagerProps {
  metricsSettings: MetricsSettings
}

const EMPTY_ITEM: Omit<PantryItem, 'id'> = {
  name: '',
  category: '',
  quantity: 1,
  unit: 'units',
  expiryDate: '',
  minQuantity: 1,
  notes: ''
}

export default function PantryManager({ metricsSettings }: PantryManagerProps) {
  const { 
    items: pantryItems, 
    addItem, 
    updateItem, 
    deleteItem,
    lowStockItems,
    expiringItems 
  } = usePantryItems()
  
  const { showToast } = useToast()
  
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState<PantryItem | null>(null)
  const [newItem, setNewItem] = useState<Omit<PantryItem, 'id'>>(EMPTY_ITEM)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; itemId: string | null }>({
    isOpen: false,
    itemId: null
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Filter items based on search
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return pantryItems
    const lower = searchTerm.toLowerCase()
    return pantryItems.filter(item => 
      item.name.toLowerCase().includes(lower) ||
      item.category.toLowerCase().includes(lower) ||
      item.notes.toLowerCase().includes(lower)
    )
  }, [pantryItems, searchTerm])

  // Get units based on category
  const getUnitsForCategory = useCallback((category: string) => {
    if (category === 'Beverages') {
      return [metricsSettings.volume, 'bottles', 'cans', 'units']
    } else if (category === 'Baking Supplies') {
      return [metricsSettings.weight, 'cups', 'tablespoons', 'teaspoons', 'units']
    }
    return ['units', 'cans', 'boxes', 'bags', 'bottles', 'jars', metricsSettings.weight, 'ounces', 'grams']
  }, [metricsSettings])

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    
    const formData = editingItem || newItem
    const validation = validateForm(pantryItemSchema, formData)
    
    if (!validation.success) {
      setErrors(validation.errors || {})
      showToast('error', 'Please fix the form errors')
      return
    }
    
    setErrors({})
    
    if (editingItem) {
      updateItem(editingItem.id, editingItem)
      showToast('success', `${editingItem.name} updated successfully`)
      setEditingItem(null)
    } else {
      addItem(newItem)
      showToast('success', `${newItem.name} added to pantry`)
      setNewItem(EMPTY_ITEM)
      setShowAddModal(false)
    }
  }, [editingItem, newItem, addItem, updateItem, showToast])

  // Handle delete confirmation
  const handleDeleteClick = useCallback((id: string) => {
    setDeleteConfirm({ isOpen: true, itemId: id })
  }, [])

  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirm.itemId) {
      const item = pantryItems.find(i => i.id === deleteConfirm.itemId)
      deleteItem(deleteConfirm.itemId)
      showToast('success', `${item?.name || 'Item'} deleted`)
    }
    setDeleteConfirm({ isOpen: false, itemId: null })
  }, [deleteConfirm.itemId, pantryItems, deleteItem, showToast])

  // Handle input changes
  const handleInputChange = useCallback((field: keyof Omit<PantryItem, 'id'>, value: string | number) => {
    if (editingItem) {
      setEditingItem({ ...editingItem, [field]: value })
    } else {
      setNewItem(prev => ({ ...prev, [field]: value }))
    }
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }, [editingItem, errors])

  const closeModal = useCallback(() => {
    setShowAddModal(false)
    setEditingItem(null)
    setErrors({})
    setNewItem(EMPTY_ITEM)
  }, [])

  const currentItem = editingItem || newItem

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Pantry Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Track your emergency food supplies and get alerts for expiring items and low stock.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-brown-600 text-white rounded-lg hover:bg-brown-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brown-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          aria-label="Add new pantry item"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search pantry items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            aria-label="Search pantry items"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Clear search"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {expiringItems.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4" role="alert">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" aria-hidden="true" />
              <h3 className="font-semibold text-red-800 dark:text-red-300">Expiring Items</h3>
            </div>
            <p className="text-sm text-red-700 dark:text-red-400">
              {expiringItems.length} item(s) are expiring soon or have expired.
            </p>
          </div>
        )}
        
        {lowStockItems.length > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4" role="alert">
            <div className="flex items-center space-x-2 mb-2">
              <Package className="h-5 w-5 text-yellow-600 dark:text-yellow-400" aria-hidden="true" />
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-300">Low Stock Alert</h3>
            </div>
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              {lowStockItems.length} item(s) are running low on stock.
            </p>
          </div>
        )}
      </div>

      {/* Pantry Items List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="bg-gradient-to-r from-brown-50 to-brown-100 dark:from-brown-900/30 dark:to-brown-800/30 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Your Pantry Items ({filteredItems.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredItems.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" aria-hidden="true" />
              <p>{searchTerm ? 'No items match your search.' : 'No pantry items added yet. Add your first item to get started!'}</p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const expiryStatus = getExpiryStatus(item.expiryDate)
              const isLowStock = item.quantity <= item.minQuantity
              
              return (
                <div key={item.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{item.name}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full border ${getCategoryColor(item.category, PANTRY_CATEGORY_COLORS)}`}>
                          {item.category}
                        </span>
                        {isLowStock && (
                          <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs rounded-full">
                            Low Stock
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div>
                          <span className="font-medium">Quantity:</span> {item.quantity} {item.unit}
                        </div>
                        <div>
                          <span className="font-medium">Min Stock:</span> {item.minQuantity} {item.unit}
                        </div>
                        <div>
                          <span className="font-medium">Expires:</span>
                          <span className={`ml-1 ${expiryStatus.color} dark:${expiryStatus.color.replace('600', '400')}`}>
                            {format(new Date(item.expiryDate), 'MMM dd, yyyy')}
                            {expiryStatus.status === 'expired' && ' (Expired)'}
                            {expiryStatus.status === 'expiring' && ` (${expiryStatus.days} days)`}
                          </span>
                        </div>
                        {item.notes && (
                          <div className="col-span-2 md:col-span-1">
                            <span className="font-medium">Notes:</span> {item.notes}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-brown-500 rounded"
                        aria-label={`Edit ${item.name}`}
                      >
                        <Edit className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item.id)}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                        aria-label={`Delete ${item.name}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingItem) && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 id="modal-title" className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingItem ? 'Edit Item' : 'Add Pantry Item'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Item Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={currentItem.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category *
                </label>
                <select
                  id="category"
                  value={currentItem.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.category ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  aria-invalid={!!errors.category}
                  aria-describedby={errors.category ? 'category-error' : undefined}
                >
                  <option value="">Select category</option>
                  {PANTRY_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && (
                  <p id="category-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Quantity *
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    min="0"
                    value={currentItem.quantity}
                    onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="unit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Unit
                  </label>
                  <select
                    id="unit"
                    value={currentItem.unit}
                    onChange={(e) => handleInputChange('unit', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {getUnitsForCategory(currentItem.category).map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expiry Date *
                </label>
                <input
                  id="expiryDate"
                  type="date"
                  value={currentItem.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.expiryDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  aria-invalid={!!errors.expiryDate}
                  aria-describedby={errors.expiryDate ? 'expiryDate-error' : undefined}
                />
                {errors.expiryDate && (
                  <p id="expiryDate-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.expiryDate}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="minQuantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Minimum Stock Level
                </label>
                <input
                  id="minQuantity"
                  type="number"
                  min="0"
                  value={currentItem.minQuantity}
                  onChange={(e) => handleInputChange('minQuantity', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  id="notes"
                  value={currentItem.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Optional notes about this item"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brown-600 text-white rounded-md hover:bg-brown-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brown-500"
                >
                  {editingItem ? 'Update' : 'Add'} Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ isOpen: false, itemId: null })}
      />
    </div>
  )
}
