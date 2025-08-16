'use client'

import { useState, useEffect } from 'react'
import { Shield, Users, BookOpen, Radio, FileText, AlertTriangle, CheckCircle, Clock, Edit, Settings, Download } from 'lucide-react'
import ChecklistSection from '@/components/ChecklistSection'
import PantryManager from '@/components/PantryManager'
import BooksManager from '@/components/BooksManager'
import EmergencyContacts from '@/components/EmergencyContacts'
import HamRadioFrequencies from '@/components/HamRadioFrequencies'
import DocumentsBinder from '@/components/DocumentsBinder'
import ExportManager from '@/components/ExportManager'
import { FamilyInfo, ChecklistItem } from '@/types'

export default function Home() {
  const [familyInfo, setFamilyInfo] = useState<FamilyInfo>({
    adults: 2,
    children: 0,
    pets: 0,
    specialNeeds: '',
    location: '',
    emergencyPlan: ''
  })

  const [isEditingFamily, setIsEditingFamily] = useState(false)
  const [isEditingMetrics, setIsEditingMetrics] = useState(false)
  const [activeTab, setActiveTab] = useState('checklist')
  const [metricsSettings, setMetricsSettings] = useState({
    volume: 'gallons',
    weight: 'pounds',
    temperature: 'fahrenheit',
    distance: 'miles'
  })

  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    {
      id: 1,
      category: 'Water & Hydration',
      items: [
        { id: 'water-1', text: 'Water', completed: false, quantity: 1 },
        { id: 'water-2', text: 'Water filter', completed: false, quantity: 1 },
        { id: 'water-3', text: 'Water purification tablet', completed: false, quantity: 1 },
        { id: 'water-4', text: 'Distilled water', completed: false, quantity: 1 },
        { id: 'water-5', text: 'Water bottle', completed: false, quantity: 1 },
        { id: 'water-6', text: 'Foldable water bottle', completed: false, quantity: 1 },
        { id: 'water-7', text: 'Kettle', completed: false, quantity: 1 },
        { id: 'water-8', text: 'Thermos', completed: false, quantity: 1 },
      ]
    },
    {
      id: 2,
      category: 'Food & Nutrition',
      items: [
        { id: 'food-1', text: 'Salt', completed: false, quantity: 1 },
        { id: 'food-2', text: 'Sugar', completed: false, quantity: 1 },
        { id: 'food-3', text: 'Baby food', completed: false, quantity: 1 },
        { id: 'food-4', text: 'Dry fruits', completed: false, quantity: 1 },
        { id: 'food-5', text: 'Spices', completed: false, quantity: 1 },
        { id: 'food-6', text: 'Baking soda', completed: false, quantity: 1 },
        { id: 'food-7', text: 'Preserves', completed: false, quantity: 1 },
        { id: 'food-8', text: 'Biscuit', completed: false, quantity: 1 },
        { id: 'food-9', text: 'Protein bar', completed: false, quantity: 1 },
        { id: 'food-10', text: 'Mixed nuts', completed: false, quantity: 1 },
        { id: 'food-11', text: 'NRG-5 food ration', completed: false, quantity: 1 },
        { id: 'food-12', text: 'Cooking utensils', completed: false, quantity: 1 },
        { id: 'food-13', text: 'Animal foods', completed: false, quantity: 1 },
      ]
    },
    {
      id: 3,
      category: 'Medical & First Aid',
      items: [
        { id: 'medical-1', text: 'Medical adhesive tape', completed: false, quantity: 1 },
        { id: 'medical-2', text: 'Bandages', completed: false, quantity: 1 },
        { id: 'medical-3', text: 'Eye pads', completed: false, quantity: 1 },
        { id: 'medical-4', text: 'Waterproof band-aid', completed: false, quantity: 1 },
        { id: 'medical-5', text: 'Thermometer', completed: false, quantity: 1 },
        { id: 'medical-6', text: 'Medicine box', completed: false, quantity: 1 },
        { id: 'medical-7', text: 'Safety pin', completed: false, quantity: 1 },
        { id: 'medical-8', text: 'Disinfectant spray', completed: false, quantity: 1 },
        { id: 'medical-9', text: 'Oral thermometer', completed: false, quantity: 1 },
        { id: 'medical-10', text: 'Tweezers', completed: false, quantity: 1 },
        { id: 'medical-11', text: 'Antiseptics', completed: false, quantity: 1 },
        { id: 'medical-12', text: 'Eye drops', completed: false, quantity: 1 },
        { id: 'medical-13', text: 'Aspirin', completed: false, quantity: 1 },
        { id: 'medical-14', text: 'Hot compress', completed: false, quantity: 1 },
        { id: 'medical-15', text: 'Cold compress', completed: false, quantity: 1 },
        { id: 'medical-16', text: 'Burn cream', completed: false, quantity: 1 },
        { id: 'medical-17', text: 'Wrist splint', completed: false, quantity: 1 },
        { id: 'medical-18', text: 'Painkiller', completed: false, quantity: 1 },
        { id: 'medical-19', text: 'Necessary medicines', completed: false, quantity: 1 },
        { id: 'medical-20', text: 'Diarrhea medication', completed: false, quantity: 1 },
        { id: 'medical-21', text: 'Antihistamine tablets', completed: false, quantity: 1 },
        { id: 'medical-22', text: 'Antibiotics', completed: false, quantity: 1 },
        { id: 'medical-23', text: 'CPR Mask', completed: false, quantity: 1 },
        { id: 'medical-24', text: 'Elastic bandage', completed: false, quantity: 1 },
        { id: 'medical-25', text: 'Skin rash cream', completed: false, quantity: 1 },
        { id: 'medical-26', text: 'Tourniquet strap', completed: false, quantity: 1 },
        { id: 'medical-27', text: 'Medical mask', completed: false, quantity: 1 },
        { id: 'medical-28', text: 'Sterile gloves', completed: false, quantity: 1 },
        { id: 'medical-29', text: 'Sterile gauze pads', completed: false, quantity: 1 },
        { id: 'medical-30', text: 'Wound healing creme', completed: false, quantity: 1 },
        { id: 'medical-31', text: 'Vitamins', completed: false, quantity: 1 },
        { id: 'medical-32', text: 'First aid scissors', completed: false, quantity: 1 },
        { id: 'medical-33', text: 'First aid booklet', completed: false, quantity: 1 },
        { id: 'medical-34', text: 'Antiseptic wipes', completed: false, quantity: 1 },
      ]
    },
    {
      id: 4,
      category: 'Tools & Equipment',
      items: [
        { id: 'tools-1', text: 'Duct tape', completed: false, quantity: 1 },
        { id: 'tools-2', text: 'Gas mask', completed: false, quantity: 1 },
        { id: 'tools-3', text: 'Battery', completed: false, quantity: 1 },
        { id: 'tools-4', text: 'Lighter', completed: false, quantity: 1 },
        { id: 'tools-5', text: 'Whistle', completed: false, quantity: 1 },
        { id: 'tools-6', text: 'Firesteel', completed: false, quantity: 1 },
        { id: 'tools-7', text: 'Work gloves', completed: false, quantity: 1 },
        { id: 'tools-8', text: 'Portable pickaxe', completed: false, quantity: 1 },
        { id: 'tools-9', text: 'Razor blade', completed: false, quantity: 1 },
        { id: 'tools-10', text: 'Carabiner clips', completed: false, quantity: 1 },
        { id: 'tools-11', text: 'Pocket knife', completed: false, quantity: 1 },
        { id: 'tools-12', text: 'Watch', completed: false, quantity: 1 },
        { id: 'tools-13', text: 'Fishing gear', completed: false, quantity: 1 },
        { id: 'tools-14', text: 'Pen', completed: false, quantity: 1 },
        { id: 'tools-15', text: 'Screwdriver set', completed: false, quantity: 1 },
        { id: 'tools-16', text: 'Outdoor saw', completed: false, quantity: 1 },
        { id: 'tools-17', text: 'Plastic handcuff', completed: false, quantity: 1 },
        { id: 'tools-18', text: 'Rope', completed: false, quantity: 1 },
        { id: 'tools-19', text: 'Scissors', completed: false, quantity: 1 },
        { id: 'tools-20', text: 'Nail scissors', completed: false, quantity: 1 },
        { id: 'tools-21', text: 'Sewing kit', completed: false, quantity: 1 },
        { id: 'tools-22', text: 'Geiger counter', completed: false, quantity: 1 },
        { id: 'tools-23', text: 'Gas mask NBC filter', completed: false, quantity: 1 },
        { id: 'tools-24', text: 'Compass', completed: false, quantity: 1 },
        { id: 'tools-25', text: 'Map', completed: false, quantity: 1 },
        { id: 'tools-26', text: 'Tent', completed: false, quantity: 1 },
        { id: 'tools-27', text: 'Helmet', completed: false, quantity: 1 },
        { id: 'tools-28', text: 'Backpack', completed: false, quantity: 1 },
        { id: 'tools-29', text: 'Life vest', completed: false, quantity: 1 },
      ]
    },
    {
      id: 5,
      category: 'Electronics & Communication',
      items: [
        { id: 'electronics-1', text: 'Phone charger', completed: false, quantity: 1 },
        { id: 'electronics-2', text: 'USB battery', completed: false, quantity: 1 },
        { id: 'electronics-3', text: 'Portable solar panel', completed: false, quantity: 1 },
        { id: 'electronics-4', text: 'USB cooler/heater', completed: false, quantity: 1 },
        { id: 'electronics-5', text: 'Dumb phone', completed: false, quantity: 1 },
        { id: 'electronics-6', text: 'USB memory stick', completed: false, quantity: 1 },
        { id: 'electronics-7', text: 'Starlink', completed: false, quantity: 1 },
        { id: 'electronics-8', text: 'Powerbank', completed: false, quantity: 1 },
        { id: 'electronics-9', text: 'Headlamp', completed: false, quantity: 1 },
        { id: 'electronics-10', text: 'Headphone', completed: false, quantity: 1 },
        { id: 'electronics-11', text: 'Radio', completed: false, quantity: 1 },
        { id: 'electronics-12', text: 'HAM Radio', completed: false, quantity: 1 },
        { id: 'electronics-13', text: 'Flashlight (battery/dynamo/USB)', completed: false, quantity: 1 },
        { id: 'electronics-14', text: 'Candle', completed: false, quantity: 1 },
        { id: 'electronics-15', text: 'Matches', completed: false, quantity: 1 },
      ]
    },
    {
      id: 6,
      category: 'Personal Care & Hygiene',
      items: [
        { id: 'hygiene-1', text: 'Wet wipes', completed: false, quantity: 1 },
        { id: 'hygiene-2', text: 'T-shirt', completed: false, quantity: 1 },
        { id: 'hygiene-3', text: 'Towel', completed: false, quantity: 1 },
        { id: 'hygiene-4', text: 'Shampoo', completed: false, quantity: 1 },
        { id: 'hygiene-5', text: 'Hair comb', completed: false, quantity: 1 },
        { id: 'hygiene-6', text: 'Trousers', completed: false, quantity: 1 },
        { id: 'hygiene-7', text: 'Seasonal clothes', completed: false, quantity: 1 },
        { id: 'hygiene-8', text: 'Toothpaste', completed: false, quantity: 1 },
        { id: 'hygiene-9', text: 'Toothbrush', completed: false, quantity: 1 },
        { id: 'hygiene-10', text: 'Sneakers', completed: false, quantity: 1 },
        { id: 'hygiene-11', text: 'Socks', completed: false, quantity: 1 },
        { id: 'hygiene-12', text: 'Soap', completed: false, quantity: 1 },
        { id: 'hygiene-13', text: 'Underwear', completed: false, quantity: 1 },
        { id: 'hygiene-14', text: 'Protective clothes', completed: false, quantity: 1 },
        { id: 'hygiene-15', text: 'Dust mask', completed: false, quantity: 1 },
        { id: 'hygiene-16', text: 'Safety Glasses', completed: false, quantity: 1 },
        { id: 'hygiene-17', text: 'Sunglasses', completed: false, quantity: 1 },
        { id: 'hygiene-18', text: 'Sanitary pads', completed: false, quantity: 1 },
        { id: 'hygiene-19', text: 'Contact lenses', completed: false, quantity: 1 },
        { id: 'hygiene-20', text: 'Glasses', completed: false, quantity: 1 },
        { id: 'hygiene-21', text: 'Hair washing bonnet', completed: false, quantity: 1 },
        { id: 'hygiene-22', text: 'Toilet paper', completed: false, quantity: 1 },
        { id: 'hygiene-23', text: 'Garbage bag', completed: false, quantity: 1 },
        { id: 'hygiene-24', text: 'Laundry bag', completed: false, quantity: 1 },
        { id: 'hygiene-25', text: 'Alcohol wipes', completed: false, quantity: 1 },
        { id: 'hygiene-26', text: 'Insect repellent spray', completed: false, quantity: 1 },
      ]
    },
    {
      id: 7,
      category: 'Shelter & Comfort',
      items: [
        { id: 'shelter-1', text: 'Blanket', completed: false, quantity: 1 },
        { id: 'shelter-2', text: 'Mat', completed: false, quantity: 1 },
        { id: 'shelter-3', text: 'Hand warmer', completed: false, quantity: 1 },
        { id: 'shelter-4', text: 'Cotton', completed: false, quantity: 1 },
        { id: 'shelter-5', text: 'Sleeping bag', completed: false, quantity: 1 },
        { id: 'shelter-6', text: 'CVS cups', completed: false, quantity: 1 },
        { id: 'shelter-7', text: 'Inflatable bed', completed: false, quantity: 1 },
        { id: 'shelter-8', text: 'Pillow', completed: false, quantity: 1 },
        { id: 'shelter-9', text: 'Sleeping mat', completed: false, quantity: 1 },
        { id: 'shelter-10', text: 'Thermal blanket', completed: false, quantity: 1 },
        { id: 'shelter-11', text: 'Raincoat', completed: false, quantity: 1 },
      ]
    },
    {
      id: 8,
      category: 'Documents & Money',
      items: [
        { id: 'docs-1', text: 'Banknotes and coins', completed: false, quantity: 1 },
        { id: 'docs-2', text: 'Printed deed', completed: false, quantity: 1 },
        { id: 'docs-3', text: 'Printed military discharge certificate', completed: false, quantity: 1 },
        { id: 'docs-4', text: 'Printed diploma', completed: false, quantity: 1 },
        { id: 'docs-5', text: 'Printed copy of passport', completed: false, quantity: 1 },
        { id: 'docs-6', text: 'Printed headshot photos', completed: false, quantity: 1 },
        { id: 'docs-7', text: 'Printed driving license', completed: false, quantity: 1 },
        { id: 'docs-8', text: 'Printed identity card', completed: false, quantity: 1 },
        { id: 'docs-9', text: 'Printed insurance papers', completed: false, quantity: 1 },
        { id: 'docs-10', text: 'Wallet', completed: false, quantity: 1 },
        { id: 'docs-11', text: 'House keys', completed: false, quantity: 1 },
        { id: 'docs-12', text: 'Contacts list', completed: false, quantity: 1 },
        { id: 'docs-13', text: 'Notebook', completed: false, quantity: 1 },
        { id: 'docs-14', text: 'Jewelry', completed: false, quantity: 1 },
        { id: 'docs-15', text: 'Gold and silver', completed: false, quantity: 1 },
      ]
    },
    {
      id: 9,
      category: 'Special Items',
      items: [
        { id: 'special-1', text: 'Baby items', completed: false, quantity: 1 },
        { id: 'special-2', text: 'Diapers', completed: false, quantity: 1 },
        { id: 'special-3', text: 'Prostheses', completed: false, quantity: 1 },
        { id: 'special-4', text: 'Baby clothes', completed: false, quantity: 1 },
        { id: 'special-5', text: 'Mirror', completed: false, quantity: 1 },
      ]
    },
    {
      id: 10,
      category: 'Disaster Preparedness',
      items: [
        { id: 'prep-1', text: 'Emergency kit - Include water, non-perishable food, first-aid supplies, flashlights, batteries, powerbank, HAM radio, clothes, and important documents (digital and physical)', completed: false, quantity: 1 },
        { id: 'prep-2', text: 'Communication plan - Establish how family members will contact each other and where to meet in case of separation', completed: false, quantity: 1 },
        { id: 'prep-3', text: 'Evacuation routes - Familiarize yourself with multiple ways to leave your area safely', completed: false, quantity: 1 },
        { id: 'prep-4', text: 'Prepare home - Secure loose outdoor items, trim trees, and reinforce windows and doors as needed', completed: false, quantity: 1 },
        { id: 'prep-5', text: 'Stay informed - Have a battery-powered or hand-crank radio to receive emergency broadcasts. Alternatively, use HAM radio to communicate', completed: false, quantity: 1 },
        { id: 'prep-6', text: 'Insurance coverage - Ensure your insurance policies adequately cover potential disasters in your area', completed: false, quantity: 1 },
        { id: 'prep-7', text: 'Emergency skills - Take courses in first aid, CPR, and how to use a fire extinguisher', completed: false, quantity: 1 },
        { id: 'prep-8', text: 'Consider special needs - Plan for family members with disabilities, elderly relatives, or pets', completed: false, quantity: 1 },
        { id: 'prep-9', text: 'Valuable possessions - Create an inventory for insurance purposes', completed: false, quantity: 1 },
        { id: 'prep-10', text: 'Practice your plan - Conduct regular drills with your family to ensure everyone knows what to do', completed: false, quantity: 1 },
      ]
    }
  ])

  useEffect(() => {
    // Load saved data from localStorage
    const savedFamilyInfo = localStorage.getItem('familyInfo')
    const savedChecklist = localStorage.getItem('checklistItems')
    const savedMetrics = localStorage.getItem('metricsSettings')
    
    if (savedFamilyInfo) {
      setFamilyInfo(JSON.parse(savedFamilyInfo))
    }
    
    if (savedChecklist) {
      setChecklistItems(JSON.parse(savedChecklist))
    }

    if (savedMetrics) {
      setMetricsSettings(JSON.parse(savedMetrics))
    }
  }, [])

  const updateChecklistItem = (categoryId: number, itemId: string, completed: boolean) => {
    const updatedChecklist = checklistItems.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.map(item => 
            item.id === itemId ? { ...item, completed } : item
          )
        }
      }
      return category
    })
    
    setChecklistItems(updatedChecklist)
    localStorage.setItem('checklistItems', JSON.stringify(updatedChecklist))
  }

  const updateFamilyInfo = (field: keyof FamilyInfo, value: string | number) => {
    const updated = { ...familyInfo, [field]: value }
    setFamilyInfo(updated)
    localStorage.setItem('familyInfo', JSON.stringify(updated))
  }

  const updateMetricsSettings = (field: keyof typeof metricsSettings, value: string) => {
    const updated = { ...metricsSettings, [field]: value }
    setMetricsSettings(updated)
    localStorage.setItem('metricsSettings', JSON.stringify(updated))
  }

  const saveFamilyInfo = () => {
    localStorage.setItem('familyInfo', JSON.stringify(familyInfo))
    setIsEditingFamily(false)
  }

  const saveMetricsSettings = () => {
    localStorage.setItem('metricsSettings', JSON.stringify(metricsSettings))
    setIsEditingMetrics(false)
  }

  const getProgressStats = () => {
    const totalItems = checklistItems.reduce((acc, category) => acc + category.items.length, 0)
    const completedItems = checklistItems.reduce((acc, category) => 
      acc + category.items.filter(item => item.completed).length, 0
    )
    const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
    
    return { totalItems, completedItems, percentage }
  }

  const stats = getProgressStats()

  const tabs = [
    { id: 'checklist', label: 'Checklist', icon: CheckCircle },
    { id: 'pantry', label: 'Pantry', icon: Shield },
    { id: 'books', label: 'Books', icon: BookOpen },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'radio', label: 'HAM Radio', icon: Radio },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'export', label: 'Export', icon: Download },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-brown-100 rounded-lg">
                <Shield className="h-8 w-8 text-brown-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Emergency Preparedness Checklist</h1>
                <p className="text-sm text-gray-600">Stay 10 steps ahead of the rest!</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Two Column Layout */}
      <div className="flex">
        {/* Sidebar - 20% */}
        <div className="w-1/5 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            {/* Family Info Section */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Family</h3>
                <button
                  onClick={() => setIsEditingFamily(!isEditingFamily)}
                  className="text-xs text-brown-600 hover:text-brown-700"
                >
                  {isEditingFamily ? 'Save' : 'Edit'}
                </button>
              </div>

              {isEditingFamily ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Adults</label>
                      <input
                        type="number"
                        min="0"
                        value={familyInfo.adults}
                        onChange={(e) => updateFamilyInfo('adults', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brown-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Children</label>
                      <input
                        type="number"
                        min="0"
                        value={familyInfo.children}
                        onChange={(e) => updateFamilyInfo('children', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brown-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Pets</label>
                      <input
                        type="number"
                        min="0"
                        value={familyInfo.pets}
                        onChange={(e) => updateFamilyInfo('pets', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brown-500"
                      />
                    </div>
                  </div>
                  <button
                    onClick={saveFamilyInfo}
                    className="w-full px-2 py-1 bg-brown-600 text-white rounded text-xs hover:bg-brown-700 transition-colors"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-brown-600">{familyInfo.adults}</div>
                    <div className="text-xs text-gray-500">Adults</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-brown-600">{familyInfo.children}</div>
                    <div className="text-xs text-gray-500">Children</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-brown-600">{familyInfo.pets}</div>
                    <div className="text-xs text-gray-500">Pets</div>
                  </div>
                </div>
              )}
              
              {!isEditingFamily && (
                <div className="mt-2 pt-2 border-t border-gray-100 text-center">
                  <div className="text-sm font-semibold text-gray-900">
                    Total: {familyInfo.adults + familyInfo.children + familyInfo.pets}
                  </div>
                </div>
              )}
            </div>

            {/* Metrics Settings Section */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Settings className="h-3 w-3 text-gray-500" />
                  <h3 className="text-sm font-semibold text-gray-900">Units</h3>
                </div>
                <button
                  onClick={() => setIsEditingMetrics(!isEditingMetrics)}
                  className="text-xs text-brown-600 hover:text-brown-700"
                >
                  {isEditingMetrics ? 'Save' : 'Edit'}
                </button>
              </div>

              {isEditingMetrics ? (
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Volume</label>
                    <select
                      value={metricsSettings.volume}
                      onChange={(e) => updateMetricsSettings('volume', e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brown-500"
                    >
                      <option value="gallons">Gallons</option>
                      <option value="liters">Liters</option>
                      <option value="quarts">Quarts</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Weight</label>
                    <select
                      value={metricsSettings.weight}
                      onChange={(e) => updateMetricsSettings('weight', e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brown-500"
                    >
                      <option value="pounds">Pounds</option>
                      <option value="kilograms">Kilograms</option>
                      <option value="ounces">Ounces</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Temperature</label>
                    <select
                      value={metricsSettings.temperature}
                      onChange={(e) => updateMetricsSettings('temperature', e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brown-500"
                    >
                      <option value="fahrenheit">Fahrenheit</option>
                      <option value="celsius">Celsius</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Distance</label>
                    <select
                      value={metricsSettings.distance}
                      onChange={(e) => updateMetricsSettings('distance', e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brown-500"
                    >
                      <option value="miles">Miles</option>
                      <option value="kilometers">Kilometers</option>
                      <option value="feet">Feet</option>
                    </select>
                  </div>
                  <button
                    onClick={saveMetricsSettings}
                    className="w-full px-2 py-1 bg-brown-600 text-white rounded text-xs hover:bg-brown-700 transition-colors"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Volume:</span>
                    <span className="font-medium text-gray-900 capitalize">{metricsSettings.volume}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium text-gray-900 capitalize">{metricsSettings.weight}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Temperature:</span>
                    <span className="font-medium text-gray-900 capitalize">{metricsSettings.temperature}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Distance:</span>
                    <span className="font-medium text-gray-900 capitalize">{metricsSettings.distance}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-700">Overall Progress</span>
                <span className="text-xs font-medium text-gray-700">{stats.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-brown-500 to-brown-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${stats.percentage}%` }}
                ></div>
              </div>
              <div className="mt-2 text-center text-xs text-gray-500">
                {stats.completedItems} of {stats.totalItems} items completed
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - 80% */}
        <div className="w-4/5">
          <div className="p-6">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                          activeTab === tab.id
                            ? 'border-brown-500 text-brown-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{tab.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-lg shadow-sm">
              {activeTab === 'checklist' && (
                <ChecklistSection 
                  checklistItems={checklistItems}
                  onUpdateItem={updateChecklistItem}
                  familyInfo={familyInfo}
                  metricsSettings={metricsSettings}
                />
              )}
              {activeTab === 'pantry' && <PantryManager familyInfo={familyInfo} metricsSettings={metricsSettings} />}
              {activeTab === 'books' && <BooksManager />}
              {activeTab === 'contacts' && <EmergencyContacts />}
              {activeTab === 'radio' && <HamRadioFrequencies />}
              {activeTab === 'documents' && <DocumentsBinder />}
              {activeTab === 'export' && (
                <ExportManager 
                  familyInfo={familyInfo}
                  checklistItems={checklistItems}
                  metricsSettings={metricsSettings}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notion Template Promotion */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg border border-blue-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <svg className="h-8 w-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466l1.823 1.447zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933l3.222-.233c.514-.047.793.233.793.746z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Get the Notion Template</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Want a more comprehensive emergency preparedness checklist? Check out our premium Notion template with advanced features and detailed planning tools.
                  </p>
                </div>
              </div>
              <a
                href="https://www.notion.com/templates/emergency-preparedness-checklist"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <span>View Template</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 