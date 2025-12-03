/**
 * useBooks Hook
 * Custom hook for managing books with localStorage
 */

import { useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { Book } from '@/types'
import { STORAGE_KEYS } from '@/lib/constants'
import { generateId } from '@/lib/utils'
import { DEFAULT_BOOKS } from '@/lib/defaultData'

export function useBooks() {
  const [books, setBooks] = useLocalStorage<Book[]>(
    STORAGE_KEYS.BOOKS,
    DEFAULT_BOOKS
  )

  const addBook = useCallback((book: Omit<Book, 'id'>) => {
    const newBook: Book = {
      ...book,
      id: generateId()
    }
    setBooks(prev => [...prev, newBook])
    return newBook
  }, [setBooks])

  const updateBook = useCallback((id: string, updates: Partial<Book>) => {
    setBooks(prev =>
      prev.map(book => (book.id === id ? { ...book, ...updates } : book))
    )
  }, [setBooks])

  const deleteBook = useCallback((id: string) => {
    setBooks(prev => prev.filter(book => book.id !== id))
  }, [setBooks])

  const deleteMultiple = useCallback((ids: string[]) => {
    setBooks(prev => prev.filter(book => !ids.includes(book.id)))
  }, [setBooks])

  // Computed values
  const essentialBooks = useMemo(() => 
    books.filter(book => book.isEssential),
    [books]
  )

  const booksByCategory = useMemo(() => {
    const grouped: Record<string, Book[]> = {}
    books.forEach(book => {
      if (!grouped[book.category]) {
        grouped[book.category] = []
      }
      grouped[book.category].push(book)
    })
    return grouped
  }, [books])

  return {
    books,
    setBooks,
    addBook,
    updateBook,
    deleteBook,
    deleteMultiple,
    essentialBooks,
    booksByCategory
  }
}
