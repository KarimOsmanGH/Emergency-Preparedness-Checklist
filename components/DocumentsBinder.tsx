'use client'

import { useState, useEffect } from 'react'
import { Plus, FileText, MapPin, Star, Trash2, Edit, Calendar } from 'lucide-react'
import { Document } from '@/types'
import { format } from 'date-fns'

export default function DocumentsBinder() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Birth Certificates',
      category: 'Personal Identification',
      location: 'Fireproof safe',
      isDigital: false,
      notes: 'Birth certificates for all family members',
      isEssential: true
    },
    {
      id: '2',
      name: 'Passports',
      category: 'Personal Identification',
      location: 'Fireproof safe',
      isDigital: false,
      notes: 'Current passports for all family members',
      isEssential: true
    },
    {
      id: '3',
      name: 'Social Security Cards',
      category: 'Personal Identification',
      location: 'Fireproof safe',
      isDigital: false,
      notes: 'Social security cards for all family members',
      isEssential: true
    },
    {
      id: '4',
      name: 'Driver\'s Licenses',
      category: 'Personal Identification',
      location: 'Wallet/Purse',
      isDigital: false,
      notes: 'Current driver\'s licenses',
      isEssential: true
    },
    {
      id: '5',
      name: 'Marriage Certificate',
      category: 'Personal Identification',
      location: 'Fireproof safe',
      isDigital: false,
      notes: 'Marriage certificate',
      isEssential: true
    },
    {
      id: '6',
      name: 'Property Deed',
      category: 'Property',
      location: 'Fireproof safe',
      isDigital: false,
      notes: 'Property deed and title documents',
      isEssential: true
    },
    {
      id: '7',
      name: 'Vehicle Titles',
      category: 'Property',
      location: 'Fireproof safe',
      isDigital: false,
      notes: 'Vehicle titles and registration documents',
      isEssential: true
    },
    {
      id: '8',
      name: 'Insurance Policies',
      category: 'Insurance',
      location: 'Fireproof safe',
      isDigital: true,
      notes: 'Home, auto, life, and health insurance policies',
      isEssential: true
    },
    {
      id: '9',
      name: 'Medical Records',
      category: 'Medical',
      location: 'Fireproof safe',
      isDigital: true,
      notes: 'Medical history, prescriptions, and vaccination records',
      isEssential: true
    },
    {
      id: '10',
      name: 'Financial Documents',
      category: 'Financial',
      location: 'Fireproof safe',
      isDigital: true,
      notes: 'Bank statements, investment accounts, retirement plans',
      isEssential: true
    },
    {
      id: '11',
      name: 'Wills and Trusts',
      category: 'Legal',
      location: 'Fireproof safe',
      isDigital: false,
      notes: 'Wills, trusts, and power of attorney documents',
      isEssential: true
    },
    {
      id: '12',
      name: 'Tax Returns',
      category: 'Financial',
      location: 'Fireproof safe',
      isDigital: true,
      notes: 'Last 3 years of tax returns',
      isEssential: false
    },
    {
      id: '13',
      name: 'Pet Records',
      category: 'Medical',
      location: 'Fireproof safe',
      isDigital: false,
      notes: 'Pet vaccination records and medical history',
      isEssential: false
    },
    {
      id: '14',
      name: 'Emergency Contact List',
      category: 'Emergency',
      location: 'Multiple locations',
      isDigital: true,
      notes: 'List of emergency contacts and important phone numbers',
      isEssential: true
    },
    {
      id: '15',
      name: 'Emergency Plan',
      category: 'Emergency',
      location: 'Multiple locations',
      isDigital: true,
      notes: 'Family emergency plan and evacuation procedures',
      isEssential: true
    }
  ])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingDocument, setEditingDocument] = useState<Document | null>(null)
  const [newDocument, setNewDocument] = useState<Omit<Document, 'id'>>({
    name: '',
    category: '',
    location: '',
    expiryDate: '',
    isDigital: false,
    notes: '',
    isEssential: false
  })

  useEffect(() => {
    const saved = localStorage.getItem('documents')
    if (saved) {
      setDocuments(JSON.parse(saved))
    }
  }, [])

  const saveDocuments = (docsList: Document[]) => {
    setDocuments(docsList)
    localStorage.setItem('documents', JSON.stringify(docsList))
  }

  const addDocument = () => {
    const doc: Document = {
      ...newDocument,
      id: Date.now().toString()
    }
    const updated = [...documents, doc]
    saveDocuments(updated)
    setNewDocument({
      name: '',
      category: '',
      location: '',
      expiryDate: '',
      isDigital: false,
      notes: '',
      isEssential: false
    })
    setShowAddModal(false)
  }

  const updateDocument = () => {
    if (!editingDocument) return
    const updated = documents.map(doc => 
      doc.id === editingDocument.id ? editingDocument : doc
    )
    saveDocuments(updated)
    setEditingDocument(null)
  }

  const deleteDocument = (id: string) => {
    const updated = documents.filter(doc => doc.id !== id)
    saveDocuments(updated)
  }

  const categories = [
    'Personal ID', 'Financial', 'Medical', 'Insurance', 'Legal', 
    'Property', 'Vehicle', 'Employment', 'Education', 'Other'
  ]

  const essentialDocuments = [
    { name: 'Birth Certificates', category: 'Personal ID', isEssential: true },
    { name: 'Social Security Cards', category: 'Personal ID', isEssential: true },
    { name: 'Passports', category: 'Personal ID', isEssential: true },
    { name: 'Driver\'s Licenses', category: 'Personal ID', isEssential: true },
    { name: 'Insurance Policies', category: 'Insurance', isEssential: true },
    { name: 'Medical Records', category: 'Medical', isEssential: true },
    { name: 'Property Deeds', category: 'Property', isEssential: true },
    { name: 'Vehicle Titles', category: 'Vehicle', isEssential: true },
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Personal Identification':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Financial':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Medical':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'Insurance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Legal':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Property':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Vehicle':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200'
      case 'Employment':
        return 'bg-pink-100 text-pink-800 border-pink-200'
      case 'Education':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'Emergency':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Important Documents Binder</h2>
          <p className="text-gray-600">
            Track your important documents and their locations for quick access during emergencies.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-brown-600 text-white rounded-lg hover:bg-brown-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Document</span>
        </button>
      </div>



      {/* Your Documents */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Your Documents</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {documents.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No documents added yet. Add your first document to get started!</p>
            </div>
          ) : (
            documents.map((doc) => (
              <div key={doc.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{doc.name}</h4>
                      {doc.isEssential && (
                        <Star className="h-4 w-4 text-brown-500 flex-shrink-0" />
                      )}
                                             <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(doc.category)}`}>
                          {doc.category}
                        </span>
                      {doc.isDigital && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          Digital
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="font-medium">Location:</span>
                        <span className="ml-1">{doc.location || 'Not specified'}</span>
                      </div>
                      {doc.expiryDate && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="font-medium">Expires:</span>
                          <span className="ml-1">{format(new Date(doc.expiryDate), 'MMM dd, yyyy')}</span>
                        </div>
                      )}
                      {doc.notes && (
                        <div>
                          <span className="font-medium">Notes:</span>
                          <span className="ml-1">{doc.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setEditingDocument(doc)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteDocument(doc.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingDocument) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingDocument ? 'Edit Document' : 'Add Document'}
              </h3>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); editingDocument ? updateDocument() : addDocument() }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Name</label>
                <input
                  type="text"
                  value={editingDocument?.name || newDocument.name}
                  onChange={(e) => editingDocument 
                    ? setEditingDocument({...editingDocument, name: e.target.value})
                    : setNewDocument({...newDocument, name: e.target.value})
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={editingDocument?.category || newDocument.category}
                  onChange={(e) => editingDocument 
                    ? setEditingDocument({...editingDocument, category: e.target.value})
                    : setNewDocument({...newDocument, category: e.target.value})
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={editingDocument?.location || newDocument.location}
                  onChange={(e) => editingDocument 
                    ? setEditingDocument({...editingDocument, location: e.target.value})
                    : setNewDocument({...newDocument, location: e.target.value})
                  }
                  placeholder="Where is this document stored?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (Optional)</label>
                <input
                  type="date"
                  value={editingDocument?.expiryDate || newDocument.expiryDate}
                  onChange={(e) => editingDocument 
                    ? setEditingDocument({...editingDocument, expiryDate: e.target.value})
                    : setNewDocument({...newDocument, expiryDate: e.target.value})
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <textarea
                  value={editingDocument?.notes || newDocument.notes}
                  onChange={(e) => editingDocument 
                    ? setEditingDocument({...editingDocument, notes: e.target.value})
                    : setNewDocument({...newDocument, notes: e.target.value})
                  }
                  rows={3}
                  placeholder="Any additional notes about this document"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isDigital"
                    checked={editingDocument?.isDigital || newDocument.isDigital}
                    onChange={(e) => editingDocument 
                      ? setEditingDocument({...editingDocument, isDigital: e.target.checked})
                      : setNewDocument({...newDocument, isDigital: e.target.checked})
                    }
                    className="h-4 w-4 text-brown-600 focus:ring-brown-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isDigital" className="ml-2 block text-sm text-gray-900">
                    Digital document (stored electronically)
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isEssential"
                    checked={editingDocument?.isEssential || newDocument.isEssential}
                    onChange={(e) => editingDocument 
                      ? setEditingDocument({...editingDocument, isEssential: e.target.checked})
                      : setNewDocument({...newDocument, isEssential: e.target.checked})
                    }
                    className="h-4 w-4 text-brown-600 focus:ring-brown-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isEssential" className="ml-2 block text-sm text-gray-900">
                    Mark as essential document
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingDocument(null) }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brown-600 text-white rounded-md hover:bg-brown-700 transition-colors"
                >
                  {editingDocument ? 'Update' : 'Add'} Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 