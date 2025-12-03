/**
 * EmergencyContacts Component
 * Manages emergency contact information
 */

'use client'

import { useState, useMemo, useCallback } from 'react'
import { Plus, Phone, Mail, MapPin, Star, Trash2, Edit, Search, X } from 'lucide-react'
import { EmergencyContact } from '@/types'
import { useContacts } from '@/hooks/useContacts'
import { useToast } from './Toast'
import ConfirmDialog from './ConfirmDialog'
import { CONTACT_RELATIONSHIPS, CONTACT_RELATIONSHIP_COLORS } from '@/lib/constants'
import { getCategoryColor } from '@/lib/utils'
import { contactSchema, validateForm } from '@/lib/validations'

const EMPTY_CONTACT: Omit<EmergencyContact, 'id'> = {
  name: '',
  relationship: '',
  phone: '',
  email: '',
  address: '',
  isEmergencyContact: false,
  notes: ''
}

export default function EmergencyContacts() {
  const { 
    contacts, 
    addContact, 
    updateContact, 
    deleteContact 
  } = useContacts()
  
  const { showToast } = useToast()
  
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null)
  const [newContact, setNewContact] = useState<Omit<EmergencyContact, 'id'>>(EMPTY_CONTACT)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; itemId: string | null }>({
    isOpen: false,
    itemId: null
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Filter contacts based on search
  const filteredContacts = useMemo(() => {
    if (!searchTerm.trim()) return contacts
    const lower = searchTerm.toLowerCase()
    return contacts.filter(contact => 
      contact.name.toLowerCase().includes(lower) ||
      contact.relationship.toLowerCase().includes(lower) ||
      contact.phone.toLowerCase().includes(lower)
    )
  }, [contacts, searchTerm])

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    
    const formData = editingContact || newContact
    const validation = validateForm(contactSchema, formData)
    
    if (!validation.success) {
      setErrors(validation.errors || {})
      showToast('error', 'Please fix the form errors')
      return
    }
    
    setErrors({})
    
    if (editingContact) {
      updateContact(editingContact.id, editingContact)
      showToast('success', `${editingContact.name} updated successfully`)
      setEditingContact(null)
    } else {
      addContact(newContact)
      showToast('success', `${newContact.name} added to contacts`)
      setNewContact(EMPTY_CONTACT)
      setShowAddModal(false)
    }
  }, [editingContact, newContact, addContact, updateContact, showToast])

  // Handle delete confirmation
  const handleDeleteClick = useCallback((id: string) => {
    setDeleteConfirm({ isOpen: true, itemId: id })
  }, [])

  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirm.itemId) {
      const contact = contacts.find(c => c.id === deleteConfirm.itemId)
      deleteContact(deleteConfirm.itemId)
      showToast('success', `${contact?.name || 'Contact'} deleted`)
    }
    setDeleteConfirm({ isOpen: false, itemId: null })
  }, [deleteConfirm.itemId, contacts, deleteContact, showToast])

  // Handle input changes
  const handleInputChange = useCallback((field: keyof Omit<EmergencyContact, 'id'>, value: string | boolean) => {
    if (editingContact) {
      setEditingContact({ ...editingContact, [field]: value })
    } else {
      setNewContact(prev => ({ ...prev, [field]: value }))
    }
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }, [editingContact, errors])

  const closeModal = useCallback(() => {
    setShowAddModal(false)
    setEditingContact(null)
    setErrors({})
    setNewContact(EMPTY_CONTACT)
  }, [])

  const currentContact = editingContact || newContact

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Emergency Contact List
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Keep track of important contacts for emergency situations.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-brown-600 text-white rounded-lg hover:bg-brown-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brown-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          aria-label="Add new contact"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Add Contact</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            aria-label="Search contacts"
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

      {/* Contacts List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="bg-gradient-to-r from-brown-50 to-brown-100 dark:from-brown-900/30 dark:to-brown-800/30 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Your Emergency Contacts ({filteredContacts.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredContacts.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              <Phone className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" aria-hidden="true" />
              <p>{searchTerm ? 'No contacts match your search.' : 'No contacts added yet. Add your first emergency contact to get started!'}</p>
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div key={contact.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{contact.name}</h4>
                      {contact.isEmergencyContact && (
                        <Star className="h-4 w-4 text-brown-500 dark:text-brown-400 flex-shrink-0" aria-label="Primary emergency contact" />
                      )}
                      <span className={`px-2 py-1 text-xs rounded-full border ${getCategoryColor(contact.relationship, CONTACT_RELATIONSHIP_COLORS)}`}>
                        {contact.relationship}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" aria-hidden="true" />
                        <span className="font-medium">Phone:</span>
                        <a 
                          href={`tel:${contact.phone}`}
                          className="ml-1 text-brown-600 dark:text-brown-400 hover:underline"
                        >
                          {contact.phone}
                        </a>
                      </div>
                      {contact.email && (
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" aria-hidden="true" />
                          <span className="font-medium">Email:</span>
                          <a 
                            href={`mailto:${contact.email}`}
                            className="ml-1 text-brown-600 dark:text-brown-400 hover:underline truncate"
                          >
                            {contact.email}
                          </a>
                        </div>
                      )}
                      {contact.address && (
                        <div className="flex items-start col-span-2 md:col-span-1">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" aria-hidden="true" />
                          <span className="font-medium">Address:</span>
                          <span className="ml-1">{contact.address}</span>
                        </div>
                      )}
                      {contact.notes && (
                        <div className="col-span-2">
                          <span className="font-medium">Notes:</span>
                          <span className="ml-1">{contact.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setEditingContact(contact)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-brown-500 rounded"
                      aria-label={`Edit ${contact.name}`}
                    >
                      <Edit className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(contact.id)}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                      aria-label={`Delete ${contact.name}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingContact) && (
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
                {editingContact ? 'Edit Contact' : 'Add Emergency Contact'}
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
                  Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={currentContact.name}
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
                <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Relationship *
                </label>
                <select
                  id="relationship"
                  value={currentContact.relationship}
                  onChange={(e) => handleInputChange('relationship', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.relationship ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  aria-invalid={!!errors.relationship}
                  aria-describedby={errors.relationship ? 'relationship-error' : undefined}
                >
                  <option value="">Select relationship</option>
                  {CONTACT_RELATIONSHIPS.map(rel => (
                    <option key={rel} value={rel}>{rel}</option>
                  ))}
                </select>
                {errors.relationship && (
                  <p id="relationship-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.relationship}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={currentContact.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? 'phone-error' : undefined}
                />
                {errors.phone && (
                  <p id="phone-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email (Optional)
                </label>
                <input
                  id="email"
                  type="email"
                  value={currentContact.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address (Optional)
                </label>
                <textarea
                  id="address"
                  value={currentContact.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  value={currentContact.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isEmergencyContact"
                  checked={currentContact.isEmergencyContact}
                  onChange={(e) => handleInputChange('isEmergencyContact', e.target.checked)}
                  className="h-4 w-4 text-brown-600 focus:ring-brown-500 border-gray-300 dark:border-gray-600 rounded"
                />
                <label htmlFor="isEmergencyContact" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  Mark as primary emergency contact
                </label>
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
                  {editingContact ? 'Update' : 'Add'} Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Contact"
        message="Are you sure you want to delete this contact? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ isOpen: false, itemId: null })}
      />
    </div>
  )
}
