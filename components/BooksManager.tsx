'use client'

import { useState, useEffect } from 'react'
import { Plus, BookOpen, MapPin, Star, Trash2, Edit } from 'lucide-react'
import { Book } from '@/types'

export default function BooksManager() {
  const [books, setBooks] = useState<Book[]>([
    {
      id: '1',
      title: 'SAS Survival Handbook',
      author: 'John "Lofty" Wiseman',
      category: 'Survival',
      location: 'Home library',
      isEssential: true,
      notes: 'Comprehensive survival guide covering wilderness, urban, and disaster scenarios'
    },
    {
      id: '2',
      title: 'Where There Is No Doctor',
      author: 'David Werner',
      category: 'Medical',
      location: 'Home library',
      isEssential: true,
      notes: 'Essential medical guide for when professional help is unavailable'
    },
    {
      id: '3',
      title: 'The Prepper\'s Blueprint',
      author: 'Tess Pennington',
      category: 'Preparedness',
      location: 'Home library',
      isEssential: true,
      notes: 'Complete guide to emergency preparedness and survival planning'
    },
    {
      id: '4',
      title: 'Emergency Food Storage & Survival Handbook',
      author: 'Peggy Layton',
      category: 'Food Storage',
      location: 'Kitchen',
      isEssential: true,
      notes: 'Guide to storing and preparing emergency food supplies'
    },
    {
      id: '5',
      title: 'The Encyclopedia of Country Living',
      author: 'Carla Emery',
      category: 'Homesteading',
      location: 'Home library',
      isEssential: false,
      notes: 'Comprehensive guide to self-sufficient living and traditional skills'
    },
    {
      id: '6',
      title: 'First Aid Manual',
      author: 'American Red Cross',
      category: 'Medical',
      location: 'First aid kit',
      isEssential: true,
      notes: 'Official Red Cross first aid and emergency care guide'
    },
    {
      id: '7',
      title: 'The Complete Guide to Self-Sufficiency',
      author: 'John Seymour',
      category: 'Homesteading',
      location: 'Home library',
      isEssential: false,
      notes: 'Guide to living off the land and becoming self-sufficient'
    },
    {
      id: '8',
      title: 'Emergency Preparedness for Families',
      author: 'Various Authors',
      category: 'Preparedness',
      location: 'Home library',
      isEssential: true,
      notes: 'Family-focused emergency preparedness planning guide'
    }
  ])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [newBook, setNewBook] = useState<Omit<Book, 'id'>>({
    title: '',
    author: '',
    category: '',
    location: '',
    notes: '',
    isEssential: false
  })

  useEffect(() => {
    const saved = localStorage.getItem('books')
    if (saved) {
      setBooks(JSON.parse(saved))
    } else {
      // If no saved data, save the initial prefilled data to localStorage
      localStorage.setItem('books', JSON.stringify(books))
    }
  }, [])

  const saveBooks = (booksList: Book[]) => {
    setBooks(booksList)
    localStorage.setItem('books', JSON.stringify(booksList))
  }

  const addBook = () => {
    const book: Book = {
      ...newBook,
      id: Date.now().toString()
    }
    const updated = [...books, book]
    saveBooks(updated)
    setNewBook({
      title: '',
      author: '',
      category: '',
      location: '',
      notes: '',
      isEssential: false
    })
    setShowAddModal(false)
  }

  const updateBook = () => {
    if (!editingBook) return
    const updated = books.map(book => 
      book.id === editingBook.id ? editingBook : book
    )
    saveBooks(updated)
    setEditingBook(null)
  }

  const deleteBook = (id: string) => {
    const updated = books.filter(book => book.id !== id)
    saveBooks(updated)
  }

  const categories = [
    'First Aid & Medical', 'Survival Skills', 'Food Preservation', 
    'Emergency Preparedness', 'Navigation', 'Communication', 
    'Self-Defense', 'Gardening', 'Other'
  ]

  const essentialBooks = [
    { title: 'Where There Is No Doctor', author: 'David Werner', category: 'First Aid & Medical', isEssential: true },
    { title: 'Where There Is No Dentist', author: 'Murray Dickson', category: 'First Aid & Medical', isEssential: true },
    { title: 'SAS Survival Handbook', author: 'John Wiseman', category: 'Survival Skills', isEssential: true },
    { title: 'The Prepper\'s Blueprint', author: 'Tess Pennington', category: 'Emergency Preparedness', isEssential: true },
    { title: 'Ball Blue Book Guide to Preserving', author: 'Ball Corporation', category: 'Food Preservation', isEssential: true },
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'First Aid & Medical':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'Survival Skills':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Food Preservation':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Emergency Preparedness':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Navigation':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Communication':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Self-Defense':
        return 'bg-pink-100 text-pink-800 border-pink-200'
      case 'Gardening':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Essential Books Management</h2>
          <p className="text-gray-600">
            Track your essential books and resources for emergency preparedness and survival.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-brown-600 text-white rounded-lg hover:bg-brown-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Book</span>
        </button>
      </div>



      {/* Your Books */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="bg-gradient-to-r from-brown-50 to-brown-100 px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Your Books Collection</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {books.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No books added yet. Add your first book to get started!</p>
            </div>
          ) : (
            books.map((book) => (
              <div key={book.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{book.title}</h4>
                      {book.isEssential && (
                        <Star className="h-4 w-4 text-brown-500 flex-shrink-0" />
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">by {book.author}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Category:</span>
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getCategoryColor(book.category)}`}>
                          {book.category}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="font-medium">Location:</span>
                        <span className="ml-1">{book.location || 'Not specified'}</span>
                      </div>
                      {book.notes && (
                        <div>
                          <span className="font-medium">Notes:</span>
                          <span className="ml-1">{book.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setEditingBook(book)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteBook(book.id)}
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
      {(showAddModal || editingBook) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingBook ? 'Edit Book' : 'Add Book'}
              </h3>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); editingBook ? updateBook() : addBook() }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Book Title</label>
                <input
                  type="text"
                  value={editingBook?.title || newBook.title}
                  onChange={(e) => editingBook 
                    ? setEditingBook({...editingBook, title: e.target.value})
                    : setNewBook({...newBook, title: e.target.value})
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input
                  type="text"
                  value={editingBook?.author || newBook.author}
                  onChange={(e) => editingBook 
                    ? setEditingBook({...editingBook, author: e.target.value})
                    : setNewBook({...newBook, author: e.target.value})
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={editingBook?.category || newBook.category}
                  onChange={(e) => editingBook 
                    ? setEditingBook({...editingBook, category: e.target.value})
                    : setNewBook({...newBook, category: e.target.value})
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
                  value={editingBook?.location || newBook.location}
                  onChange={(e) => editingBook 
                    ? setEditingBook({...editingBook, location: e.target.value})
                    : setNewBook({...newBook, location: e.target.value})
                  }
                  placeholder="Where is this book stored?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={editingBook?.notes || newBook.notes}
                  onChange={(e) => editingBook 
                    ? setEditingBook({...editingBook, notes: e.target.value})
                    : setNewBook({...newBook, notes: e.target.value})
                  }
                  rows={3}
                  placeholder="Any additional notes about this book"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isEssential"
                  checked={editingBook?.isEssential || newBook.isEssential}
                  onChange={(e) => editingBook 
                    ? setEditingBook({...editingBook, isEssential: e.target.checked})
                    : setNewBook({...newBook, isEssential: e.target.checked})
                  }
                  className="h-4 w-4 text-brown-600 focus:ring-brown-500 border-gray-300 rounded"
                />
                <label htmlFor="isEssential" className="ml-2 block text-sm text-gray-900">
                  Mark as essential book
                </label>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingBook(null) }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brown-600 text-white rounded-md hover:bg-brown-700 transition-colors"
                >
                  {editingBook ? 'Update' : 'Add'} Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 