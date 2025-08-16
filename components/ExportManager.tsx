'use client'

import { useState } from 'react'
import { Download, FileText, FileSpreadsheet, FileJson, Printer, Copy, Check } from 'lucide-react'
import { FamilyInfo, ChecklistItem, PantryItem, Book, EmergencyContact, HamFrequency, Document } from '@/types'

interface ExportManagerProps {
  familyInfo: FamilyInfo
  checklistItems: ChecklistItem[]
  metricsSettings: {
    volume: string
    weight: string
    temperature: string
    distance: string
  }
}

export default function ExportManager({ familyInfo, checklistItems, metricsSettings }: ExportManagerProps) {
  const [copied, setCopied] = useState(false)
  const [exportFormat, setExportFormat] = useState<'json' | 'csv' | 'txt'>('json')
  const [refreshKey, setRefreshKey] = useState(0)

  // Get data from localStorage with debugging
  const getStoredData = () => {
    const pantryItems = JSON.parse(localStorage.getItem('pantryItems') || '[]')
    const books = JSON.parse(localStorage.getItem('books') || '[]')
    const contacts = JSON.parse(localStorage.getItem('contacts') || '[]')
    const frequencies = JSON.parse(localStorage.getItem('frequencies') || '[]')
    const documents = JSON.parse(localStorage.getItem('documents') || '[]')



    return {
      familyInfo,
      checklistItems,
      pantryItems,
      books,
      contacts,
      frequencies,
      documents,
      metricsSettings,
      exportDate: new Date().toISOString(),
      appVersion: '1.0.0'
    }
  }

  // Get current data counts for display
  const getDataCounts = () => {
    const pantryItems = JSON.parse(localStorage.getItem('pantryItems') || '[]')
    const books = JSON.parse(localStorage.getItem('books') || '[]')
    const contacts = JSON.parse(localStorage.getItem('contacts') || '[]')
    const frequencies = JSON.parse(localStorage.getItem('frequencies') || '[]')
    const documents = JSON.parse(localStorage.getItem('documents') || '[]')

    // Debug logging
    console.log('Export Data Counts:', {
      pantryItems: pantryItems.length,
      books: books.length,
      contacts: contacts.length,
      frequencies: frequencies.length,
      documents: documents.length,
      pantryItemsData: pantryItems,
      booksData: books,
      contactsData: contacts,
      frequenciesData: frequencies,
      documentsData: documents
    })

    return {
      pantryItems: pantryItems.length,
      books: books.length,
      contacts: contacts.length,
      frequencies: frequencies.length,
      documents: documents.length
    }
  }

  const exportToJSON = () => {
    const data = getStoredData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `emergency-preparedness-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportToCSV = () => {
    const data = getStoredData()
    let csvContent = 'Category,Item,Status,Quantity,Notes\n'
    
    // Checklist items
    checklistItems.forEach(category => {
      category.items.forEach(item => {
        csvContent += `Checklist - ${category.category},"${item.text}",${item.completed ? 'Completed' : 'Pending'},${item.quantity},\n`
      })
    })

    // Pantry items
    data.pantryItems.forEach((item: PantryItem) => {
      csvContent += `Pantry - ${item.category},"${item.name}",${item.quantity} ${item.unit},"${item.expiryDate || 'No expiry'}",${item.notes || ''}\n`
    })

    // Books
    data.books.forEach((book: Book) => {
      csvContent += `Books - ${book.category},"${book.title} by ${book.author}",${book.location || 'Not specified'},,${book.notes || ''}\n`
    })

    // Contacts
    data.contacts.forEach((contact: EmergencyContact) => {
      csvContent += `Contacts - ${contact.relationship},"${contact.name}",${contact.phone},${contact.email || ''},${contact.notes || ''}\n`
    })

    // Frequencies
    data.frequencies.forEach((freq: HamFrequency) => {
      csvContent += `HAM Radio - ${freq.location},"${freq.frequency} MHz",${freq.description},,${freq.notes || ''}\n`
    })

    // Documents
    data.documents.forEach((doc: Document) => {
      csvContent += `Documents - ${doc.category},"${doc.name}",${doc.location || 'Not specified'},${doc.expiryDate || 'No expiry'},${doc.notes || ''}\n`
    })

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `emergency-preparedness-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportToText = () => {
    const data = getStoredData()
    let textContent = `EMERGENCY PREPAREDNESS CHECKLIST\n`
    textContent += `Generated on: ${new Date().toLocaleDateString()}\n`
    textContent += `Family: ${familyInfo.adults} adults, ${familyInfo.children} children, ${familyInfo.pets} pets\n\n`

    // Checklist items
    textContent += `=== CHECKLIST ITEMS ===\n`
    checklistItems.forEach(category => {
      textContent += `\n${category.category.toUpperCase()}:\n`
      category.items.forEach(item => {
        const status = item.completed ? '✓' : '☐'
        textContent += `  ${status} ${item.text} (Qty: ${item.quantity})\n`
      })
    })

    // Pantry items
    if (data.pantryItems.length > 0) {
      textContent += `\n=== PANTRY ITEMS ===\n`
      data.pantryItems.forEach((item: PantryItem) => {
        textContent += `  • ${item.name} - ${item.quantity} ${item.unit} (${item.category})\n`
        if (item.expiryDate) textContent += `    Expires: ${item.expiryDate}\n`
        if (item.notes) textContent += `    Notes: ${item.notes}\n`
      })
    }

    // Books
    if (data.books.length > 0) {
      textContent += `\n=== ESSENTIAL BOOKS ===\n`
      data.books.forEach((book: Book) => {
        textContent += `  • ${book.title} by ${book.author} (${book.category})\n`
        if (book.location) textContent += `    Location: ${book.location}\n`
        if (book.notes) textContent += `    Notes: ${book.notes}\n`
      })
    }

    // Contacts
    if (data.contacts.length > 0) {
      textContent += `\n=== EMERGENCY CONTACTS ===\n`
      data.contacts.forEach((contact: EmergencyContact) => {
        textContent += `  • ${contact.name} (${contact.relationship})\n`
        textContent += `    Phone: ${contact.phone}\n`
        if (contact.email) textContent += `    Email: ${contact.email}\n`
        if (contact.notes) textContent += `    Notes: ${contact.notes}\n`
      })
    }

    // Frequencies
    if (data.frequencies.length > 0) {
      textContent += `\n=== HAM RADIO FREQUENCIES ===\n`
      data.frequencies.forEach((freq: HamFrequency) => {
        textContent += `  • ${freq.frequency} MHz (${freq.location})\n`
        textContent += `    Description: ${freq.description}\n`
        if (freq.notes) textContent += `    Notes: ${freq.notes}\n`
      })
    }

    // Documents
    if (data.documents.length > 0) {
      textContent += `\n=== IMPORTANT DOCUMENTS ===\n`
      data.documents.forEach((doc: Document) => {
        textContent += `  • ${doc.name} (${doc.category})\n`
        if (doc.location) textContent += `    Location: ${doc.location}\n`
        if (doc.expiryDate) textContent += `    Expires: ${doc.expiryDate}\n`
        if (doc.notes) textContent += `    Notes: ${doc.notes}\n`
      })
    }

    const blob = new Blob([textContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `emergency-preparedness-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = async () => {
    const data = getStoredData()
    const jsonString = JSON.stringify(data, null, 2)
    
    try {
      await navigator.clipboard.writeText(jsonString)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  const printData = () => {
    const data = getStoredData()
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Emergency Preparedness Checklist</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #333; }
              h2 { color: #666; margin-top: 20px; }
              .item { margin: 5px 0; }
              .completed { text-decoration: line-through; color: #888; }
              .category { font-weight: bold; margin-top: 15px; }
            </style>
          </head>
          <body>
            <h1>Emergency Preparedness Checklist</h1>
            <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Family:</strong> ${familyInfo.adults} adults, ${familyInfo.children} children, ${familyInfo.pets} pets</p>
            
            <h2>Checklist Items</h2>
            ${checklistItems.map(category => `
              <div class="category">${category.category}</div>
              ${category.items.map(item => `
                <div class="item ${item.completed ? 'completed' : ''}">
                  ${item.completed ? '✓' : '☐'} ${item.text} (Qty: ${item.quantity})
                </div>
              `).join('')}
            `).join('')}
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleExport = () => {
    switch (exportFormat) {
      case 'json':
        exportToJSON()
        break
      case 'csv':
        exportToCSV()
        break
      case 'txt':
        exportToText()
        break
    }
  }

  const initializeMissingData = () => {
    console.log('Initializing missing data...')
    
    // Check and initialize books
    const books = localStorage.getItem('books')
    if (!books || JSON.parse(books).length === 0) {
      console.log('Initializing books data...')
      const initialBooks = [
        { id: '1', title: 'SAS Survival Handbook', author: 'John "Lofty" Wiseman', category: 'Survival', location: 'Home library', isEssential: true, notes: 'Comprehensive survival guide' },
        { id: '2', title: 'Where There Is No Doctor', author: 'David Werner', category: 'Medical', location: 'Home library', isEssential: true, notes: 'Essential medical guide' },
        { id: '3', title: 'The Prepper\'s Blueprint', author: 'Tess Pennington', category: 'Preparedness', location: 'Home library', isEssential: true, notes: 'Complete guide to emergency preparedness' },
        { id: '4', title: 'Emergency Food Storage & Survival Handbook', author: 'Peggy Layton', category: 'Food Storage', location: 'Kitchen', isEssential: true, notes: 'Guide to storing emergency food' },
        { id: '5', title: 'The Encyclopedia of Country Living', author: 'Carla Emery', category: 'Homesteading', location: 'Home library', isEssential: false, notes: 'Guide to self-sufficient living' },
        { id: '6', title: 'First Aid Manual', author: 'American Red Cross', category: 'Medical', location: 'First aid kit', isEssential: true, notes: 'Official Red Cross first aid guide' },
        { id: '7', title: 'The Complete Guide to Self-Sufficiency', author: 'John Seymour', category: 'Homesteading', location: 'Home library', isEssential: false, notes: 'Guide to living off the land' },
        { id: '8', title: 'Emergency Preparedness for Families', author: 'Various Authors', category: 'Preparedness', location: 'Home library', isEssential: true, notes: 'Family-focused emergency planning' }
      ]
      localStorage.setItem('books', JSON.stringify(initialBooks))
    }

    // Check and initialize pantry items
    const pantryItems = localStorage.getItem('pantryItems')
    if (!pantryItems || JSON.parse(pantryItems).length === 0) {
      console.log('Initializing pantry data...')
      const initialPantry = [
        { id: '1', name: 'Canned Beans', category: 'Canned Goods', quantity: 6, unit: 'cans', expiryDate: '2025-06-15', minQuantity: 2, notes: 'Black beans and kidney beans for protein' },
        { id: '2', name: 'Rice', category: 'Grains & Pasta', quantity: 10, unit: 'pounds', expiryDate: '2026-03-20', minQuantity: 5, notes: 'Long grain white rice' },
        { id: '3', name: 'Bottled Water', category: 'Beverages', quantity: 24, unit: 'bottles', expiryDate: '2025-12-01', minQuantity: 12, notes: '16.9 oz bottles' },
        { id: '4', name: 'Protein Bars', category: 'Snacks', quantity: 8, unit: 'bars', expiryDate: '2024-11-30', minQuantity: 4, notes: 'High protein emergency food' },
        { id: '5', name: 'Canned Tuna', category: 'Canned Goods', quantity: 4, unit: 'cans', expiryDate: '2025-08-10', minQuantity: 2, notes: 'Albacore tuna in water' },
        { id: '6', name: 'Peanut Butter', category: 'Condiments', quantity: 2, unit: 'jars', expiryDate: '2025-02-15', minQuantity: 1, notes: 'Natural peanut butter' },
        { id: '7', name: 'Crackers', category: 'Snacks', quantity: 3, unit: 'boxes', expiryDate: '2024-12-20', minQuantity: 1, notes: 'Saltine crackers' },
        { id: '8', name: 'Canned Vegetables', category: 'Canned Goods', quantity: 8, unit: 'cans', expiryDate: '2025-07-05', minQuantity: 4, notes: 'Mixed vegetables and corn' }
      ]
      localStorage.setItem('pantryItems', JSON.stringify(initialPantry))
    }

    // Check and initialize contacts
    const contacts = localStorage.getItem('contacts')
    if (!contacts || JSON.parse(contacts).length === 0) {
      console.log('Initializing contacts data...')
      const initialContacts = [
        { id: '1', name: 'Emergency Services', relationship: 'Emergency Services', phone: '911', email: '', address: 'Emergency', isEmergencyContact: true, notes: 'Primary emergency number' },
        { id: '2', name: 'Local Police', relationship: 'Emergency Services', phone: '(555) 123-4567', email: 'police@city.gov', address: 'Police Station, City, State', isEmergencyContact: true, notes: 'Local police department' },
        { id: '3', name: 'Fire Department', relationship: 'Emergency Services', phone: '(555) 234-5678', email: 'fire@city.gov', address: 'Fire Station, City, State', isEmergencyContact: true, notes: 'Local fire department' },
        { id: '4', name: 'Family Doctor', relationship: 'Medical', phone: '(555) 345-6789', email: 'doctor@clinic.com', address: 'Medical Clinic, City, State', isEmergencyContact: false, notes: 'Primary care physician' },
        { id: '5', name: 'Neighbor John', relationship: 'Neighbor', phone: '(555) 456-7890', email: 'john@email.com', address: '123 Main St, City, State', isEmergencyContact: false, notes: 'Trusted neighbor' },
        { id: '6', name: 'Work Supervisor', relationship: 'Work', phone: '(555) 567-8901', email: 'supervisor@work.com', address: 'Work Office, City, State', isEmergencyContact: false, notes: 'Work emergency contact' },
        { id: '7', name: 'Insurance Agent', relationship: 'Insurance', phone: '(555) 678-9012', email: 'agent@insurance.com', address: 'Insurance Office, City, State', isEmergencyContact: false, notes: 'Insurance claims contact' },
        { id: '8', name: 'Utility Company', relationship: 'Utilities', phone: '(555) 678-9012', email: 'emergency@utility.com', address: 'Utility Office, City, State', isEmergencyContact: false, notes: 'Emergency utility services contact' }
      ]
      localStorage.setItem('contacts', JSON.stringify(initialContacts))
    }

    // Check and initialize frequencies
    const frequencies = localStorage.getItem('frequencies')
    if (!frequencies || JSON.parse(frequencies).length === 0) {
      console.log('Initializing frequencies data...')
      const initialFrequencies = [
        { id: '1', frequency: '146.520 MHz', description: 'National Calling Frequency (2m) - FM', location: 'Emergency Communications', notes: 'National calling frequency for 2-meter band', isEmergency: true },
        { id: '2', frequency: '446.000 MHz', description: 'National Calling Frequency (70cm) - FM', location: 'Emergency Communications', notes: 'National calling frequency for 70-centimeter band', isEmergency: true },
        { id: '3', frequency: '52.525 MHz', description: 'National Calling Frequency (6m) - FM', location: 'Emergency Communications', notes: 'National calling frequency for 6-meter band', isEmergency: true },
        { id: '4', frequency: '7.074 MHz', description: '40m Emergency Frequency - LSB', location: 'Emergency Communications', notes: '40-meter emergency frequency', isEmergency: true },
        { id: '5', frequency: '14.074 MHz', description: '20m Emergency Frequency - USB', location: 'Emergency Communications', notes: '20-meter emergency frequency', isEmergency: true },
        { id: '6', frequency: '162.400 MHz', description: 'NOAA Weather Radio - FM', location: 'Weather Information', notes: 'Primary NOAA weather radio frequency', isEmergency: false },
        { id: '7', frequency: '162.425 MHz', description: 'NOAA Weather Radio (Alt) - FM', location: 'Weather Information', notes: 'Alternative NOAA weather frequency', isEmergency: false },
        { id: '8', frequency: '162.450 MHz', description: 'NOAA Weather Radio (Alt) - FM', location: 'Weather Information', notes: 'Alternative NOAA weather frequency', isEmergency: false },
        { id: '9', frequency: '162.475 MHz', description: 'NOAA Weather Radio (Alt) - FM', location: 'Weather Information', notes: 'Alternative NOAA weather frequency', isEmergency: false },
        { id: '10', frequency: '162.500 MHz', description: 'NOAA Weather Radio (Alt) - FM', location: 'Weather Information', notes: 'Alternative NOAA weather frequency', isEmergency: false },
        { id: '11', frequency: '14.313 MHz', description: 'International Emergency Frequency - USB', location: 'Emergency Communications', notes: 'International Frequency for Emergency Communications', isEmergency: true },
        { id: '12', frequency: '3.690 MHz', description: 'Long Distance Communication - LSB', location: 'Long Distance', notes: 'Commonly used for long-distance communication', isEmergency: false },
        { id: '13', frequency: '7.200 MHz', description: 'Nighttime Emergency Frequency - LSB', location: 'Emergency Communications', notes: 'Nighttime Frequency for Emergency Communications', isEmergency: true },
        { id: '14', frequency: '147.000 MHz', description: 'Local Communication - FM', location: 'Local Communications', notes: 'Commonly used for local communication in the United States', isEmergency: false },
        { id: '15', frequency: '28.400 MHz', description: 'DX Communication - USB', location: 'Long Distance', notes: 'Popular for DXing (communicating with distant stations)', isEmergency: false },
        { id: '16', frequency: '50.125 MHz', description: 'Six-Meter Communication - FM', location: 'Long Distance', notes: 'Six-meter band for longer distance communication', isEmergency: false },
        { id: '17', frequency: '144.200 MHz', description: 'Two-Meter Communication - FM', location: 'Local Communications', notes: 'Two-meter band for local and emergency communication', isEmergency: false },
        { id: '18', frequency: '10.140 MHz', description: 'Digital Communication - USB', location: 'Digital Modes', notes: 'Popular for digital modes such as PSK31', isEmergency: false },
        { id: '19', frequency: '21.200 MHz', description: 'DX and Contesting - USB', location: 'Long Distance', notes: 'Popular for DXing and contesting', isEmergency: false },
        { id: '20', frequency: '145.500 MHz', description: 'Simplex Communication - FM', location: 'Local Communications', notes: 'Simplex communication without repeater', isEmergency: false }
      ]
      localStorage.setItem('frequencies', JSON.stringify(initialFrequencies))
    }

    // Check and initialize documents
    const documents = localStorage.getItem('documents')
    if (!documents || JSON.parse(documents).length === 0) {
      console.log('Initializing documents data...')
      const initialDocuments = [
        { id: '1', name: 'Birth Certificates', category: 'Personal Identification', location: 'Fireproof safe', isDigital: false, notes: 'Birth certificates for all family members', isEssential: true },
        { id: '2', name: 'Passports', category: 'Personal Identification', location: 'Fireproof safe', isDigital: false, notes: 'Current passports for all family members', isEssential: true },
        { id: '3', name: 'Social Security Cards', category: 'Personal Identification', location: 'Fireproof safe', isDigital: false, notes: 'Social security cards for all family members', isEssential: true },
        { id: '4', name: 'Driver\'s Licenses', category: 'Personal Identification', location: 'Wallet/Purse', isDigital: false, notes: 'Current driver\'s licenses', isEssential: true },
        { id: '5', name: 'Marriage Certificate', category: 'Personal Identification', location: 'Fireproof safe', isDigital: false, notes: 'Marriage certificate', isEssential: true },
        { id: '6', name: 'Property Deed', category: 'Property', location: 'Fireproof safe', isDigital: false, notes: 'Property deed and title documents', isEssential: true },
        { id: '7', name: 'Vehicle Titles', category: 'Property', location: 'Fireproof safe', isDigital: false, notes: 'Vehicle titles and registration documents', isEssential: true },
        { id: '8', name: 'Insurance Policies', category: 'Insurance', location: 'Fireproof safe', isDigital: true, notes: 'Home, auto, life, and health insurance policies', isEssential: true },
        { id: '9', name: 'Medical Records', category: 'Medical', location: 'Fireproof safe', isDigital: true, notes: 'Medical history, prescriptions, and vaccination records', isEssential: true },
        { id: '10', name: 'Financial Documents', category: 'Financial', location: 'Fireproof safe', isDigital: true, notes: 'Bank statements, investment accounts, retirement plans', isEssential: true },
        { id: '11', name: 'Wills and Trusts', category: 'Legal', location: 'Fireproof safe', isDigital: false, notes: 'Wills, trusts, and power of attorney documents', isEssential: true },
        { id: '12', name: 'Tax Returns', category: 'Financial', location: 'Fireproof safe', isDigital: true, notes: 'Last 3 years of tax returns', isEssential: false },
        { id: '13', name: 'Pet Records', category: 'Medical', location: 'Fireproof safe', isDigital: false, notes: 'Pet vaccination records and medical history', isEssential: false },
        { id: '14', name: 'Emergency Contact List', category: 'Emergency', location: 'Multiple locations', isDigital: true, notes: 'List of emergency contacts and important phone numbers', isEssential: true },
        { id: '15', name: 'Emergency Plan', category: 'Emergency', location: 'Multiple locations', isDigital: true, notes: 'Family emergency plan and evacuation procedures', isEssential: true }
      ]
      localStorage.setItem('documents', JSON.stringify(initialDocuments))
    }

    setRefreshKey(prev => prev + 1)
    console.log('Data initialization complete!')
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Export Data</h2>
        <p className="text-gray-600">
          Export your emergency preparedness data in various formats for backup, sharing, or printing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Options */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as 'json' | 'csv' | 'txt')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
              >
                <option value="json">JSON (Complete data)</option>
                <option value="csv">CSV (Spreadsheet)</option>
                <option value="txt">Text (Readable format)</option>
              </select>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleExport}
                className="flex-1 bg-brown-600 text-white px-4 py-2 rounded-md hover:bg-brown-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
              </button>
            </div>

            <button
              onClick={initializeMissingData}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Initialize Missing Data
            </button>

            <button
              onClick={() => {
                console.log('Force refresh clicked')
                setRefreshKey(prev => prev + 1)
                // Force reload all data
                window.location.reload()
              }}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Force Refresh Data
            </button>

            <button
              onClick={printData}
              className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
            >
              <Printer className="h-4 w-4" />
              <span>Print Checklist</span>
            </button>
          </div>
        </div>

        {/* Data Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Data Summary</h3>
            <button
              onClick={() => setRefreshKey(prev => prev + 1)}
              className="text-xs text-brown-600 hover:text-brown-700"
            >
              Refresh
            </button>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Family Members:</span>
              <span className="font-medium">{familyInfo.adults + familyInfo.children + familyInfo.pets}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Checklist Items:</span>
              <span className="font-medium">{checklistItems.reduce((total, cat) => total + cat.items.length, 0)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completed Items:</span>
              <span className="font-medium text-green-600">
                {checklistItems.reduce((total, cat) => total + cat.items.filter(item => item.completed).length, 0)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pantry Items:</span>
              <span className="font-medium">
                {getDataCounts().pantryItems}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Books:</span>
              <span className="font-medium">
                {getDataCounts().books}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Contacts:</span>
              <span className="font-medium">
                {getDataCounts().contacts}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">HAM Frequencies:</span>
              <span className="font-medium">
                {getDataCounts().frequencies}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Documents:</span>
              <span className="font-medium">
                {getDataCounts().documents}
              </span>
            </div>
            

          </div>
        </div>
      </div>

      {/* Export Information */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Export Information</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>JSON:</strong> Complete data backup, best for restoring to another device</li>
          <li>• <strong>CSV:</strong> Spreadsheet format, good for analysis and sharing</li>
          <li>• <strong>Text:</strong> Human-readable format, perfect for printing</li>
          <li>• <strong>Print:</strong> Clean checklist format for physical backup</li>
        </ul>
      </div>
    </div>
  )
} 