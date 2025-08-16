'use client'

import { useState, useEffect } from 'react'
import { Plus, Phone, Mail, MapPin, Star, Trash2, Edit } from 'lucide-react'
import { EmergencyContact } from '@/types'

export default function EmergencyContacts() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    {
      id: '1',
      name: 'Local Police Department',
      relationship: 'Emergency Services',
      phone: '911',
      email: '',
      address: 'Local jurisdiction',
      isEmergencyContact: true,
      notes: 'Primary emergency contact for law enforcement'
    },
    {
      id: '2',
      name: 'Local Fire Department',
      relationship: 'Emergency Services',
      phone: '911',
      email: '',
      address: 'Local jurisdiction',
      isEmergencyContact: true,
      notes: 'Primary emergency contact for fire and rescue'
    },
    {
      id: '3',
      name: 'Nearest Hospital',
      relationship: 'Medical',
      phone: '(555) 123-4567',
      email: '',
      address: '123 Medical Center Dr, City, State',
      isEmergencyContact: true,
      notes: 'Nearest emergency medical facility'
    },
    {
      id: '4',
      name: 'Family Doctor',
      relationship: 'Medical',
      phone: '(555) 234-5678',
      email: 'doctor@medicalclinic.com',
      address: '456 Health Ave, City, State',
      isEmergencyContact: false,
      notes: 'Primary care physician'
    },
    {
      id: '5',
      name: 'Neighbor - John Smith',
      relationship: 'Neighbor',
      phone: '(555) 345-6789',
      email: 'john.smith@email.com',
      address: '789 Oak Street, City, State',
      isEmergencyContact: true,
      notes: 'Trusted neighbor for emergency assistance'
    },
    {
      id: '6',
      name: 'Work Supervisor',
      relationship: 'Work',
      phone: '(555) 456-7890',
      email: 'supervisor@company.com',
      address: 'Company Office, City, State',
      isEmergencyContact: false,
      notes: 'Work supervisor for emergency notifications'
    },
    {
      id: '7',
      name: 'Insurance Agent',
      relationship: 'Insurance',
      phone: '(555) 567-8901',
      email: 'agent@insurance.com',
      address: 'Insurance Office, City, State',
      isEmergencyContact: false,
      notes: 'Insurance agent for claims and assistance'
    },
    {
      id: '8',
      name: 'Utility Company',
      relationship: 'Utilities',
      phone: '(555) 678-9012',
      email: 'emergency@utility.com',
      address: 'Utility Office, City, State',
      isEmergencyContact: false,
      notes: 'Emergency utility services contact'
    }
  ])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null)
  const [newContact, setNewContact] = useState<Omit<EmergencyContact, 'id'>>({
    name: '',
    relationship: '',
    phone: '',
    email: '',
    address: '',
    isEmergencyContact: false,
    notes: ''
  })

  useEffect(() => {
    const saved = localStorage.getItem('emergencyContacts')
    if (saved) {
      const parsedSaved = JSON.parse(saved)
      if (parsedSaved.length > 0) {
        setContacts(parsedSaved)
      } else {
        // If saved data is empty array, use prefilled data and save it
        localStorage.setItem('emergencyContacts', JSON.stringify(contacts))
      }
    } else {
      // If no saved data, save the initial prefilled data to localStorage
      localStorage.setItem('emergencyContacts', JSON.stringify(contacts))
    }
  }, [])

  const saveContacts = (contactsList: EmergencyContact[]) => {
    setContacts(contactsList)
    localStorage.setItem('emergencyContacts', JSON.stringify(contactsList))
  }

  const addContact = () => {
    const contact: EmergencyContact = {
      ...newContact,
      id: Date.now().toString()
    }
    const updated = [...contacts, contact]
    saveContacts(updated)
    setNewContact({
      name: '',
      relationship: '',
      phone: '',
      email: '',
      address: '',
      isEmergencyContact: false,
      notes: ''
    })
    setShowAddModal(false)
  }

  const updateContact = () => {
    if (!editingContact) return
    const updated = contacts.map(contact => 
      contact.id === editingContact.id ? editingContact : contact
    )
    saveContacts(updated)
    setEditingContact(null)
  }

  const deleteContact = (id: string) => {
    const updated = contacts.filter(contact => contact.id !== id)
    saveContacts(updated)
  }

  const relationships = [
    'Spouse', 'Parent', 'Child', 'Sibling', 'Friend', 'Neighbor', 
    'Doctor', 'Lawyer', 'Insurance Agent', 'Work Contact', 'Other'
  ]

  const getCategoryColor = (relationship: string) => {
    switch (relationship) {
      case 'Emergency Services':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'Medical':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Neighbor':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Work':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Insurance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Utilities':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Family':
        return 'bg-pink-100 text-pink-800 border-pink-200'
      case 'Friend':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Emergency Contact List</h2>
          <p className="text-gray-600">
            Keep track of important contacts for emergency situations.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-brown-600 text-white rounded-lg hover:bg-brown-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Contact</span>
        </button>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="bg-gradient-to-r from-brown-50 to-brown-100 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Your Emergency Contacts</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {contacts.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Phone className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No contacts added yet. Add your first emergency contact to get started!</p>
            </div>
          ) : (
            contacts.map((contact) => (
              <div key={contact.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                      {contact.isEmergencyContact && (
                        <Star className="h-4 w-4 text-brown-500 flex-shrink-0" />
                      )}
                                             <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(contact.relationship)}`}>
                         {contact.relationship}
                       </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="font-medium">Phone:</span>
                        <span className="ml-1">{contact.phone}</span>
                      </div>
                      {contact.email && (
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="font-medium">Email:</span>
                          <span className="ml-1">{contact.email}</span>
                        </div>
                      )}
                      {contact.address && (
                        <div className="flex items-start col-span-2">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
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
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteContact(contact.id)}
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
      {(showAddModal || editingContact) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingContact ? 'Edit Contact' : 'Add Emergency Contact'}
              </h3>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); editingContact ? updateContact() : addContact() }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editingContact?.name || newContact.name}
                  onChange={(e) => editingContact 
                    ? setEditingContact({...editingContact, name: e.target.value})
                    : setNewContact({...newContact, name: e.target.value})
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                <select
                  value={editingContact?.relationship || newContact.relationship}
                  onChange={(e) => editingContact 
                    ? setEditingContact({...editingContact, relationship: e.target.value})
                    : setNewContact({...newContact, relationship: e.target.value})
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                  required
                >
                  <option value="">Select relationship</option>
                  {relationships.map(rel => (
                    <option key={rel} value={rel}>{rel}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={editingContact?.phone || newContact.phone}
                  onChange={(e) => editingContact 
                    ? setEditingContact({...editingContact, phone: e.target.value})
                    : setNewContact({...newContact, phone: e.target.value})
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={editingContact?.email || newContact.email}
                  onChange={(e) => editingContact 
                    ? setEditingContact({...editingContact, email: e.target.value})
                    : setNewContact({...newContact, email: e.target.value})
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address (Optional)</label>
                <textarea
                  value={editingContact?.address || newContact.address}
                  onChange={(e) => editingContact 
                    ? setEditingContact({...editingContact, address: e.target.value})
                    : setNewContact({...newContact, address: e.target.value})
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <textarea
                  value={editingContact?.notes || newContact.notes}
                  onChange={(e) => editingContact 
                    ? setEditingContact({...editingContact, notes: e.target.value})
                    : setNewContact({...newContact, notes: e.target.value})
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isEmergencyContact"
                  checked={editingContact?.isEmergencyContact || newContact.isEmergencyContact}
                  onChange={(e) => editingContact 
                    ? setEditingContact({...editingContact, isEmergencyContact: e.target.checked})
                    : setNewContact({...newContact, isEmergencyContact: e.target.checked})
                  }
                  className="h-4 w-4 text-brown-600 focus:ring-brown-500 border-gray-300 rounded"
                />
                <label htmlFor="isEmergencyContact" className="ml-2 block text-sm text-gray-900">
                  Mark as primary emergency contact
                </label>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingContact(null) }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brown-600 text-white rounded-md hover:bg-brown-700 transition-colors"
                >
                  {editingContact ? 'Update' : 'Add'} Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 