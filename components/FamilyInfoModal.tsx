'use client'

import { useState } from 'react'
import { X, Users, MapPin, FileText } from 'lucide-react'
import { FamilyInfo } from '@/types'

interface FamilyInfoModalProps {
  familyInfo: FamilyInfo
  onSave: (familyInfo: FamilyInfo) => void
  onClose: () => void
}

export default function FamilyInfoModal({ familyInfo, onSave, onClose }: FamilyInfoModalProps) {
  const [formData, setFormData] = useState<FamilyInfo>(familyInfo)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (field: keyof FamilyInfo, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-brown-100 rounded-lg">
              <Users className="h-6 w-6 text-brown-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Family Information</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Adults
              </label>
              <input
                type="number"
                min="0"
                value={formData.adults}
                onChange={(e) => handleChange('adults', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Children
              </label>
              <input
                type="number"
                min="0"
                value={formData.children}
                onChange={(e) => handleChange('children', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Pets
              </label>
              <input
                type="number"
                min="0"
                value={formData.pets}
                onChange={(e) => handleChange('pets', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location/Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Enter your address or general location"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Needs or Medical Conditions
            </label>
            <textarea
              value={formData.specialNeeds}
              onChange={(e) => handleChange('specialNeeds', e.target.value)}
              placeholder="List any special needs, medical conditions, or requirements for family members"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emergency Plan Notes
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <textarea
                value={formData.emergencyPlan}
                onChange={(e) => handleChange('emergencyPlan', e.target.value)}
                placeholder="Notes about your emergency plan, meeting points, evacuation routes, etc."
                rows={4}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="bg-brown-50 border border-brown-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-brown-800 mb-2">Why This Matters</h3>
            <p className="text-sm text-brown-700">
              Your family information helps us customize the checklist quantities and recommendations 
              specifically for your household size and needs. This ensures you have the right amount 
              of supplies for everyone in your family.
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brown-600 text-white rounded-md hover:bg-brown-700 transition-colors"
            >
              Save Family Info
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 