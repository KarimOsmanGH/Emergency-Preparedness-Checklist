'use client'

import { useState, useEffect } from 'react'
import { Plus, AlertTriangle, Calendar, Package, Trash2, Edit } from 'lucide-react'
import { PantryItem, FamilyInfo } from '@/types'
import { format, addDays, isAfter, isBefore } from 'date-fns'

interface PantryManagerProps {
  familyInfo: FamilyInfo
  metricsSettings: {
    volume: string
    weight: string
    temperature: string
    distance: string
  }
}

export default function PantryManager({ familyInfo, metricsSettings }: PantryManagerProps) {
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([
    {
      id: '1',
      name: 'Canned Beans',
      category: 'Canned Goods',
      quantity: 6,
      unit: 'cans',
      expiryDate: '2025-06-15',
      minQuantity: 2,
      notes: 'Black beans and kidney beans for protein'
    },
    {
      id: '2',
      name: 'Rice',
      category: 'Grains & Pasta',
      quantity: 10,
      unit: 'pounds',
      expiryDate: '2026-03-20',
      minQuantity: 5,
      notes: 'Long grain white rice'
    },
    {
      id: '3',
      name: 'Bottled Water',
      category: 'Beverages',
      quantity: 24,
      unit: 'bottles',
      expiryDate: '2025-12-01',
      minQuantity: 12,
      notes: '16.9 oz bottles'
    },
    {
      id: '4',
      name: 'Protein Bars',
      category: 'Snacks',
      quantity: 8,
      unit: 'bars',
      expiryDate: '2024-11-30',
      minQuantity: 4,
      notes: 'High protein emergency food'
    },
    {
      id: '5',
      name: 'Canned Tuna',
      category: 'Canned Goods',
      quantity: 4,
      unit: 'cans',
      expiryDate: '2025-08-10',
      minQuantity: 2,
      notes: 'Albacore tuna in water'
    },
    {
      id: '6',
      name: 'Peanut Butter',
      category: 'Condiments',
      quantity: 2,
      unit: 'jars',
      expiryDate: '2025-02-15',
      minQuantity: 1,
      notes: 'Natural peanut butter'
    },
    {
      id: '7',
      name: 'Crackers',
      category: 'Snacks',
      quantity: 3,
      unit: 'boxes',
      expiryDate: '2024-12-20',
      minQuantity: 1,
      notes: 'Saltine crackers'
    },
    {
      id: '8',
      name: 'Canned Vegetables',
      category: 'Canned Goods',
      quantity: 8,
      unit: 'cans',
      expiryDate: '2025-07-05',
      minQuantity: 4,
      notes: 'Mixed vegetables and corn'
    }
  ])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState<PantryItem | null>(null)
  const [newItem, setNewItem] = useState<Omit<PantryItem, 'id'>>({
    name: '',
    category: '',
    quantity: 1,
    unit: 'units',
    expiryDate: '',
    minQuantity: 1,
    notes: ''
  })

  useEffect(() => {
    const saved = localStorage.getItem('pantryItems')
    if (saved) {
      setPantryItems(JSON.parse(saved))
    }
  }, [])

  const savePantryItems = (items: PantryItem[]) => {
    setPantryItems(items)
    localStorage.setItem('pantryItems', JSON.stringify(items))
  }

  const addItem = () => {
    const item: PantryItem = {
      ...newItem,
      id: Date.now().toString()
    }
    const updated = [...pantryItems, item]
    savePantryItems(updated)
    setNewItem({
      name: '',
      category: '',
      quantity: 1,
      unit: 'units',
      expiryDate: '',
      minQuantity: 1,
      notes: ''
    })
    setShowAddModal(false)
  }

  const updateItem = () => {
    if (!editingItem) return
    const updated = pantryItems.map(item => 
      item.id === editingItem.id ? editingItem : item
    )
    savePantryItems(updated)
    setEditingItem(null)
  }

  const deleteItem = (id: string) => {
    const updated = pantryItems.filter(item => item.id !== id)
    savePantryItems(updated)
  }

  const getExpiryStatus = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysUntilExpiry < 0) return { status: 'expired', days: Math.abs(daysUntilExpiry), color: 'text-red-600' }
    if (daysUntilExpiry <= 7) return { status: 'expiring', days: daysUntilExpiry, color: 'text-orange-600' }
    if (daysUntilExpiry <= 30) return { status: 'warning', days: daysUntilExpiry, color: 'text-yellow-600' }
    return { status: 'good', days: daysUntilExpiry, color: 'text-green-600' }
  }

  const getLowStockItems = () => {
    return pantryItems.filter(item => item.quantity <= item.minQuantity)
  }

  const getExpiringItems = () => {
    return pantryItems.filter(item => {
      const status = getExpiryStatus(item.expiryDate)
      return status.status === 'expired' || status.status === 'expiring'
    })
  }

  const categories = [
    'Canned Goods', 'Grains & Pasta', 'Beverages', 'Snacks', 
    'Condiments', 'Baking Supplies', 'Frozen Foods', 'Other'
  ]

  const getUnitsForCategory = (category: string) => {
    if (category === 'Beverages') {
      return [metricsSettings.volume, 'bottles', 'cans', 'units']
    } else if (category === 'Baking Supplies') {
      return [metricsSettings.weight, 'cups', 'tablespoons', 'teaspoons', 'units']
    } else {
      return ['units', 'cans', 'boxes', 'bags', 'bottles', 'jars', metricsSettings.weight, 'ounces', 'grams']
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Canned Goods':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Grains & Pasta':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Beverages':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Snacks':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Condiments':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Baking Supplies':
        return 'bg-pink-100 text-pink-800 border-pink-200'
      case 'Frozen Foods':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pantry Management</h2>
          <p className="text-gray-600">
            Track your emergency food supplies and get alerts for expiring items and low stock.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-brown-600 text-white rounded-lg hover:bg-brown-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Item</span>
        </button>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {getExpiringItems().length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h3 className="font-semibold text-red-800">Expiring Items</h3>
            </div>
            <p className="text-sm text-red-700">
              {getExpiringItems().length} item(s) are expiring soon or have expired.
            </p>
          </div>
        )}
        
        {getLowStockItems().length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Package className="h-5 w-5 text-yellow-600" />
              <h3 className="font-semibold text-yellow-800">Low Stock Alert</h3>
            </div>
            <p className="text-sm text-yellow-700">
              {getLowStockItems().length} item(s) are running low on stock.
            </p>
          </div>
        )}
      </div>

      {/* Pantry Items */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Your Pantry Items</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {pantryItems.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No pantry items added yet. Add your first item to get started!</p>
            </div>
          ) : (
            pantryItems.map((item) => {
              const expiryStatus = getExpiryStatus(item.expiryDate)
              const isLowStock = item.quantity <= item.minQuantity
              
              return (
                <div key={item.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                        <span className={`px-2 py-1 rounded-full ${getCategoryColor(item.category)}`}>
                          {item.category}
                        </span>
                        {isLowStock && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            Low Stock
                          </span>
                        )}
                        <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(item.category)}`}>
                          {item.category}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Quantity:</span> {item.quantity} {item.unit}
                        </div>
                        <div>
                          <span className="font-medium">Min Stock:</span> {item.minQuantity} {item.unit}
                        </div>
                        <div>
                          <span className="font-medium">Expires:</span>
                          <span className={`ml-1 ${expiryStatus.color}`}>
                            {format(new Date(item.expiryDate), 'MMM dd, yyyy')}
                            {expiryStatus.status === 'expired' && ' (Expired)'}
                            {expiryStatus.status === 'expiring' && ` (${expiryStatus.days} days)`}
                          </span>
                        </div>
                        {item.notes && (
                          <div>
                            <span className="font-medium">Notes:</span> {item.notes}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingItem ? 'Edit Item' : 'Add Pantry Item'}
              </h3>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); editingItem ? updateItem() : addItem() }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                <input
                  type="text"
                  value={editingItem?.name || newItem.name}
                  onChange={(e) => editingItem 
                    ? setEditingItem({...editingItem, name: e.target.value})
                    : setNewItem({...newItem, name: e.target.value})
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={editingItem?.category || newItem.category}
                  onChange={(e) => editingItem 
                    ? setEditingItem({...editingItem, category: e.target.value})
                    : setNewItem({...newItem, category: e.target.value})
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={editingItem?.quantity || newItem.quantity}
                    onChange={(e) => editingItem 
                      ? setEditingItem({...editingItem, quantity: parseInt(e.target.value) || 0})
                      : setNewItem({...newItem, quantity: parseInt(e.target.value) || 0})
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <select
                    value={editingItem?.unit || newItem.unit}
                    onChange={(e) => editingItem 
                      ? setEditingItem({...editingItem, unit: e.target.value})
                      : setNewItem({...newItem, unit: e.target.value})
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                  >
                    {getUnitsForCategory(editingItem?.category || newItem.category).map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={editingItem?.expiryDate || newItem.expiryDate}
                  onChange={(e) => editingItem 
                    ? setEditingItem({...editingItem, expiryDate: e.target.value})
                    : setNewItem({...newItem, expiryDate: e.target.value})
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Stock Level</label>
                <input
                  type="number"
                  min="0"
                  value={editingItem?.minQuantity || newItem.minQuantity}
                  onChange={(e) => editingItem 
                    ? setEditingItem({...editingItem, minQuantity: parseInt(e.target.value) || 0})
                    : setNewItem({...newItem, minQuantity: parseInt(e.target.value) || 0})
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={editingItem?.notes || newItem.notes}
                  onChange={(e) => editingItem 
                    ? setEditingItem({...editingItem, notes: e.target.value})
                    : setNewItem({...newItem, notes: e.target.value})
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                  placeholder="Optional notes about this item"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingItem(null) }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brown-600 text-white rounded-md hover:bg-brown-700 transition-colors"
                >
                  {editingItem ? 'Update' : 'Add'} Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 