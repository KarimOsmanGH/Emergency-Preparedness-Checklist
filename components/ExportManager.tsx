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

  // Get data from localStorage
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Summary</h3>
          
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
                {JSON.parse(localStorage.getItem('pantryItems') || '[]').length}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Books:</span>
              <span className="font-medium">
                {JSON.parse(localStorage.getItem('books') || '[]').length}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Contacts:</span>
              <span className="font-medium">
                {JSON.parse(localStorage.getItem('contacts') || '[]').length}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">HAM Frequencies:</span>
              <span className="font-medium">
                {JSON.parse(localStorage.getItem('frequencies') || '[]').length}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Documents:</span>
              <span className="font-medium">
                {JSON.parse(localStorage.getItem('documents') || '[]').length}
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