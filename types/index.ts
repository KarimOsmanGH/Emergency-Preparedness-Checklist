export interface FamilyInfo {
  adults: number
  children: number
  pets: number
  specialNeeds: string
  location: string
  emergencyPlan: string
}

export interface ChecklistItem {
  id: number
  category: string
  items: ChecklistSubItem[]
}

export interface ChecklistSubItem {
  id: string
  text: string
  completed: boolean
  quantity: number
}

export interface PantryItem {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  expiryDate: string
  minQuantity: number
  notes: string
}

export interface Book {
  id: string
  title: string
  author: string
  category: string
  location: string
  notes: string
  isEssential: boolean
}

export interface EmergencyContact {
  id: string
  name: string
  relationship: string
  phone: string
  email: string
  address: string
  isEmergencyContact: boolean
  notes: string
}

export interface HamFrequency {
  id: string
  frequency: string
  description: string
  location: string
  notes: string
  isEmergency: boolean
}

export interface Document {
  id: string
  name: string
  category: string
  location: string
  expiryDate?: string
  isDigital: boolean
  notes: string
  isEssential: boolean
} 