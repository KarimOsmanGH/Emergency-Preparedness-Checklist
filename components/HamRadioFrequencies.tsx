'use client'

import { useState, useEffect } from 'react'
import { Plus, Radio, MapPin, Star, Trash2, Edit } from 'lucide-react'
import { HamFrequency } from '@/types'

export default function HamRadioFrequencies() {
  const [frequencies, setFrequencies] = useState<HamFrequency[]>([
    {
      id: '1',
      frequency: '146.52 MHz',
      description: 'National Calling Frequency (2m) - FM',
      location: 'Emergency Communications',
      notes: 'Primary emergency calling frequency for 2-meter band',
      isEmergency: true
    },
    {
      id: '2',
      frequency: '446.00 MHz',
      description: 'National Calling Frequency (70cm) - FM',
      location: 'Emergency Communications',
      notes: 'Primary emergency calling frequency for 70cm band',
      isEmergency: true
    },
    {
      id: '3',
      frequency: '7.074 MHz',
      description: '40m Emergency Frequency - LSB',
      location: 'Emergency Communications',
      notes: 'Emergency communications on 40-meter band',
      isEmergency: true
    },
    {
      id: '4',
      frequency: '14.074 MHz',
      description: '20m Emergency Frequency - USB',
      location: 'Emergency Communications',
      notes: 'Emergency communications on 20-meter band',
      isEmergency: true
    },
    {
      id: '5',
      frequency: '3.977 MHz',
      description: '80m Emergency Frequency - LSB',
      location: 'Emergency Communications',
      notes: 'Emergency communications on 80-meter band',
      isEmergency: true
    },
    {
      id: '6',
      frequency: '147.42 MHz',
      description: 'Local Repeater - FM',
      location: 'Local Communications',
      notes: 'Local amateur radio repeater for area communications',
      isEmergency: false
    },
    {
      id: '7',
      frequency: '147.48 MHz',
      description: 'Backup Repeater - FM',
      location: 'Local Communications',
      notes: 'Backup local repeater frequency',
      isEmergency: false
    },
    {
      id: '8',
      frequency: '162.400 MHz',
      description: 'NOAA Weather Radio - FM',
      location: 'Weather Information',
      notes: 'National Weather Service broadcasts',
      isEmergency: false
    },
    {
      id: '9',
      frequency: '162.425 MHz',
      description: 'NOAA Weather Radio (Alt) - FM',
      location: 'Weather Information',
      notes: 'Alternative NOAA weather frequency',
      isEmergency: false
    },
    {
      id: '10',
      frequency: '162.450 MHz',
      description: 'NOAA Weather Radio (Alt) - FM',
      location: 'Weather Information',
      notes: 'Alternative NOAA weather frequency',
      isEmergency: false
    },
    {
      id: '11',
      frequency: '14.313 MHz',
      description: 'International Emergency Frequency - USB',
      location: 'Emergency Communications',
      notes: 'International Frequency for Emergency Communications',
      isEmergency: true
    },
    {
      id: '12',
      frequency: '3.690 MHz',
      description: 'Long Distance Communication - LSB',
      location: 'Long Distance',
      notes: 'Commonly used for long-distance communication',
      isEmergency: false
    },
    {
      id: '13',
      frequency: '7.200 MHz',
      description: 'Nighttime Emergency Frequency - LSB',
      location: 'Emergency Communications',
      notes: 'Nighttime Frequency for Emergency Communications',
      isEmergency: true
    },
    {
      id: '14',
      frequency: '147.000 MHz',
      description: 'Local Communication - FM',
      location: 'Local Communications',
      notes: 'Commonly used for local communication in the United States',
      isEmergency: false
    },
    {
      id: '15',
      frequency: '28.400 MHz',
      description: 'DX Communication - USB',
      location: 'Long Distance',
      notes: 'Popular for DXing (communicating with distant stations)',
      isEmergency: false
    },
    {
      id: '16',
      frequency: '50.125 MHz',
      description: 'Six-Meter Communication - FM',
      location: 'Long Distance',
      notes: 'Six-meter band for longer distance communication',
      isEmergency: false
    },
    {
      id: '17',
      frequency: '144.200 MHz',
      description: 'Two-Meter Communication - FM',
      location: 'Local Communications',
      notes: 'Two-meter band for local and emergency communication',
      isEmergency: false
    },
    {
      id: '18',
      frequency: '10.140 MHz',
      description: 'Digital Communication - USB',
      location: 'Digital Modes',
      notes: 'Popular for digital modes such as PSK31',
      isEmergency: false
    },
    {
      id: '19',
      frequency: '21.200 MHz',
      description: 'DX and Contesting - USB',
      location: 'Long Distance',
      notes: 'Popular for DXing and contesting',
      isEmergency: false
    },
    {
      id: '20',
      frequency: '145.500 MHz',
      description: 'Simplex Communication - FM',
      location: 'Local Communications',
      notes: 'Simplex communication without repeater',
      isEmergency: false
    }
  ])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingFrequency, setEditingFrequency] = useState<HamFrequency | null>(null)
  const [newFrequency, setNewFrequency] = useState<Omit<HamFrequency, 'id'>>({
    frequency: '',
    description: '',
    location: '',
    notes: '',
    isEmergency: false
  })

  useEffect(() => {
    const saved = localStorage.getItem('hamFrequencies')
    if (saved) {
      setFrequencies(JSON.parse(saved))
    }
  }, [])

  const saveFrequencies = (freqList: HamFrequency[]) => {
    setFrequencies(freqList)
    localStorage.setItem('hamFrequencies', JSON.stringify(freqList))
  }

  const addFrequency = () => {
    const freq: HamFrequency = {
      ...newFrequency,
      id: Date.now().toString()
    }
    const updated = [...frequencies, freq]
    saveFrequencies(updated)
    setNewFrequency({
      frequency: '',
      description: '',
      location: '',
      notes: '',
      isEmergency: false
    })
    setShowAddModal(false)
  }

  const updateFrequency = () => {
    if (!editingFrequency) return
    const updated = frequencies.map(freq => 
      freq.id === editingFrequency.id ? editingFrequency : freq
    )
    saveFrequencies(updated)
    setEditingFrequency(null)
  }

  const deleteFrequency = (id: string) => {
    const updated = frequencies.filter(freq => freq.id !== id)
    saveFrequencies(updated)
  }

  const commonFrequencies = [
    { frequency: '146.520 MHz', description: 'National Calling Frequency (2m)', location: 'Nationwide', isEmergency: true },
    { frequency: '446.000 MHz', description: 'National Calling Frequency (70cm)', location: 'Nationwide', isEmergency: true },
    { frequency: '52.525 MHz', description: 'National Calling Frequency (6m)', location: 'Nationwide', isEmergency: true },
    { frequency: '7.074 MHz', description: '40m Emergency Frequency', location: 'Nationwide', isEmergency: true },
    { frequency: '14.074 MHz', description: '20m Emergency Frequency', location: 'Nationwide', isEmergency: true },
  ]

  const getCategoryColor = (location: string) => {
    switch (location) {
      case 'Emergency Communications':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'Local Communications':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Long Distance':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Weather Information':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Digital Modes':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">HAM Radio Frequencies</h2>
          <p className="text-gray-600">
            Store important HAM radio frequencies for emergency communication.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-brown-600 text-white rounded-lg hover:bg-brown-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Frequency</span>
        </button>
      </div>



      {/* Your Frequencies */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Your Frequencies</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {frequencies.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Radio className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No frequencies added yet. Add your first frequency to get started!</p>
            </div>
          ) : (
            frequencies.map((freq) => (
              <div key={freq.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{freq.frequency}</h4>
                      {freq.isEmergency && (
                        <Star className="h-4 w-4 text-brown-500 flex-shrink-0" />
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{freq.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="font-medium">Location:</span>
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getCategoryColor(freq.location)}`}>
                          {freq.location}
                        </span>
                      </div>
                      {freq.notes && (
                        <div>
                          <span className="font-medium">Notes:</span>
                          <span className="ml-1">{freq.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setEditingFrequency(freq)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteFrequency(freq.id)}
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
      {(showAddModal || editingFrequency) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingFrequency ? 'Edit Frequency' : 'Add Frequency'}
              </h3>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); editingFrequency ? updateFrequency() : addFrequency() }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                <input
                  type="text"
                  value={editingFrequency?.frequency || newFrequency.frequency}
                  onChange={(e) => editingFrequency 
                    ? setEditingFrequency({...editingFrequency, frequency: e.target.value})
                    : setNewFrequency({...newFrequency, frequency: e.target.value})
                  }
                  placeholder="e.g., 146.520 MHz"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={editingFrequency?.description || newFrequency.description}
                  onChange={(e) => editingFrequency 
                    ? setEditingFrequency({...editingFrequency, description: e.target.value})
                    : setNewFrequency({...newFrequency, description: e.target.value})
                  }
                  placeholder="e.g., Local repeater, Emergency frequency"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={editingFrequency?.location || newFrequency.location}
                  onChange={(e) => editingFrequency 
                    ? setEditingFrequency({...editingFrequency, location: e.target.value})
                    : setNewFrequency({...newFrequency, location: e.target.value})
                  }
                  placeholder="e.g., Local area, City name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <textarea
                  value={editingFrequency?.notes || newFrequency.notes}
                  onChange={(e) => editingFrequency 
                    ? setEditingFrequency({...editingFrequency, notes: e.target.value})
                    : setNewFrequency({...newFrequency, notes: e.target.value})
                  }
                  rows={3}
                  placeholder="Additional notes about this frequency"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isEmergency"
                  checked={editingFrequency?.isEmergency || newFrequency.isEmergency}
                  onChange={(e) => editingFrequency 
                    ? setEditingFrequency({...editingFrequency, isEmergency: e.target.checked})
                    : setNewFrequency({...newFrequency, isEmergency: e.target.checked})
                  }
                  className="h-4 w-4 text-brown-600 focus:ring-brown-500 border-gray-300 rounded"
                />
                <label htmlFor="isEmergency" className="ml-2 block text-sm text-gray-900">
                  Mark as emergency frequency
                </label>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingFrequency(null) }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brown-600 text-white rounded-md hover:bg-brown-700 transition-colors"
                >
                  {editingFrequency ? 'Update' : 'Add'} Frequency
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 