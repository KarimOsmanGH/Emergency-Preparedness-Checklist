/**
 * BooksManager Component
 * Manages essential books and resources for emergency preparedness
 */

'use client'

import { useState, useMemo, useCallback } from 'react'
import { Plus, BookOpen, MapPin, Star, Trash2, Edit, Search, X } from 'lucide-react'
import { Book } from '@/types'
import { useBooks } from '@/hooks/useBooks'
import { useToast } from './Toast'
import ConfirmDialog from './ConfirmDialog'
import { BOOK_CATEGORIES, BOOK_CATEGORY_COLORS } from '@/lib/constants'
import { getCategoryColor } from '@/lib/utils'
import { bookSchema, validateForm } from '@/lib/validations'

const EMPTY_BOOK: Omit<Book, 'id'> = {
  title: '',
  author: '',
  category: '',
  location: '',
  notes: '',
  isEssential: false
}

export default function BooksManager() {
  const { 
    books, 
    addBook, 
    updateBook, 
    deleteBook 
  } = useBooks()
  
  const { showToast } = useToast()
  
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [newBook, setNewBook] = useState<Omit<Book, 'id'>>(EMPTY_BOOK)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; itemId: string | null }>({
    isOpen: false,
    itemId: null
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Filter books based on search
  const filteredBooks = useMemo(() => {
    if (!searchTerm.trim()) return books
    const lower = searchTerm.toLowerCase()
    return books.filter(book => 
      book.title.toLowerCase().includes(lower) ||
      book.author.toLowerCase().includes(lower) ||
      book.category.toLowerCase().includes(lower)
    )
  }, [books, searchTerm])

  // Handle form submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    
    const formData = editingBook || newBook
    const validation = validateForm(bookSchema, formData)
    
    if (!validation.success) {
      setErrors(validation.errors || {})
      showToast('error', 'Please fix the form errors')
      return
    }
    
    setErrors({})
    
    if (editingBook) {
      updateBook(editingBook.id, editingBook)
      showToast('success', `${editingBook.title} updated successfully`)
      setEditingBook(null)
    } else {
      addBook(newBook)
      showToast('success', `${newBook.title} added to library`)
      setNewBook(EMPTY_BOOK)
      setShowAddModal(false)
    }
  }, [editingBook, newBook, addBook, updateBook, showToast])

  // Handle delete confirmation
  const handleDeleteClick = useCallback((id: string) => {
    setDeleteConfirm({ isOpen: true, itemId: id })
  }, [])

  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirm.itemId) {
      const book = books.find(b => b.id === deleteConfirm.itemId)
      deleteBook(deleteConfirm.itemId)
      showToast('success', `${book?.title || 'Book'} deleted`)
    }
    setDeleteConfirm({ isOpen: false, itemId: null })
  }, [deleteConfirm.itemId, books, deleteBook, showToast])

  // Handle input changes
  const handleInputChange = useCallback((field: keyof Omit<Book, 'id'>, value: string | boolean) => {
    if (editingBook) {
      setEditingBook({ ...editingBook, [field]: value })
    } else {
      setNewBook(prev => ({ ...prev, [field]: value }))
    }
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }, [editingBook, errors])

  const closeModal = useCallback(() => {
    setShowAddModal(false)
    setEditingBook(null)
    setErrors({})
    setNewBook(EMPTY_BOOK)
  }, [])

  const currentBook = editingBook || newBook

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Essential Books Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Track your essential books and resources for emergency preparedness and survival.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-brown-600 text-white rounded-lg hover:bg-brown-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brown-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          aria-label="Add new book"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Add Book</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            aria-label="Search books"
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

      {/* Books List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="bg-gradient-to-r from-brown-50 to-brown-100 dark:from-brown-900/30 dark:to-brown-800/30 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Your Books Collection ({filteredBooks.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredBooks.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" aria-hidden="true" />
              <p>{searchTerm ? 'No books match your search.' : 'No books added yet. Add your first book to get started!'}</p>
            </div>
          ) : (
            filteredBooks.map((book) => (
              <div key={book.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{book.title}</h4>
                      {book.isEssential && (
                        <Star className="h-4 w-4 text-brown-500 dark:text-brown-400 flex-shrink-0" aria-label="Essential book" />
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">by {book.author}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div>
                        <span className="font-medium">Category:</span>
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full border ${getCategoryColor(book.category, BOOK_CATEGORY_COLORS)}`}>
                          {book.category}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" aria-hidden="true" />
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
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-brown-500 rounded"
                      aria-label={`Edit ${book.title}`}
                    >
                      <Edit className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(book.id)}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                      aria-label={`Delete ${book.title}`}
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
      {(showAddModal || editingBook) && (
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
                {editingBook ? 'Edit Book' : 'Add Book'}
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
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Book Title *
                </label>
                <input
                  id="title"
                  type="text"
                  value={currentBook.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  aria-invalid={!!errors.title}
                  aria-describedby={errors.title ? 'title-error' : undefined}
                />
                {errors.title && (
                  <p id="title-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Author *
                </label>
                <input
                  id="author"
                  type="text"
                  value={currentBook.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.author ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  aria-invalid={!!errors.author}
                  aria-describedby={errors.author ? 'author-error' : undefined}
                />
                {errors.author && (
                  <p id="author-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.author}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category *
                </label>
                <select
                  id="category"
                  value={currentBook.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                    errors.category ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  aria-invalid={!!errors.category}
                  aria-describedby={errors.category ? 'category-error' : undefined}
                >
                  <option value="">Select category</option>
                  {BOOK_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && (
                  <p id="category-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  id="location"
                  type="text"
                  value={currentBook.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Where is this book stored?"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes
                </label>
                <textarea
                  id="notes"
                  value={currentBook.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  placeholder="Any additional notes about this book"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isEssential"
                  checked={currentBook.isEssential}
                  onChange={(e) => handleInputChange('isEssential', e.target.checked)}
                  className="h-4 w-4 text-brown-600 focus:ring-brown-500 border-gray-300 dark:border-gray-600 rounded"
                />
                <label htmlFor="isEssential" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  Mark as essential book
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
                  {editingBook ? 'Update' : 'Add'} Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="Delete Book"
        message="Are you sure you want to delete this book? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ isOpen: false, itemId: null })}
      />
    </div>
  )
}
